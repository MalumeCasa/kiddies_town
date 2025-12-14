-- Dummy data for subjects table with multiple teachers
INSERT INTO subjects (
  name, class_name, teacher, teacher_ids, teacher_names, schedule, duration, topics, assessments
) VALUES 
-- Grade 2 Subjects
(
  'Mathematics', 'Grade 2', 
  'Maria Garcia',
  ARRAY[(SELECT id FROM staff WHERE staff_id = 'TCH001'), (SELECT id FROM staff WHERE staff_id = 'HOD001')],
  ARRAY['Maria Garcia', 'Lisa Thompson'],
  'Monday, Wednesday, Friday - 9:00 AM',
  '45 minutes',
  ARRAY['Basic Addition', 'Subtraction', 'Shapes', 'Counting to 100', 'Simple Patterns'],
  '[{"type": "Quiz", "date": "2024-02-15"}, {"type": "Mid-term", "date": "2024-03-20"}, {"type": "Final Exam", "date": "2024-06-10"}]'
),

(
  'English Language Arts', 'Grade 2',
  'Jennifer Davis',
  ARRAY[(SELECT id FROM staff WHERE staff_id = 'TCH003')],
  ARRAY['Jennifer Davis'],
  'Monday to Friday - 10:00 AM',
  '50 minutes',
  ARRAY['Phonics', 'Reading Comprehension', 'Basic Grammar', 'Vocabulary Building', 'Story Writing'],
  '[{"type": "Spelling Test", "date": "2024-02-20"}, {"type": "Reading Assessment", "date": "2024-04-05"}, {"type": "Writing Project", "date": "2024-05-15"}]'
),

(
  'Science', 'Grade 2',
  'James Wilson',
  ARRAY[(SELECT id FROM staff WHERE staff_id = 'TCH002'), (SELECT id FROM staff WHERE staff_id = 'TCH001')],
  ARRAY['James Wilson', 'Maria Garcia'],
  'Tuesday, Thursday - 11:00 AM',
  '40 minutes',
  ARRAY['Plants and Animals', 'Weather Patterns', 'Simple Machines', 'The Solar System', 'Healthy Habits'],
  '[{"type": "Science Project", "date": "2024-03-10"}, {"type": "Lab Report", "date": "2024-04-25"}, {"type": "Final Test", "date": "2024-06-05"}]'
),

-- Grade 5 Subjects
(
  'Mathematics', 'Grade 5',
  'Maria Garcia',
  ARRAY[(SELECT id FROM staff WHERE staff_id = 'TCH001'), (SELECT id FROM staff WHERE staff_id = 'HOD001')],
  ARRAY['Maria Garcia', 'Lisa Thompson'],
  'Monday, Wednesday, Friday - 1:00 PM',
  '50 minutes',
  ARRAY['Fractions', 'Decimals', 'Basic Geometry', 'Multiplication Tables', 'Word Problems'],
  '[{"type": "Chapter Test", "date": "2024-02-25"}, {"type": "Geometry Quiz", "date": "2024-04-10"}, {"type": "Final Exam", "date": "2024-06-12"}]'
),

(
  'Advanced Science', 'Grade 5',
  'James Wilson',
  ARRAY[(SELECT id FROM staff WHERE staff_id = 'TCH002'), (SELECT id FROM staff WHERE staff_id = 'TCH004')],
  ARRAY['James Wilson', 'David Martinez'],
  'Tuesday, Thursday - 2:00 PM',
  '55 minutes',
  ARRAY['Human Body Systems', 'Electricity', 'Ecosystems', 'Chemical Reactions', 'Scientific Method'],
  '[{"type": "Lab Practical", "date": "2024-03-15"}, {"type": "Research Paper", "date": "2024-05-01"}, {"type": "Comprehensive Exam", "date": "2024-06-08"}]'
),

(
  'Social Studies', 'Grade 5',
  'David Martinez',
  ARRAY[(SELECT id FROM staff WHERE staff_id = 'TCH004'), (SELECT id FROM staff WHERE staff_id = 'TCH003')],
  ARRAY['David Martinez', 'Jennifer Davis'],
  'Monday, Wednesday - 3:00 PM',
  '45 minutes',
  ARRAY['American History', 'World Geography', 'Government Basics', 'Economics', 'Cultural Studies'],
  '[{"type": "Map Quiz", "date": "2024-02-28"}, {"type": "History Project", "date": "2024-04-20"}, {"type": "Final Presentation", "date": "2024-06-03"}]'
),

