-- Essential schema setup for classes and subjects sync
-- Add missing columns if they don't exist

ALTER TABLE classes 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

ALTER TABLE subjects 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Ensure unique constraint on classes
ALTER TABLE classes 
DROP CONSTRAINT IF EXISTS unique_class_name_section,
ADD CONSTRAINT unique_class_name_section UNIQUE (class_name, class_section);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_classes_name_section ON classes(class_name, class_section);
CREATE INDEX IF NOT EXISTS idx_subjects_class_name_section ON subjects(class_name, class_section);