-- Simple and reliable sync between subjects and classes
-- Drop existing triggers to avoid conflicts

DROP TRIGGER IF EXISTS sync_class_on_subject_change ON subjects;
DROP TRIGGER IF EXISTS prevent_manual_duplicate_class_trigger ON classes;
DROP TRIGGER IF EXISTS prevent_duplicate_class_trigger ON classes;

-- Simple sync function that handles existing classes properly
CREATE OR REPLACE FUNCTION sync_class_from_subject()
RETURNS TRIGGER AS $$
BEGIN
    -- When a subject is inserted or updated
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Only process if we have valid data
        IF NEW.class_name IS NOT NULL AND NEW.class_name != '' AND NEW.name IS NOT NULL AND NEW.name != '' THEN
            
            -- Check if class exists first
            IF EXISTS (
                SELECT 1 FROM classes 
                WHERE class_name = NEW.class_name 
                AND class_section = COALESCE(NEW.class_section, 'primary')
            ) THEN
                -- Update existing class
                UPDATE classes 
                SET 
                    teachers = (
                        SELECT ARRAY_AGG(DISTINCT teacher)
                        FROM (
                            SELECT unnest(classes.teachers) as teacher
                            UNION
                            SELECT unnest(NEW.teacher_names)
                        ) t
                        WHERE teacher IS NOT NULL AND teacher != ''
                    ),
                    subjects = (
                        SELECT ARRAY_AGG(DISTINCT subject)
                        FROM (
                            SELECT unnest(classes.subjects) as subject
                            UNION
                            SELECT NEW.name
                        ) s
                        WHERE subject IS NOT NULL AND subject != ''
                    ),
                    updated_at = NOW()
                WHERE class_name = NEW.class_name 
                AND class_section = COALESCE(NEW.class_section, 'primary');
            ELSE
                -- Insert new class
                INSERT INTO classes (class_name, class_section, teachers, subjects, created_at, updated_at)
                VALUES (
                    NEW.class_name,
                    COALESCE(NEW.class_section, 'primary'),
                    COALESCE(NEW.teacher_names, '{}'::text[]),
                    ARRAY[NEW.name],
                    NOW(),
                    NOW()
                );
            END IF;
        END IF;
    END IF;
    
    -- When a subject is deleted
    IF TG_OP = 'DELETE' THEN
        -- Only process if we have valid class data
        IF OLD.class_name IS NOT NULL AND OLD.class_name != '' THEN
            
            -- Remove the subject from the class
            UPDATE classes 
            SET 
                subjects = ARRAY_REMOVE(subjects, OLD.name),
                updated_at = NOW()
            WHERE class_name = OLD.class_name 
            AND COALESCE(class_section, 'primary') = COALESCE(OLD.class_section, 'primary');
            
            -- Update teachers to remove any that are no longer used
            UPDATE classes 
            SET teachers = (
                SELECT ARRAY_AGG(DISTINCT t.teacher_name)
                FROM (
                    SELECT DISTINCT unnest(teacher_names) as teacher_name
                    FROM subjects 
                    WHERE class_name = OLD.class_name 
                    AND COALESCE(class_section, 'primary') = COALESCE(OLD.class_section, 'primary')
                ) t
                WHERE teacher_name IS NOT NULL AND teacher_name != ''
            ),
            updated_at = NOW()
            WHERE class_name = OLD.class_name 
            AND COALESCE(class_section, 'primary') = COALESCE(OLD.class_section, 'primary');
            
            -- Delete class if no subjects left
            DELETE FROM classes 
            WHERE class_name = OLD.class_name 
            AND COALESCE(class_section, 'primary') = COALESCE(OLD.class_section, 'primary')
            AND (subjects IS NULL OR array_length(subjects, 1) = 0);
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create the sync trigger
CREATE TRIGGER sync_class_on_subject_change
    AFTER INSERT OR UPDATE OR DELETE ON subjects
    FOR EACH ROW
    EXECUTE FUNCTION sync_class_from_subject();