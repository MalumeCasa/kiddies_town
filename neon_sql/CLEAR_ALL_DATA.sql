-- Clear all data from tables (in reverse order to avoid foreign key constraints)
DELETE FROM staff_leave;
DELETE FROM staff_attendance;
DELETE FROM staff_salary;
DELETE FROM staff;
DELETE FROM subject_teachers;
DELETE FROM subjects;
DELETE FROM class_activities;
DELETE FROM classes;
DELETE FROM teachers;
DELETE FROM students;
DELETE FROM registered_students;

-- Reset sequences (if you want to start IDs from 1 again)
ALTER SEQUENCE staff_leave_id_seq RESTART WITH 1;
ALTER SEQUENCE staff_attendance_id_seq RESTART WITH 1;
ALTER SEQUENCE staff_salary_id_seq RESTART WITH 1;
ALTER SEQUENCE staff_id_seq RESTART WITH 1;
ALTER SEQUENCE subject_teachers_id_seq RESTART WITH 1;
ALTER SEQUENCE subjects_id_seq RESTART WITH 1;
ALTER SEQUENCE class_activities_id_seq RESTART WITH 1;
ALTER SEQUENCE classes_id_seq RESTART WITH 1;
ALTER SEQUENCE teachers_id_seq RESTART WITH 1;
ALTER SEQUENCE students_id_seq RESTART WITH 1;
ALTER SEQUENCE registered_students_id_seq RESTART WITH 1;