-- Essential monitoring and maintenance functions

-- Check sync status between subjects and classes
CREATE OR REPLACE FUNCTION check_sync_status()
RETURNS TABLE(
    classes_count BIGINT,
    subjects_class_combinations BIGINT,
    out_of_sync_classes BIGINT,
    sync_status TEXT
) AS $$
DECLARE
    class_count BIGINT;
    subject_combos BIGINT;
    sync_diff BIGINT;
BEGIN
    SELECT COUNT(*) INTO class_count FROM classes;
    
    SELECT COUNT(DISTINCT (class_name, COALESCE(class_section, 'primary'))) 
    INTO subject_combos 
    FROM subjects 
    WHERE class_name IS NOT NULL AND class_name != '';
    
    sync_diff := ABS(class_count - subject_combos);
    
    RETURN QUERY 
    SELECT 
        class_count,
        subject_combos,
        sync_diff,
        CASE 
            WHEN sync_diff = 0 THEN 'IN SYNC'
            WHEN sync_diff <= 2 THEN 'MINOR OUT OF SYNC'
            ELSE 'OUT OF SYNC'
        END;
END;
$$ LANGUAGE plpgsql;

-- Manual sync function for bulk operations
CREATE OR REPLACE FUNCTION manual_sync_all_classes()
RETURNS TABLE(
    classes_created INT,
    classes_updated INT,
    classes_deleted INT
) AS $$
DECLARE
    created_count INT := 0;
    updated_count INT := 0;
    deleted_count INT := 0;
BEGIN
    -- Temporarily disable trigger to avoid recursion
    DROP TRIGGER IF EXISTS sync_class_on_subject_change ON subjects;
    
    -- Use the cleanup logic to rebuild
    PERFORM FROM cleanup_duplicate_classes();
    
    -- Re-enable trigger
    CREATE TRIGGER sync_class_on_subject_change
        AFTER INSERT OR UPDATE OR DELETE ON subjects
        FOR EACH ROW
        EXECUTE FUNCTION sync_class_from_subject();
    
    RETURN QUERY SELECT created_count, updated_count, deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Find sync issues
CREATE OR REPLACE FUNCTION find_sync_issues()
RETURNS TABLE(
    class_name TEXT,
    class_section TEXT,
    issue_type TEXT,
    details TEXT
) AS $$
BEGIN
    -- Classes that don't have corresponding subjects
    RETURN QUERY
    SELECT 
        c.class_name,
        c.class_section,
        'ORPHANED_CLASS' as issue_type,
        'Class exists but no subjects found' as details
    FROM classes c
    WHERE NOT EXISTS (
        SELECT 1 FROM subjects s 
        WHERE s.class_name = c.class_name 
        AND COALESCE(s.class_section, 'primary') = c.class_section
    );

    -- Subjects that don't have corresponding classes
    RETURN QUERY
    SELECT 
        s.class_name,
        COALESCE(s.class_section, 'primary') as class_section,
        'MISSING_CLASS' as issue_type,
        'Subjects exist but class is missing' as details
    FROM subjects s
    WHERE NOT EXISTS (
        SELECT 1 FROM classes c 
        WHERE c.class_name = s.class_name 
        AND c.class_section = COALESCE(s.class_section, 'primary')
    )
    AND s.class_name IS NOT NULL AND s.class_name != ''
    GROUP BY s.class_name, COALESCE(s.class_section, 'primary');
END;
$$ LANGUAGE plpgsql;