-- Grade 3 Subjects
(
  'Mathematics', 'Grade 3',
  'Lisa Thompson',
  ARRAY[(SELECT id FROM staff WHERE staff_id = 'HOD001'), (SELECT id FROM staff WHERE staff_id = 'TCH001')],
  ARRAY['Lisa Thompson', 'Maria Garcia'],
  'Monday to Friday - 9:30 AM',
  '45 minutes',
  ARRAY['Multiplication', 'Division', 'Measurement', 'Time', 'Money'],
  '[{"type": "Multiplication Test", "date": "2024-02-18"}, {"type": "Measurement Quiz", "date": "2024-04-12"}, {"type": "Final Assessment", "date": "2024-06-07"}]'
),

(
  'English Literature', 'Grade 3',
  'Jennifer Davis',
  ARRAY[(SELECT id FROM staff WHERE staff_id = 'TCH003'), (SELECT id FROM staff WHERE staff_id = 'TCH005')],
  ARRAY['Jennifer Davis', 'Emily Rodriguez'],
  'Tuesday, Thursday - 10:30 AM',
  '50 minutes',
  ARRAY['Reading Fluency', 'Comprehension Skills', 'Creative Writing', 'Poetry', 'Book Reports'],
  '[{"type": "Book Report", "date": "2024-03-05"}, {"type": "Poetry Recitation", "date": "2024-04-30"}, {"type": "Reading Assessment", "date": "2024-06-02"}]'
),

-- Grade 4 Subjects
(
  'Science', 'Grade 4',
  'James Wilson',
  ARRAY[(SELECT id FROM staff WHERE staff_id = 'TCH002'), (SELECT id FROM staff WHERE staff_id = 'TCH004')],
  ARRAY['James Wilson', 'David Martinez'],
  'Monday, Wednesday, Friday - 11:30 AM',
  '50 minutes',
  ARRAY['Earth Science', 'Physical Science', 'Life Cycles', 'Energy', 'Scientific Inquiry'],
  '[{"type": "Science Fair", "date": "2024-03-25"}, {"type": "Lab Notebook", "date": "2024-05-10"}, {"type": "Unit Test", "date": "2024-06-09"}]'
),

(
  'History', 'Grade 4',
  'David Martinez',
  ARRAY[(SELECT id FROM staff WHERE staff_id = 'TCH004')],
  ARRAY['David Martinez'],
  'Tuesday, Thursday - 1:30 PM',
  '45 minutes',
  ARRAY['Local History', 'Famous Americans', 'Ancient Civilizations', 'Timelines', 'Historical Figures'],
  '[{"type": "Timeline Project", "date": "2024-03-01"}, {"type": "Research Report", "date": "2024-05-05"}, {"type": "Oral Presentation", "date": "2024-06-04"}]'
),

-- Music for multiple grades
(
  'Music', 'Grade 2',
  'Emily Rodriguez',
  ARRAY[(SELECT id FROM staff WHERE staff_id = 'TCH005'), (SELECT id FROM staff WHERE staff_id = 'TCH003')],
  ARRAY['Emily Rodriguez', 'Jennifer Davis'],
  'Friday - 2:30 PM',
  '40 minutes',
  ARRAY['Rhythm', 'Singing', 'Basic Instruments', 'Music Theory', 'Performance'],
  '[{"type": "Performance", "date": "2024-03-30"}, {"type": "Rhythm Test", "date": "2024-05-20"}]'
),

(
  'Music', 'Grade 5',
  'Emily Rodriguez',
  ARRAY[(SELECT id FROM staff WHERE staff_id = 'TCH005')],
  ARRAY['Emily Rodriguez'],
  'Thursday - 3:30 PM',
  '40 minutes',
  ARRAY['Music History', 'Composition', 'Advanced Instruments', 'Ensemble', 'Music Appreciation'],
  '[{"type": "Composition Project", "date": "2024-04-15"}, {"type": "Ensemble Performance", "date": "2024-06-01"}]'
),

-- Team-taught Advanced Mathematics
(
  'Advanced Mathematics', 'Grade 5',
  'Lisa Thompson',
  ARRAY[(SELECT id FROM staff WHERE staff_id = 'HOD001'), (SELECT id FROM staff WHERE staff_id = 'TCH001'), (SELECT id FROM staff WHERE staff_id = 'TCH002')],
  ARRAY['Lisa Thompson', 'Maria Garcia', 'James Wilson'],
  'Monday, Wednesday - 4:00 PM',
  '60 minutes',
  ARRAY['Algebra Basics', 'Geometry Advanced', 'Statistics', 'Problem Solving', 'Logical Reasoning'],
  '[{"type": "Algebra Test", "date": "2024-03-08"}, {"type": "Geometry Project", "date": "2024-05-12"}, {"type": "Final Exam", "date": "2024-06-15"}]'
);