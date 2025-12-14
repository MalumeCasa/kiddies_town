-- Clean up existing duplicate classes and sync with subjects

-- Step 1: Create temporary table with unique classes from subjects
CREATE TEMPORARY TABLE temp_unique_classes AS
WITH class_groups AS (
    SELECT DISTINCT
        class_name,
        COALESCE(class_section, 'primary') as class_section
    FROM subjects
    WHERE class_name IS NOT NULL AND class_name != ''
),
class_teachers AS (
    SELECT 
        cg.class_name,
        cg.class_section,
        ARRAY_AGG(DISTINCT teacher) as teachers
    FROM class_groups cg
    CROSS JOIN LATERAL (
        SELECT DISTINCT unnest(s.teacher_names) as teacher
        FROM subjects s
        WHERE s.class_name = cg.class_name 
        AND COALESCE(s.class_section, 'primary') = cg.class_section
    ) t
    WHERE teacher IS NOT NULL AND teacher != ''
    GROUP BY cg.class_name, cg.class_section
),
class_subjects AS (
    SELECT 
        cg.class_name,
        cg.class_section,
        ARRAY_AGG(DISTINCT s.name) as subjects
    FROM class_groups cg
    JOIN subjects s ON s.class_name = cg.class_name 
        AND COALESCE(s.class_section, 'primary') = cg.class_section
    WHERE s.name IS NOT NULL AND s.name != ''
    GROUP BY cg.class_name, cg.class_section
)
SELECT 
    cg.class_name,
    cg.class_section,
    COALESCE(ct.teachers, '{}'::text[]) as teachers,
    COALESCE(cs.subjects, '{}'::text[]) as subjects
FROM class_groups cg
LEFT JOIN class_teachers ct ON ct.class_name = cg.class_name AND ct.class_section = cg.class_section
LEFT JOIN class_subjects cs ON cs.class_name = cg.class_name AND cs.class_section = cg.class_section;

-- Step 2: Clear and rebuild classes table
TRUNCATE TABLE classes RESTART IDENTITY;

INSERT INTO classes (class_name, class_section, teachers, subjects, created_at, updated_at)
SELECT 
    class_name,
    class_section,
    teachers,
    subjects,
    NOW(),
    NOW()
FROM temp_unique_classes;

-- Step 3: Verify cleanup
SELECT 'Cleanup complete!' as status;
SELECT 'Total classes:' as info, COUNT(*) FROM classes;
SELECT 'Unique class combinations:' as info, COUNT(DISTINCT (class_name, class_section)) FROM classes;