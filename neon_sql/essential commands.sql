-- Check sync status
SELECT * FROM check_sync_status();

-- Find issues
SELECT * FROM find_sync_issues();

-- Force sync a specific class
SELECT force_sync_class('Grade 12', 'secondary');

-- Emergency disable triggers
SELECT disable_all_triggers();

-- Emergency enable triggers  
SELECT enable_all_triggers();