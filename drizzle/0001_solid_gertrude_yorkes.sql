CREATE TABLE "assignment_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"assignment_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"submitted_at" timestamp DEFAULT now(),
	"marks" numeric(6, 2),
	"feedback" text,
	"attachments" text[],
	"status" varchar(20) DEFAULT 'submitted',
	CONSTRAINT "unique_assignment_submission" UNIQUE("assignment_id","student_id")
);
--> statement-breakpoint
CREATE TABLE "assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"class_id" integer NOT NULL,
	"subject_id" integer NOT NULL,
	"due_date" date NOT NULL,
	"max_marks" numeric(6, 2) NOT NULL,
	"assigned_by" integer NOT NULL,
	"attachments" text[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "attendance_summary" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"class_id" integer NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"presentDays" integer DEFAULT 0,
	"absentDays" integer DEFAULT 0,
	"lateDays" integer DEFAULT 0,
	"halfDays" integer DEFAULT 0,
	"totalSchoolDays" integer DEFAULT 0,
	CONSTRAINT "unique_attendance_summary" UNIQUE("student_id","month","year")
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"sender_type" varchar(20) NOT NULL,
	"message" text NOT NULL,
	"message_type" varchar(20) DEFAULT 'text',
	"attachments" text[],
	"read_by" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_room_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"user_type" varchar(20) NOT NULL,
	"joined_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_chat_member" UNIQUE("room_id","user_id","user_type")
);
--> statement-breakpoint
CREATE TABLE "chat_rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"type" varchar(20) DEFAULT 'direct' NOT NULL,
	"class_id" integer,
	"created_by" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "class_periods" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_id" integer NOT NULL,
	"period_number" integer NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"subject_id" integer,
	"day_of_week" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "unique_class_period" UNIQUE("class_id","day_of_week","period_number")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"target_audience" varchar(20) DEFAULT 'all',
	"class_id" integer,
	"created_by" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"class_id" integer NOT NULL,
	"subject_id" integer,
	"max_marks" numeric(6, 2) NOT NULL,
	"exam_date" date NOT NULL,
	"academic_year" varchar(10) NOT NULL,
	"term" integer NOT NULL,
	"weightage" integer DEFAULT 100,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_exam_class_subject" UNIQUE("name","class_id","subject_id","academic_year")
);
--> statement-breakpoint
CREATE TABLE "fee_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fee_discounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"fee_structure_id" integer,
	"discount_type" varchar(50) NOT NULL,
	"discount_amount" numeric(10, 2),
	"discount_percentage" numeric(5, 2),
	"reason" text,
	"start_date" date NOT NULL,
	"end_date" date,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fee_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_fee_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_date" date NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"reference_number" text,
	"received_by" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fee_structure" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"class_id" integer,
	"amount" numeric(10, 2) NOT NULL,
	"frequency" varchar(20) DEFAULT 'monthly',
	"due_date" integer,
	"is_active" boolean DEFAULT true,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "grade_system" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"min_marks" numeric(5, 2) NOT NULL,
	"max_marks" numeric(5, 2) NOT NULL,
	"grade" varchar(5) NOT NULL,
	"points" numeric(3, 2),
	"description" text,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "unique_grade_range" UNIQUE("min_marks","max_marks")
);
--> statement-breakpoint
CREATE TABLE "grades" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"exam_id" integer NOT NULL,
	"marks_obtained" numeric(6, 2) NOT NULL,
	"grade" varchar(5),
	"comments" text,
	"recorded_by" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_student_exam" UNIQUE("student_id","exam_id")
);
--> statement-breakpoint
CREATE TABLE "notices" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"priority" varchar(20) DEFAULT 'normal',
	"target_audience" varchar(20) DEFAULT 'all',
	"start_date" date NOT NULL,
	"end_date" date,
	"is_active" boolean DEFAULT true,
	"created_by" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"related_id" integer,
	"related_type" varchar(50),
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "parent_student_relations" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"relationship" text NOT NULL,
	"is_primary_contact" boolean DEFAULT false,
	"emergency_contact" boolean DEFAULT false,
	"authorized_to_pickup" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_parent_student_relation" UNIQUE("parent_id","student_id")
);
--> statement-breakpoint
CREATE TABLE "parents" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"name" text NOT NULL,
	"surname" text NOT NULL,
	"id_number" text,
	"date_of_birth" text,
	"gender" text,
	"email" text,
	"phone" text NOT NULL,
	"alternate_phone" text,
	"home_address" text,
	"postal_address" text,
	"work_address" text,
	"occupation" text,
	"employer" text,
	"work_phone" text,
	"relationship_to_student" text NOT NULL,
	"is_primary_contact" boolean DEFAULT false,
	"emergency_contact" boolean DEFAULT false,
	"authorized_to_pickup" boolean DEFAULT true,
	"responsible_for_fees" boolean DEFAULT false,
	"fee_payment_method" text,
	"bank_account_details" jsonb,
	"medical_consent" boolean DEFAULT false,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "parents_id_number_unique" UNIQUE("id_number"),
	CONSTRAINT "parents_name_not_empty" CHECK ((name IS NOT NULL) AND (name <> ''::text)),
	CONSTRAINT "parents_surname_not_empty" CHECK ((surname IS NOT NULL) AND (surname <> ''::text))
);
--> statement-breakpoint
CREATE TABLE "registered_students" (
	"id" serial PRIMARY KEY NOT NULL,
	"surname" text NOT NULL,
	"name" text NOT NULL,
	"preferredName" text,
	"date_of_birth" text NOT NULL,
	"id_number" text,
	"sex" text,
	"home_language" text[],
	"religion" text,
	"number_of_children_in_family" integer,
	"position_in_family" integer,
	"authorized_to_bring" text[],
	"authorized_to_collect" text[],
	"previous_school" text,
	"intended_primary_school" text,
	"care_required" text,
	"date_of_enrolment" text NOT NULL,
	"age_at_enrolment" integer,
	"emergency_contact_friend_name" text,
	"emergency_contact_friend_relationship" text,
	"emergency_contact_friend_address" text,
	"emergency_contact_friend_work_phone" text,
	"emergency_contact_friend_home_phone" text,
	"emergency_contact_friend_cell" text,
	"emergency_contact_kin_name" text,
	"emergency_contact_kin_relationship" text,
	"emergency_contact_kin_address" text,
	"emergency_contact_kin_work_phone" text,
	"emergency_contact_kin_home_phone" text,
	"emergency_contact_kin_cell" text,
	"transport_contact_1_name" text,
	"transport_contact_1_phone" text,
	"transport_contact_2_name" text,
	"transport_contact_2_phone" text,
	"transport_contact_3_name" text,
	"transport_contact_3_phone" text,
	"special_instructions" text,
	"medical_consent_1" text,
	"medical_consent_1_father" boolean DEFAULT false,
	"medical_consent_1_mother" boolean DEFAULT false,
	"medical_consent_1_guardian" boolean DEFAULT false,
	"medical_consent_2" text,
	"medical_consent_2_father" boolean DEFAULT false,
	"medical_consent_2_mother" boolean DEFAULT false,
	"medical_consent_2_guardian" boolean DEFAULT false,
	"marital_status" text,
	"lives_with" text[],
	"mother_title" text,
	"mother_surname" text,
	"mother_first_names" text,
	"mother_id_number" text,
	"mother_occupation" text,
	"mother_employer" text,
	"mother_work_phone" text,
	"mother_home_phone" text,
	"mother_cell" text,
	"mother_email" text,
	"mother_home_address" text,
	"mother_work_address" text,
	"father_title" text,
	"father_surname" text,
	"father_first_names" text,
	"father_id_number" text,
	"father_occupation" text,
	"father_employer" text,
	"father_work_phone" text,
	"father_home_phone" text,
	"father_cell" text,
	"father_email" text,
	"father_home_address" text,
	"father_work_address" text,
	"guardian_title" text,
	"guardian_surname" text,
	"guardian_first_names" text,
	"guardian_id_number" text,
	"guardian_occupation" text,
	"guardian_employer" text,
	"guardian_work_phone" text,
	"guardian_home_phone" text,
	"guardian_cell" text,
	"guardian_email" text,
	"guardian_home_address" text,
	"guardian_work_address" text,
	"popi_consent" boolean DEFAULT false,
	"mother_popi_signature" text,
	"mother_popi_date" text,
	"father_popi_signature" text,
	"father_popi_date" text,
	"signatory1_full_name" text,
	"signatory1_id_number" text,
	"signatory1_relation" text,
	"signatory1_cell_number" text,
	"signatory1_email" text,
	"signatory1_physical_address" text,
	"signatory1_signature" text,
	"signatory1_date_signed" text,
	"signatory2_full_name" text,
	"signatory2_id_number" text,
	"signatory2_relation" text,
	"signatory2_cell_number" text,
	"signatory2_email" text,
	"signatory2_physical_address" text,
	"signatory2_signature" text,
	"signatory2_date_signed" text,
	"signed_at" text,
	"agreement_date" text,
	"witness_name" text,
	"witness_signature" text,
	"indemnity_agreement" boolean DEFAULT false,
	"financial_agreed_terms" boolean,
	"financial_agreed_liability" boolean,
	"financial_agreed_cancellation" boolean,
	"mother_financial_signature" text,
	"mother_financial_date" text,
	"father_financial_signature" text,
	"father_financial_date" text,
	"monthly_amount" integer,
	"payment_date" integer,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"address" text,
	"email" text,
	"phone" text,
	"family_doctor" text,
	"doctor_phone" text,
	"medical_conditions" text[],
	"medical_conditions_details" text,
	"childhood_sicknesses" text,
	"life_threatening_allergies" text,
	"other_allergies" text,
	"regular_medications" boolean,
	"regular_medications_details" text,
	"major_operations" text,
	"behavior_problems" text,
	"speech_hearing_problems" text,
	"birth_complications" text,
	"immunisation_up_to_date" boolean,
	"family_medical_history" text,
	CONSTRAINT "registered_students_surname_not_empty" CHECK ((surname IS NOT NULL) AND (surname <> ''::text))
);
--> statement-breakpoint
CREATE TABLE "report_cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"academic_year" varchar(10) NOT NULL,
	"term" integer NOT NULL,
	"overall_grade" varchar(5),
	"position_in_class" integer,
	"total_students" integer,
	"teacher_comments" text,
	"principal_comments" text,
	"attendance_summary" jsonb,
	"generated_by" integer,
	"generated_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_report_card" UNIQUE("student_id","academic_year","term")
);
--> statement-breakpoint
CREATE TABLE "school_calendar" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"day_type" varchar(20) DEFAULT 'school_day' NOT NULL,
	"description" text,
	"academic_year" varchar(10) NOT NULL,
	"term" integer NOT NULL,
	CONSTRAINT "unique_calendar_date" UNIQUE("date","academic_year")
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"staff_id" varchar(20) NOT NULL,
	"name" text NOT NULL,
	"surname" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address" text,
	"date_of_birth" text,
	"gender" text,
	"emergency_contact" text,
	"emergency_phone" text,
	"employment_type" text NOT NULL,
	"position" text NOT NULL,
	"department" text NOT NULL,
	"hire_date" text NOT NULL,
	"termination_date" text,
	"employment_status" text DEFAULT 'active',
	"qualification" text NOT NULL,
	"specialization" text,
	"experience" integer DEFAULT 0 NOT NULL,
	"certifications" text[],
	"subjects" text[],
	"role" text NOT NULL,
	"permissions" jsonb,
	"access_level" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "staff_staff_id_unique" UNIQUE("staff_id"),
	CONSTRAINT "staff_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "staff_attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"staff_id" integer NOT NULL,
	"date" text NOT NULL,
	"status" text NOT NULL,
	"check_in" text,
	"check_out" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "staff_leave" (
	"id" serial PRIMARY KEY NOT NULL,
	"staff_id" integer NOT NULL,
	"leave_type" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"status" text DEFAULT 'pending',
	"reason" text,
	"approved_by" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "staff_salary" (
	"id" serial PRIMARY KEY NOT NULL,
	"staff_id" integer NOT NULL,
	"base_salary" integer NOT NULL,
	"allowances" jsonb DEFAULT '{}'::jsonb,
	"deductions" jsonb DEFAULT '{}'::jsonb,
	"effective_date" text NOT NULL,
	"payment_frequency" text DEFAULT 'monthly'
);
--> statement-breakpoint
CREATE TABLE "student_attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"class_id" integer NOT NULL,
	"date" date NOT NULL,
	"status" varchar(20) DEFAULT 'present' NOT NULL,
	"subject_id" integer,
	"period" integer,
	"remarks" text,
	"recorded_by" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_student_attendance" UNIQUE("student_id","date","subject_id"),
	CONSTRAINT "attendance_status_check" CHECK (status IN ('present', 'absent', 'late', 'half-day'))
);
--> statement-breakpoint
CREATE TABLE "student_fees" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"fee_structure_id" integer NOT NULL,
	"academic_year" varchar(10) NOT NULL,
	"term" integer,
	"amount_due" numeric(10, 2) NOT NULL,
	"amount_paid" numeric(10, 2) DEFAULT '0',
	"due_date" date NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "student_medical_info" (
	"id" integer PRIMARY KEY NOT NULL,
	"id_number" text NOT NULL,
	"family_doctor" text,
	"doctor_phone" text,
	"medical_conditions" text[],
	"medical_conditions_details" text,
	"childhood_sicknesses" text,
	"life_threatening_allergies" text,
	"other_allergies" text,
	"regular_medications" boolean,
	"regular_medications_details" text,
	"major_operations" text,
	"behavior_problems" text,
	"speech_hearing_problems" text,
	"birth_complications" text,
	"immunisation_up_to_date" boolean,
	"family_medical_history" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "student_medical_id_required" CHECK (id IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "subject_teachers" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_id" integer NOT NULL,
	"teacher_id" integer NOT NULL,
	"teacher_name" text NOT NULL,
	"is_primary" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "term_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"academic_year" varchar(10) NOT NULL,
	"term" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"is_current" boolean DEFAULT false,
	CONSTRAINT "unique_term_config" UNIQUE("academic_year","term")
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"user_type" varchar(20) NOT NULL,
	"reference_id" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_reference_unique" UNIQUE("user_type","reference_id")
);
--> statement-breakpoint
ALTER TABLE "classes" ALTER COLUMN "subjects" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "subjects" ALTER COLUMN "assessments" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "teachers" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "class_section" text NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "class_teacher" text;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "class_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "teacher_ids" integer[] NOT NULL;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "teacher_names" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "class_section" text DEFAULT 'primary' NOT NULL;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "staff_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "class_role" text;--> statement-breakpoint
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_assigned_by_staff_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_summary" ADD CONSTRAINT "attendance_summary_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_summary" ADD CONSTRAINT "attendance_summary_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_room_id_chat_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_room_members" ADD CONSTRAINT "chat_room_members_room_id_chat_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_created_by_staff_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_periods" ADD CONSTRAINT "class_periods_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_periods" ADD CONSTRAINT "class_periods_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_staff_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fee_discounts" ADD CONSTRAINT "fee_discounts_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fee_discounts" ADD CONSTRAINT "fee_discounts_fee_structure_id_fee_structure_id_fk" FOREIGN KEY ("fee_structure_id") REFERENCES "public"."fee_structure"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_student_fee_id_student_fees_id_fk" FOREIGN KEY ("student_fee_id") REFERENCES "public"."student_fees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_received_by_staff_id_fk" FOREIGN KEY ("received_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fee_structure" ADD CONSTRAINT "fee_structure_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_recorded_by_staff_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notices" ADD CONSTRAINT "notices_created_by_staff_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_cards" ADD CONSTRAINT "report_cards_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_cards" ADD CONSTRAINT "report_cards_generated_by_staff_id_fk" FOREIGN KEY ("generated_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_recorded_by_staff_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_fees" ADD CONSTRAINT "student_fees_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_fees" ADD CONSTRAINT "student_fees_fee_structure_id_fee_structure_id_fk" FOREIGN KEY ("fee_structure_id") REFERENCES "public"."fee_structure"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_submissions_assignment" ON "assignment_submissions" USING btree ("assignment_id");--> statement-breakpoint
CREATE INDEX "idx_submissions_student" ON "assignment_submissions" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "idx_assignments_class" ON "assignments" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "idx_assignments_due_date" ON "assignments" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "idx_attendance_summary_student" ON "attendance_summary" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "idx_attendance_summary_month" ON "attendance_summary" USING btree ("month","year");--> statement-breakpoint
CREATE INDEX "idx_attendance_summary_student_month" ON "attendance_summary" USING btree ("student_id","month","year");--> statement-breakpoint
CREATE INDEX "idx_chat_messages_room" ON "chat_messages" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "idx_chat_messages_created" ON "chat_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_chat_members_room" ON "chat_room_members" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "idx_chat_members_user" ON "chat_room_members" USING btree ("user_id","user_type");--> statement-breakpoint
CREATE INDEX "idx_chat_rooms_type" ON "chat_rooms" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_chat_rooms_class" ON "chat_rooms" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "idx_class_periods_class" ON "class_periods" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "idx_events_date" ON "events" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "idx_events_type" ON "events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_exams_class" ON "exams" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "idx_exams_date" ON "exams" USING btree ("exam_date");--> statement-breakpoint
CREATE INDEX "idx_fee_discounts_student" ON "fee_discounts" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "idx_fee_discounts_active" ON "fee_discounts" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_fee_payments_date" ON "fee_payments" USING btree ("payment_date");--> statement-breakpoint
CREATE INDEX "idx_fee_payments_reference" ON "fee_payments" USING btree ("reference_number");--> statement-breakpoint
CREATE INDEX "idx_fee_structure_class" ON "fee_structure" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "idx_fee_structure_active" ON "fee_structure" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_grades_student" ON "grades" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "idx_grades_exam" ON "grades" USING btree ("exam_id");--> statement-breakpoint
CREATE INDEX "idx_notices_active" ON "notices" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_notices_priority" ON "notices" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "idx_notices_date" ON "notices" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "idx_notifications_user" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_notifications_read" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "idx_parent_student_parent" ON "parent_student_relations" USING btree ("parent_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_parent_student_student" ON "parent_student_relations" USING btree ("student_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_parents_email" ON "parents" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "idx_parents_phone" ON "parents" USING btree ("phone" text_ops);--> statement-breakpoint
CREATE INDEX "idx_parents_status" ON "parents" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_parents_surname" ON "parents" USING btree ("surname" text_ops);--> statement-breakpoint
CREATE INDEX "idx_registered_students_created" ON "registered_students" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_registered_students_status" ON "registered_students" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_registered_students_surname" ON "registered_students" USING btree ("surname" text_ops);--> statement-breakpoint
CREATE INDEX "idx_report_cards_student" ON "report_cards" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "idx_report_cards_term" ON "report_cards" USING btree ("academic_year","term");--> statement-breakpoint
CREATE INDEX "idx_school_calendar_date" ON "school_calendar" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_student_attendance_date" ON "student_attendance" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_student_attendance_student" ON "student_attendance" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "idx_student_attendance_class" ON "student_attendance" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "idx_attendance_student_date" ON "student_attendance" USING btree ("student_id","date");--> statement-breakpoint
CREATE INDEX "idx_attendance_class_date" ON "student_attendance" USING btree ("class_id","date");--> statement-breakpoint
CREATE INDEX "idx_student_fees_student" ON "student_fees" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "idx_student_fees_status" ON "student_fees" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_student_fees_due_date" ON "student_fees" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "idx_student_medical_id" ON "student_medical_info" USING btree ("id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_student_medical_id_number" ON "student_medical_info" USING btree ("id_number" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_sessions_token" ON "user_sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "idx_user_sessions_user" ON "user_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_classes_name_section" ON "classes" USING btree ("class_name" text_ops,"class_section" text_ops);--> statement-breakpoint
CREATE INDEX "idx_classes_section" ON "classes" USING btree ("class_section" text_ops);--> statement-breakpoint
CREATE INDEX "idx_classes_updated" ON "classes" USING btree ("updated_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_subjects_class_name_section" ON "subjects" USING btree ("class_name" text_ops,"class_section" text_ops);--> statement-breakpoint
CREATE INDEX "idx_subjects_name" ON "subjects" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_subjects_teacher_names" ON "subjects" USING gin ("teacher_names" array_ops);--> statement-breakpoint
CREATE INDEX "idx_subjects_updated" ON "subjects" USING btree ("updated_at" timestamp_ops);--> statement-breakpoint
ALTER TABLE "classes" DROP COLUMN "teacher";--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "unique_class_name_section" UNIQUE("class_name","class_section");--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_staff_id_unique" UNIQUE("staff_id");--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_class_name_not_empty" CHECK ((class_name IS NOT NULL) AND (class_name <> ''::text));--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_teachers_not_null" CHECK (teachers IS NOT NULL);--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_subjects_not_null" CHECK (subjects IS NOT NULL);--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_class_name_not_empty" CHECK ((class_name IS NOT NULL) AND (class_name <> ''::text));--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_name_not_empty" CHECK ((name IS NOT NULL) AND (name <> ''::text));--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_teacher_names_not_null" CHECK (teacher_names IS NOT NULL);--> statement-breakpoint
CREATE VIEW "public"."daily_attendance_view" AS (
	SELECT 
	  sa.date,
	  c.id as class_id,
	  c.class_name,
	  COUNT(DISTINCT sa.student_id) as total_students,
	  COUNT(CASE WHEN sa.status = 'present' THEN 1 END) as present_count,
	  COUNT(CASE WHEN sa.status = 'absent' THEN 1 END) as absent_count,
	  COUNT(CASE WHEN sa.status = 'late' THEN 1 END) as late_count,
	  ROUND((COUNT(CASE WHEN sa.status = 'present' THEN 1 END) * 100.0 / COUNT(DISTINCT sa.student_id)), 2) as attendance_percentage
	FROM student_attendance sa
	JOIN classes c ON sa.class_id = c.id
	GROUP BY sa.date, c.id, c.class_name
  );