-- Trigger to synchronize teachers table with staff table
--

-- Create a function that will be called by the trigger
CREATE OR REPLACE FUNCTION sync_teachers_from_staff()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the staff member is a teacher
    IF NEW.role = 'teacher' AND NEW.is_active = true THEN
        -- Insert or update the teachers table
        INSERT INTO teachers (
            id, 
            name, 
            surname, 
            role, 
            email, 
            phone, 
            subjects, 
            experience, 
            qualification, 
            staff_id
        )
        VALUES (
            NEW.id,  -- Use the same ID as staff table
            NEW.name,
            NEW.surname,
            NEW.position,  -- Use position as role in teachers table
            NEW.email,
            NEW.phone,
            COALESCE(NEW.subjects, ARRAY[]::text[]),  -- Handle NULL subjects
            NEW.experience,
            NEW.qualification,
            NEW.id  -- Use staff.id as staff_id in teachers table (since staff.staff_id is varchar)
        )
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            surname = EXCLUDED.surname,
            role = EXCLUDED.role,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            subjects = EXCLUDED.subjects,
            experience = EXCLUDED.experience,
            qualification = EXCLUDED.qualification,
            staff_id = EXCLUDED.staff_id;
    
    -- If staff member is no longer a teacher or is inactive, remove from teachers table
    ELSIF (OLD.role = 'teacher' AND (NEW.role != 'teacher' OR NEW.is_active = false)) THEN
        DELETE FROM teachers WHERE id = OLD.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger that fires after INSERT or UPDATE on staff table
CREATE OR REPLACE TRIGGER trigger_sync_teachers_from_staff
    AFTER INSERT OR UPDATE ON staff
    FOR EACH ROW
    EXECUTE FUNCTION sync_teachers_from_staff();

-- Additional trigger for handling deletions from staff table
CREATE OR REPLACE FUNCTION remove_teacher_on_staff_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- If a staff member is deleted and they were a teacher, remove from teachers table
    IF OLD.role = 'teacher' THEN
        DELETE FROM teachers WHERE id = OLD.id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_remove_teacher_on_staff_delete
    AFTER DELETE ON staff
    FOR EACH ROW
    EXECUTE FUNCTION remove_teacher_on_staff_delete();


-- You can add more triggers here as needed

-- Populate existing data

-- Sync existing teachers from staff table
INSERT INTO teachers (
    id, 
    name, 
    surname, 
    role, 
    email, 
    phone, 
    subjects, 
    experience, 
    qualification, 
    staff_id
)
SELECT 
    id,
    name,
    surname,
    position,
    email,
    phone,
    COALESCE(subjects, ARRAY[]::text[]),
    experience,
    qualification,
    id  -- or staff_id if using the alternative version
FROM staff 
WHERE role = 'teacher' AND is_active = true
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    surname = EXCLUDED.surname,
    role = EXCLUDED.role,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    subjects = EXCLUDED.subjects,
    experience = EXCLUDED.experience,
    qualification = EXCLUDED.qualification,
    staff_id = EXCLUDED.staff_id;