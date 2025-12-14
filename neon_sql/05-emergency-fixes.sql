-- Emergency fixes for when things go wrong

-- Disable all triggers to allow manual operations
CREATE OR REPLACE FUNCTION disable_all_triggers()
RETURNS TEXT AS $$
BEGIN
    ALTER TABLE classes DISABLE TRIGGER ALL;
    ALTER TABLE subjects DISABLE TRIGGER ALL;
    RETURN 'All triggers disabled';
END;
$$ LANGUAGE plpgsql;

-- Enable all triggers
CREATE OR REPLACE FUNCTION enable_all_triggers()
RETURNS TEXT AS $$
BEGIN
    ALTER TABLE classes ENABLE TRIGGER ALL;
    ALTER TABLE subjects ENABLE TRIGGER ALL;
    RETURN 'All triggers enabled';
END;
$$ LANGUAGE plpgsql;

-- Force sync a single class
CREATE OR REPLACE FUNCTION force_sync_class(
    class_name_input TEXT, 
    class_section_input TEXT DEFAULT 'primary'
)
RETURNS TEXT AS $$
BEGIN
    -- Delete existing class
    DELETE FROM classes 
    WHERE class_name = class_name_input 
    AND class_section = COALESCE(class_section_input, 'primary');
    
    -- Recreate from subjects
    INSERT INTO classes (class_name, class_section, teachers, subjects, created_at, updated_at)
    WITH class_teachers AS (
        SELECT ARRAY_AGG(DISTINCT teacher) as teachers
        FROM (
            SELECT DISTINCT unnest(teacher_names) as teacher
            FROM subjects 
            WHERE class_name = class_name_input 
            AND COALESCE(class_section, 'primary') = COALESCE(class_section_input, 'primary')
        ) t
        WHERE teacher IS NOT NULL AND teacher != ''
    ),
    class_subjects AS (
        SELECT ARRAY_AGG(DISTINCT name) as subjects
        FROM subjects 
        WHERE class_name = class_name_input 
        AND COALESCE(class_section, 'primary') = COALESCE(class_section_input, 'primary')
        AND name IS NOT NULL AND name != ''
    )
    SELECT 
        class_name_input,
        COALESCE(class_section_input, 'primary'),
        COALESCE((SELECT teachers FROM class_teachers), '{}'::text[]),
        COALESCE((SELECT subjects FROM class_subjects), '{}'::text[]),
        NOW(),
        NOW();
    
    RETURN 'Class ' || class_name_input || ' synced successfully';
END;
$$ LANGUAGE plpgsql;