import { pgTable, pgView, unique, serial, text, integer, timestamp, jsonb, index, check, boolean, varchar, decimal, date, time } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const teachers = pgTable("teachers", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	surname: text().notNull(),
	role: text().notNull(),
	email: text().notNull(),
	phone: text().notNull(),
	subjects: text().array().notNull(),
	experience: integer().notNull(),
	qualification: text().notNull(),
	staffId: integer("staff_id").notNull(),
	classRole: text("class_role"),
}, (table) => [
	unique("teachers_staff_id_unique").on(table.staffId),
]);

export const staffLeave = pgTable("staff_leave", {
	id: serial().primaryKey().notNull(),
	staffId: integer("staff_id").notNull(),
	leaveType: text("leave_type").notNull(),
	startDate: text("start_date").notNull(),
	endDate: text("end_date").notNull(),
	status: text().default('pending'),
	reason: text(),
	approvedBy: integer("approved_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const staffSalary = pgTable("staff_salary", {
	id: serial().primaryKey().notNull(),
	staffId: integer("staff_id").notNull(),
	baseSalary: integer("base_salary").notNull(),
	allowances: jsonb().default({}),
	deductions: jsonb().default({}),
	effectiveDate: text("effective_date").notNull(),
	paymentFrequency: text("payment_frequency").default('monthly'),
});

export const students = pgTable("students", {
	id: serial().primaryKey().notNull(),
	id_number: text(),
	name: text().notNull(),
	surname: text().notNull(),
	phone: text(),
	address: text(),
	attendance: text(),
	class: text(),
	email: text(),
});

export const subjects = pgTable("subjects", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	className: text("class_name").notNull(),
	teacher: text().notNull(),
	teacherIds: integer("teacher_ids").array().notNull(),
	teacherNames: text("teacher_names").array().notNull(),
	schedule: text().notNull(),
	duration: text().notNull(),
	topics: text().array().notNull(),
	assessments: jsonb().default([]).notNull(),
	classSection: text("class_section").default('primary').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_subjects_class_name_section").using("btree", table.className.asc().nullsLast().op("text_ops"), table.classSection.asc().nullsLast().op("text_ops")),
	index("idx_subjects_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("idx_subjects_teacher_names").using("gin", table.teacherNames.asc().nullsLast().op("array_ops")),
	index("idx_subjects_updated").using("btree", table.updatedAt.asc().nullsLast().op("timestamp_ops")),
	check("subjects_class_name_not_empty", sql`(class_name IS NOT NULL) AND (class_name <> ''::text)`),
	check("subjects_name_not_empty", sql`(name IS NOT NULL) AND (name <> ''::text)`),
	check("subjects_teacher_names_not_null", sql`teacher_names IS NOT NULL`),
]);

export const subjectTeachers = pgTable("subject_teachers", {
	id: serial().primaryKey().notNull(),
	subjectId: integer("subject_id").notNull(),
	teacherId: integer("teacher_id").notNull(),
	teacherName: text("teacher_name").notNull(),
	isPrimary: boolean("is_primary").default(false),
});

export const classActivities = pgTable("class_activities", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	date: text().notNull(),
	className: text("class_name"),
});

export const classes = pgTable("classes", {
	id: serial().primaryKey().notNull(),
	className: text("class_name").notNull(),
	teachers: text().array().notNull(),
	subjects: text().array().notNull(),
	classSection: text("class_section").notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	classTeacher: text("class_teacher"),
}, (table) => [
	index("idx_classes_name_section").using("btree", table.className.asc().nullsLast().op("text_ops"), table.classSection.asc().nullsLast().op("text_ops")),
	index("idx_classes_section").using("btree", table.classSection.asc().nullsLast().op("text_ops")),
	index("idx_classes_updated").using("btree", table.updatedAt.asc().nullsLast().op("timestamp_ops")),
	unique("unique_class_name_section").on(table.className, table.classSection),
	check("classes_class_name_not_empty", sql`(class_name IS NOT NULL) AND (class_name <> ''::text)`),
	check("classes_teachers_not_null", sql`teachers IS NOT NULL`),
	check("classes_subjects_not_null", sql`subjects IS NOT NULL`),
]);

export const staff = pgTable("staff", {
	id: serial().primaryKey().notNull(),
	staffId: varchar("staff_id", { length: 20 }).notNull(),
	name: text().notNull(),
	surname: text().notNull(),
	email: text().notNull(),
	phone: text().notNull(),
	address: text(),
	dateOfBirth: text("date_of_birth"),
	gender: text(),
	emergencyContact: text("emergency_contact"),
	emergencyPhone: text("emergency_phone"),
	employmentType: text("employment_type").notNull(),
	position: text().notNull(),
	department: text().notNull(),
	hireDate: text("hire_date").notNull(),
	terminationDate: text("termination_date"),
	employmentStatus: text("employment_status").default('active'),
	qualification: text().notNull(),
	specialization: text(),
	experience: integer().default(0).notNull(),
	certifications: text().array(),
	subjects: text().array(),
	role: text().notNull(),
	permissions: jsonb(),
	accessLevel: integer("access_level").default(1),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("staff_staff_id_unique").on(table.staffId),
	unique("staff_email_unique").on(table.email),
]);

export const registeredStudents = pgTable("registered_students", {
	id: serial().primaryKey().notNull(),
	student_id: text(),
	surname: text().notNull(),
	name: text().notNull(),
	preferredName: text(),
	dateOfBirth: text("date_of_birth").notNull(),
	idNumber: text("id_number"),
	sex: text(),
	homeLanguage: text("home_language").array(),
	religion: text(),
	numberOfChildrenInFamily: integer("number_of_children_in_family"),
	positionInFamily: integer("position_in_family"),
	authorizedToBring: text("authorized_to_bring").array(),
	authorizedToCollect: text("authorized_to_collect").array(),
	previousSchool: text("previous_school"),
	intendedPrimarySchool: text("intended_primary_school"),
	careRequired: text("care_required"),
	dateOfEnrolment: text("date_of_enrolment").notNull(),
	ageAtEnrolment: integer("age_at_enrolment"),
	emergencyContactFriendName: text("emergency_contact_friend_name"),
	emergencyContactFriendRelationship: text("emergency_contact_friend_relationship"),
	emergencyContactFriendAddress: text("emergency_contact_friend_address"),
	emergencyContactFriendWorkPhone: text("emergency_contact_friend_work_phone"),
	emergencyContactFriendHomePhone: text("emergency_contact_friend_home_phone"),
	emergencyContactFriendCell: text("emergency_contact_friend_cell"),
	emergencyContactKinName: text("emergency_contact_kin_name"),
	emergencyContactKinRelationship: text("emergency_contact_kin_relationship"),
	emergencyContactKinAddress: text("emergency_contact_kin_address"),
	emergencyContactKinWorkPhone: text("emergency_contact_kin_work_phone"),
	emergencyContactKinHomePhone: text("emergency_contact_kin_home_phone"),
	emergencyContactKinCell: text("emergency_contact_kin_cell"),
	transportContact1Name: text("transport_contact_1_name"),
	transportContact1Phone: text("transport_contact_1_phone"),
	transportContact2Name: text("transport_contact_2_name"),
	transportContact2Phone: text("transport_contact_2_phone"),
	transportContact3Name: text("transport_contact_3_name"),
	transportContact3Phone: text("transport_contact_3_phone"),
	specialInstructions: text("special_instructions"),

	medicalConsent1: text("medical_consent_1"),
	medicalConsent1Father: boolean("medical_consent_1_father").default(false),
	medicalConsent1Mother: boolean("medical_consent_1_mother").default(false),
	medicalConsent1Guardian: boolean("medical_consent_1_guardian").default(false),
	medicalConsent2: text("medical_consent_2"),
	medicalConsent2Father: boolean("medical_consent_2_father").default(false),
	medicalConsent2Mother: boolean("medical_consent_2_mother").default(false),
	medicalConsent2Guardian: boolean("medical_consent_2_guardian").default(false),
	maritalStatus: text("marital_status"),
	livesWith: text("lives_with").array(),

	motherTitle: text("mother_title"),
	motherSurname: text("mother_surname"),
	motherFirstNames: text("mother_first_names"),
	motherIdNumber: text("mother_id_number"),
	motherOccupation: text("mother_occupation"),
	motherEmployer: text("mother_employer"),
	motherWorkPhone: text("mother_work_phone"),
	motherHomePhone: text("mother_home_phone"),
	motherCell: text("mother_cell"),
	motherEmail: text("mother_email"),
	motherHomeAddress: text("mother_home_address"),
	motherWorkAddress: text("mother_work_address"),
	fatherTitle: text("father_title"),

	fatherSurname: text("father_surname"),
	fatherFirstNames: text("father_first_names"),
	fatherIdNumber: text("father_id_number"),
	fatherOccupation: text("father_occupation"),
	fatherEmployer: text("father_employer"),
	fatherWorkPhone: text("father_work_phone"),
	fatherHomePhone: text("father_home_phone"),
	fatherCell: text("father_cell"),
	fatherEmail: text("father_email"),
	fatherHomeAddress: text("father_home_address"),
	fatherWorkAddress: text("father_work_address"),

	guardianTitle: text("guardian_title"),
	guardianSurname: text("guardian_surname"),
	guardianFirstNames: text("guardian_first_names"),
	guardianIdNumber: text("guardian_id_number"),
	guardianOccupation: text("guardian_occupation"),
	guardianEmployer: text("guardian_employer"),
	guardianWorkPhone: text("guardian_work_phone"),
	guardianHomePhone: text("guardian_home_phone"),
	guardianCell: text("guardian_cell"),
	guardianEmail: text("guardian_email"),
	guardianHomeAddress: text("guardian_home_address"),
	guardianWorkAddress: text("guardian_work_address"),

	popiConsent: boolean("popi_consent").default(false),
	motherPopiSignature: text("mother_popi_signature"),
	motherPopiDate: text("mother_popi_date"),
	fatherPopiSignature: text("father_popi_signature"),
	fatherPopiDate: text("father_popi_date"),

	//INDEMNITY FORM
	signatory1FullName: text("signatory1_full_name"),
	signatory1IDNumber: text("signatory1_id_number"),
	signatory1Relation: text("signatory1_relation"),
	signatory1CellNumber: text("signatory1_cell_number"),
	signatory1Email: text("signatory1_email"),
	signatory1PhysicalAddress: text("signatory1_physical_address"),
	signatory1Signature: text("signatory1_signature"),
	signatory1DateSigned: text("signatory1_date_signed"),
	signatory2FullName: text("signatory2_full_name"),
	signatory2IDNumber: text("signatory2_id_number"),
	signatory2Relation: text("signatory2_relation"),
	signatory2CellNumber: text("signatory2_cell_number"),
	signatory2Email: text("signatory2_email"),
	signatory2PhysicalAddress: text("signatory2_physical_address"),
	signatory2Signature: text("signatory2_signature"),
	signatory2DateSigned: text("signatory2_date_signed"),

	//DECLARATION AND AGREEMENT
	signedAt: text("signed_at"),
	agreementDate: text("agreement_date"),
	witnessName: text("witness_name"),
	witnessSignature: text("witness_signature"),
	indemnityAgreement: boolean("indemnity_agreement").default(false),

	//FINANCIAL AGREEMENT

	financialAgreedTerms: boolean("financial_agreed_terms"),
	financialAgreedLiability: boolean("financial_agreed_liability"),
	financialAgreedCancellation: boolean("financial_agreed_cancellation"),
	motherFinancialSignature: text("mother_financial_signature"),
	motherFinancialDate: text("mother_financial_date"),
	fatherFinancialSignature: text("father_financial_signature"),
	fatherFinancialDate: text("father_financial_date"),
	monthlyAmount: integer("monthly_amount"),
	paymentDate: integer("payment_date"),

	status: text().default('pending'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	address: text(),
	email: text(),
	phone: text(),

	familyDoctor: text("family_doctor"),
	doctorPhone: text("doctor_phone"),

	medicalConditions: text("medical_conditions").array(),
	medicalConditionsDetails: text("medical_conditions_details"),
	childhoodSicknesses: text("childhood_sicknesses"),
	lifeThreateningAllergies: text("life_threatening_allergies"),
	otherAllergies: text("other_allergies"),
	regularMedications: boolean("regular_medications"),
	regularMedicationsDetails: text("regular_medications_details"),
	majorOperations: text("major_operations"),
	behaviorProblems: text("behavior_problems"),
	speechHearingProblems: text("speech_hearing_problems"),
	birthComplications: text("birth_complications"),
	immunisationUpToDate: boolean("immunisation_up_to_date"),
	familyMedicalHistory: text("family_medical_history"),
}, (table) => [
	index("idx_registered_students_created").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_registered_students_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("idx_registered_students_surname").using("btree", table.surname.asc().nullsLast().op("text_ops")),
	check("registered_students_surname_not_empty", sql`(surname IS NOT NULL) AND (surname <> ''::text)`),
]);

export const studentMedicalInfo = pgTable("student_medical_info", {
	id: integer("id").primaryKey().notNull(),
	idNumber: text("id_number").notNull(),
	familyDoctor: text("family_doctor"),
	doctorPhone: text("doctor_phone"),
	medicalConditions: text("medical_conditions").array(),
	medicalConditionsDetails: text("medical_conditions_details"),
	childhoodSicknesses: text("childhood_sicknesses"),
	lifeThreateningAllergies: text("life_threatening_allergies"),
	otherAllergies: text("other_allergies"),
	regularMedications: boolean("regular_medications"),
	regularMedicationsDetails: text("regular_medications_details"),
	majorOperations: text("major_operations"),
	behaviorProblems: text("behavior_problems"),
	speechHearingProblems: text("speech_hearing_problems"),
	birthComplications: text("birth_complications"),
	immunisationUpToDate: boolean("immunisation_up_to_date"),
	familyMedicalHistory: text("family_medical_history"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_student_medical_id").using("btree", table.id.asc().nullsLast().op("int4_ops")),
	index("idx_student_medical_id_number").using("btree", table.idNumber.asc().nullsLast().op("text_ops")),
	check("student_medical_id_required", sql`id IS NOT NULL`),
]);

export const parentStudentRelations = pgTable("parent_student_relations", {
	id: serial().primaryKey().notNull(),
	parentId: integer("parent_id").notNull(),
	studentId: integer("student_id").notNull(),
	relationship: text().notNull(),
	isPrimaryContact: boolean("is_primary_contact").default(false),
	emergencyContact: boolean("emergency_contact").default(false),
	authorizedToPickup: boolean("authorized_to_pickup").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_parent_student_parent").using("btree", table.parentId.asc().nullsLast().op("int4_ops")),
	index("idx_parent_student_student").using("btree", table.studentId.asc().nullsLast().op("int4_ops")),
	unique("unique_parent_student_relation").on(table.parentId, table.studentId),
]);

export const parents = pgTable("parents", {
	id: serial().primaryKey().notNull(),
	title: text(),
	name: text().notNull(),
	surname: text().notNull(),
	idNumber: text("id_number"),
	dateOfBirth: text("date_of_birth"),
	gender: text(),
	email: text(),
	phone: text().notNull(),
	alternatePhone: text("alternate_phone"),
	homeAddress: text("home_address"),
	postalAddress: text("postal_address"),
	workAddress: text("work_address"),
	occupation: text(),
	employer: text(),
	workPhone: text("work_phone"),
	relationshipToStudent: text("relationship_to_student").notNull(),
	isPrimaryContact: boolean("is_primary_contact").default(false),
	emergencyContact: boolean("emergency_contact").default(false),
	authorizedToPickup: boolean("authorized_to_pickup").default(true),
	responsibleForFees: boolean("responsible_for_fees").default(false),
	feePaymentMethod: text("fee_payment_method"),
	bankAccountDetails: jsonb("bank_account_details"),
	medicalConsent: boolean("medical_consent").default(false),
	status: text().default('active'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_parents_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("idx_parents_phone").using("btree", table.phone.asc().nullsLast().op("text_ops")),
	index("idx_parents_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("idx_parents_surname").using("btree", table.surname.asc().nullsLast().op("text_ops")),
	unique("parents_id_number_unique").on(table.idNumber),
	check("parents_name_not_empty", sql`(name IS NOT NULL) AND (name <> ''::text)`),
	check("parents_surname_not_empty", sql`(surname IS NOT NULL) AND (surname <> ''::text)`),
]);

export const staffAttendance = pgTable("staff_attendance", {
	id: serial().primaryKey().notNull(),
	staffId: integer("staff_id").notNull(),
	date: text().notNull(),
	status: text().notNull(),
	checkIn: text("check_in"),
	checkOut: text("check_out"),
	notes: text(),
});

// Add to your existing schema.ts

// ==================== SCHOOL CALENDAR ====================
export const schoolCalendar = pgTable("school_calendar", {
	id: serial().primaryKey().notNull(),
	date: date().notNull(),
	dayType: varchar("day_type", { length: 20 }).notNull().default('school_day'), // school_day, holiday, weekend, special_event
	description: text(),
	academicYear: varchar("academic_year", { length: 10 }).notNull(),
	term: integer().notNull(),
}, (table) => [
	index("idx_school_calendar_date").on(table.date),
	unique("unique_calendar_date").on(table.date, table.academicYear)
]);

// ==================== PERIODS/TIMETABLE ====================
export const classPeriods = pgTable("class_periods", {
	id: serial().primaryKey().notNull(),
	classId: integer("class_id").notNull().references(() => classes.id),
	periodNumber: integer("period_number").notNull(),
	startTime: time("start_time").notNull(),
	endTime: time("end_time").notNull(),
	subjectId: integer("subject_id").references(() => subjects.id),
	dayOfWeek: integer("day_of_week").notNull(), // 1-7 (Monday-Sunday)
	isActive: boolean("is_active").default(true),
}, (table) => [
	index("idx_class_periods_class").on(table.classId),
	unique("unique_class_period").on(table.classId, table.dayOfWeek, table.periodNumber)
]);


// ==================== ATTENDANCE MODULE ====================
export const studentAttendance = pgTable("student_attendance", {
	id: serial().primaryKey().notNull(),
	studentId: integer("student_id").notNull().references(() => students.id),
	classId: integer("class_id").notNull().references(() => classes.id),
	date: date().notNull(),
	status: varchar("status", { length: 20 }).notNull().default('present'), // present, absent, late, half-day
	subjectId: integer("subject_id").references(() => subjects.id),
	period: integer(), // for period-wise attendance
	remarks: text(),
	recordedBy: integer("recorded_by").references(() => staff.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_student_attendance_date").on(table.date),
	index("idx_student_attendance_student").on(table.studentId),
	index("idx_student_attendance_class").on(table.classId),
	unique("unique_student_attendance").on(table.studentId, table.date, table.subjectId),
	check("attendance_status_check", sql`status IN ('present', 'absent', 'late', 'half-day')`),
	index("idx_attendance_student_date").on(table.studentId, table.date),
	index("idx_attendance_class_date").on(table.classId, table.date),

]);

export const attendanceSummary = pgTable("attendance_summary", {
	id: serial().primaryKey().notNull(),
	studentId: integer("student_id").notNull().references(() => students.id),
	classId: integer("class_id").notNull().references(() => classes.id),
	month: integer().notNull(), // 1-12
	year: integer().notNull(),
	presentDays: integer().default(0),
	absentDays: integer().default(0),
	lateDays: integer().default(0),
	halfDays: integer().default(0),
	totalSchoolDays: integer().default(0),
}, (table) => [
	index("idx_attendance_summary_student").on(table.studentId),
	index("idx_attendance_summary_month").on(table.month, table.year),
	unique("unique_attendance_summary").on(table.studentId, table.month, table.year),
	index("idx_attendance_summary_student_month").on(table.studentId, table.month, table.year),
]);

// ==================== FEE MANAGEMENT ====================
// Add these to complement your existing fee tables

export const feeCategories = pgTable("fee_categories", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const feeDiscounts = pgTable("fee_discounts", {
	id: serial().primaryKey().notNull(),
	studentId: integer("student_id").notNull().references(() => students.id),
	feeStructureId: integer("fee_structure_id").references(() => feeStructure.id),
	discountType: varchar("discount_type", { length: 50 }).notNull(), // sibling, scholarship, staff, etc.
	discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }),
	discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }),
	reason: text(),
	startDate: date("start_date").notNull(),
	endDate: date("end_date"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_fee_discounts_student").on(table.studentId),
	index("idx_fee_discounts_active").on(table.isActive)
]);

export const feeStructure = pgTable("fee_structure", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	classId: integer("class_id").references(() => classes.id),
	amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
	frequency: varchar("frequency", { length: 20 }).default('monthly'), // monthly, termly, yearly
	dueDate: integer("due_date"), // day of month
	isActive: boolean("is_active").default(true),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_fee_structure_class").on(table.classId),
	index("idx_fee_structure_active").on(table.isActive)
]);

export const studentFees = pgTable("student_fees", {
	id: serial().primaryKey().notNull(),
	studentId: integer("student_id").notNull().references(() => students.id),
	feeStructureId: integer("fee_structure_id").notNull().references(() => feeStructure.id),
	academicYear: varchar("academic_year", { length: 10 }).notNull(),
	term: integer(), // 1, 2, 3
	amountDue: decimal("amount_due", { precision: 10, scale: 2 }).notNull(),
	amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).default('0'),
	dueDate: date("due_date").notNull(),
	status: varchar("status", { length: 20 }).default('pending'), // pending, partial, paid, overdue
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_student_fees_student").on(table.studentId),
	index("idx_student_fees_status").on(table.status),
	index("idx_student_fees_due_date").on(table.dueDate)
]);

export const feePayments = pgTable("fee_payments", {
	id: serial().primaryKey().notNull(),
	studentFeeId: integer("student_fee_id").notNull().references(() => studentFees.id),
	amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
	paymentDate: date("payment_date").notNull(),
	paymentMethod: varchar("payment_method", { length: 50 }).notNull(), // cash, bank transfer, card
	referenceNumber: text("reference_number"),
	receivedBy: integer("received_by").references(() => staff.id),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_fee_payments_date").on(table.paymentDate),
	index("idx_fee_payments_reference").on(table.referenceNumber)
]);

// ==================== EXAMS & GRADES ====================
// Add these to complement your existing exam tables

export const gradeSystem = pgTable("grade_system", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	minMarks: decimal("min_marks", { precision: 5, scale: 2 }).notNull(),
	maxMarks: decimal("max_marks", { precision: 5, scale: 2 }).notNull(),
	grade: varchar("grade", { length: 5 }).notNull(),
	points: decimal("points", { precision: 3, scale: 2 }),
	description: text(),
	isActive: boolean("is_active").default(true),
}, (table) => [
	unique("unique_grade_range").on(table.minMarks, table.maxMarks)
]);

export const termConfig = pgTable("term_config", {
	id: serial().primaryKey().notNull(),
	academicYear: varchar("academic_year", { length: 10 }).notNull(),
	term: integer().notNull(),
	startDate: date("start_date").notNull(),
	endDate: date("end_date").notNull(),
	isCurrent: boolean("is_current").default(false),
}, (table) => [
	unique("unique_term_config").on(table.academicYear, table.term)
]);

// ==================== EXAMS & GRADES ====================

export const exams = pgTable("exams", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	examDate: date("exam_date").notNull(),
	startTime: time("start_time"),
	endTime: time("end_time"),
	totalMarks: integer("total_marks").default(100),
	passingMarks: integer("passing_marks").default(40),
	classId: integer("class_id").notNull().references(() => classes.id),
	subjectId: integer("subject_id").references(() => subjects.id),
	academicYear: varchar("academic_year", { length: 10 }).notNull(),
	term: integer().notNull(),
	weightage: integer().default(100), // percentage weight in final grade
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_exams_class").on(table.classId),
	index("idx_exams_date").on(table.examDate),
	unique("unique_exam_class_subject").on(table.name, table.classId, table.subjectId, table.academicYear)
]);

export const examResults = pgTable("exam_results", {
	id: serial().primaryKey().notNull(),
	examId: integer("exam_id").notNull().references(() => exams.id),
	studentId: integer("student_id").notNull().references(() => students.id),
	marksObtained: decimal("marks_obtained", { precision: 6, scale: 2 }),
	grade: varchar("grade", { length: 10 }),
	status: varchar("status", { length: 50 }).default("pending"), // pending, passed, failed
	comments: text("comments"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_exam_results_exam").on(table.examId),
	index("idx_exam_results_student").on(table.studentId),
	unique("unique_exam_result").on(table.examId, table.studentId)
]);

export const grades = pgTable("grades", {
	id: serial().primaryKey().notNull(),
	studentId: integer("student_id").notNull().references(() => students.id),
	examId: integer("exam_id").notNull().references(() => exams.id),
	marksObtained: decimal("marks_obtained", { precision: 6, scale: 2 }).notNull(),
	grade: varchar("grade", { length: 5 }), // A, B, C, etc.
	comments: text(),
	recordedBy: integer("recorded_by").references(() => staff.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_grades_student").on(table.studentId),
	index("idx_grades_exam").on(table.examId),
	unique("unique_student_exam").on(table.studentId, table.examId)
]);

// ==================== ACADEMIC YEARS & TERMS ====================
export const academicYears = pgTable("academic_years", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(), // e.g., "2024-2025"
	startDate: date("start_date").notNull(),
	endDate: date("end_date").notNull(),
	isCurrent: boolean("is_current").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("unique_academic_year_name").on(table.name)
]);

export const academicTerms = pgTable("academic_terms", {
	id: serial().primaryKey().notNull(),
	academicYearId: integer("academic_year_id").notNull().references(() => academicYears.id),
	name: text().notNull(), // e.g., "Term 1"
	order: integer().notNull(), // 1, 2, 3
	startDate: date("start_date").notNull(),
	endDate: date("end_date").notNull(),
	isCurrent: boolean("is_current").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_academic_terms_year").on(table.academicYearId),
	unique("unique_term_name_year").on(table.academicYearId, table.name)
]);

// ==================== GRADING SYSTEM ====================
/*
export const gradingScales = pgTable("grading_scales", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	minPercentage: decimal("min_percentage", { precision: 5, scale: 2 }).notNull(),
	maxPercentage: decimal("max_percentage", { precision: 5, scale: 2 }).notNull(),
	grade: text("grade").notNull(),
	gradePoint: decimal("grade_point", { precision: 3, scale: 1 }),
	description: text(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("unique_grade_range").on(table.minPercentage, table.maxPercentage)
]);

*/
// ==================== REPORT CARDS ====================
export const reportCards = pgTable("report_cards", {
	id: serial().primaryKey().notNull(),
	studentId: integer("student_id").notNull().references(() => students.id, { onDelete: 'cascade' }),
	academicYearId: integer("academic_year_id").notNull().references(() => academicYears.id),
	termId: integer("term_id").notNull().references(() => academicTerms.id),
	classId: integer("class_id").notNull().references(() => classes.id),
	overallGrade: text("overall_grade"),
	totalPercentage: decimal("total_percentage", { precision: 5, scale: 2 }),
	positionInClass: integer("position_in_class"),
	totalMarksObtained: decimal("total_marks_obtained", { precision: 10, scale: 2 }),
	totalMaxMarks: decimal("total_max_marks", { precision: 10, scale: 2 }),
	attendancePercentage: decimal("attendance_percentage", { precision: 5, scale: 2 }),
	teacherComments: text("teacher_comments"),
	principalComments: text("principal_comments"),
	isPublished: boolean("is_published").default(false),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	generatedBy: integer("generated_by").references(() => staff.id),
	generatedAt: timestamp("generated_at", { mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_report_cards_student").on(table.studentId),
	index("idx_report_cards_academic_year").on(table.academicYearId, table.termId),
	unique("unique_report_card").on(table.studentId, table.academicYearId, table.termId, table.classId)
]);

export const reportCardSubjects = pgTable("report_card_subjects", {
	id: serial().primaryKey().notNull(),
	reportCardId: integer("report_card_id").notNull().references(() => reportCards.id, { onDelete: 'cascade' }),
	subjectId: integer("subject_id").notNull().references(() => subjects.id),
	marksObtained: decimal("marks_obtained", { precision: 6, scale: 2 }),
	maxMarks: decimal("max_marks", { precision: 6, scale: 2 }),
	percentage: decimal("percentage", { precision: 5, scale: 2 }),
	grade: text("grade"),
	gradePoint: decimal("grade_point", { precision: 3, scale: 1 }),
	teacherComments: text("teacher_comments"),
	practicalMarks: decimal("practical_marks", { precision: 6, scale: 2 }),
	theoryMarks: decimal("theory_marks", { precision: 6, scale: 2 }),
	assignmentMarks: decimal("assignment_marks", { precision: 6, scale: 2 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_report_card_subjects_report_card").on(table.reportCardId),
	unique("unique_report_card_subject").on(table.reportCardId, table.subjectId)
]);

// ==================== REPORT CARD COMMENTS ====================
export const reportCardComments = pgTable("report_card_comments", {
	id: serial().primaryKey().notNull(),
	category: text("category").notNull(),
	commentText: text("comment_text").notNull(),
	minPercentage: decimal("min_percentage", { precision: 5, scale: 2 }),
	maxPercentage: decimal("max_percentage", { precision: 5, scale: 2 }),
	isPositive: boolean("is_positive").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
  });


// ==================== ASSIGNMENTS ====================
export const assignments = pgTable("assignments", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	instructions: text(),
	classId: integer("class_id").notNull().references(() => classes.id),
	subjectId: integer("subject_id").notNull().references(() => subjects.id),
	teacherId: integer("teacher_id").notNull().references(() => teachers.id),
	assignedDate: date("assigned_date").notNull(),
	dueDate: date("due_date").notNull(),
	totalMarks: integer("total_marks").default(100),
	passingMarks: integer("passing_marks").default(40),
	attachmentUrl: text("attachment_url"),
	attachmentName: text("attachment_name"),
	status: varchar("status", { length: 20 }).default('published'),
	isPublished: boolean("is_published").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_assignments_class").on(table.classId),
	index("idx_assignments_due_date").on(table.dueDate),
	index("idx_assignments_status").on(table.status)
]);

export const assignmentSubmissions = pgTable("assignment_submissions", {
	id: serial().primaryKey().notNull(),
	assignmentId: integer("assignment_id").notNull().references(() => assignments.id),
	studentId: integer("student_id").notNull().references(() => students.id),
	submissionText: text("submission_text"),
	submissionUrl: text("submission_url"),
	submissionFileName: text("submission_file_name"),
	marksObtained: integer("marks_obtained"),
	feedback: text(),
	gradedBy: integer("graded_by").references(() => teachers.id),
	gradedAt: timestamp("graded_at", { mode: 'string' }),
	status: varchar("status", { length: 20 }).default('submitted'),
	submittedAt: timestamp("submitted_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_submissions_assignment").on(table.assignmentId),
	index("idx_submissions_student").on(table.studentId),
	index("idx_submissions_status").on(table.status),
	unique("unique_assignment_submission").on(table.assignmentId, table.studentId)
]);

// Relations for assignments
export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
	class: one(classes, {
		fields: [assignments.classId],
		references: [classes.id],
	}),
	subject: one(subjects, {
		fields: [assignments.subjectId],
		references: [subjects.id],
	}),
	teacher: one(teachers, {
		fields: [assignments.teacherId],
		references: [teachers.id],
	}),
	submissions: many(assignmentSubmissions),
}));

export const assignmentSubmissionsRelations = relations(assignmentSubmissions, ({ one }) => ({
	assignment: one(assignments, {
		fields: [assignmentSubmissions.assignmentId],
		references: [assignments.id],
	}),
	student: one(students, {
		fields: [assignmentSubmissions.studentId],
		references: [students.id],
	}),
	grader: one(teachers, {
		fields: [assignmentSubmissions.gradedBy],
		references: [teachers.id],
	}),
}));

// ... (rest of your existing schema remains the same)

// schema/assignments.ts
import { relations } from 'drizzle-orm';
import { pgEnum } from 'drizzle-orm/pg-core';

// Assignment Status Enum
export const assignmentStatusEnum = pgEnum('assignment_status', [
	'draft',
	'published',
	'closed',
	'archived'
]);

// ==================== INSTANT CHAT ====================
export const chatRooms = pgTable("chat_rooms", {
	id: serial().primaryKey().notNull(),
	name: text(),
	type: varchar("type", { length: 20 }).notNull().default('direct'), // direct, group, class
	classId: integer("class_id").references(() => classes.id),
	createdBy: integer("created_by").references(() => staff.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_chat_rooms_type").on(table.type),
	index("idx_chat_rooms_class").on(table.classId)
]);

export const chatRoomMembers = pgTable("chat_room_members", {
	id: serial().primaryKey().notNull(),
	roomId: integer("room_id").notNull().references(() => chatRooms.id),
	userId: integer("user_id").notNull(), // could be student or staff
	userType: varchar("user_type", { length: 20 }).notNull(), // student, staff
	joinedAt: timestamp("joined_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_chat_members_room").on(table.roomId),
	index("idx_chat_members_user").on(table.userId, table.userType),
	unique("unique_chat_member").on(table.roomId, table.userId, table.userType)
]);

export const chatMessages = pgTable("chat_messages", {
	id: serial().primaryKey().notNull(),
	roomId: integer("room_id").notNull().references(() => chatRooms.id),
	senderId: integer("sender_id").notNull(),
	senderType: varchar("sender_type", { length: 20 }).notNull(), // student, staff
	message: text().notNull(),
	messageType: varchar("message_type", { length: 20 }).default('text'), // text, image, file
	attachments: text("attachments").array(),
	readBy: jsonb("read_by").default([]), // array of user IDs who read the message
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_chat_messages_room").on(table.roomId),
	index("idx_chat_messages_created").on(table.createdAt)
]);

// ==================== EVENT CALENDAR ====================
export const events = pgTable("events", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }).notNull(),
	eventType: varchar("event_type", { length: 50 }).notNull(), // academic, holiday, sports, meeting
	targetAudience: varchar("target_audience", { length: 20 }).default('all'), // all, staff, students, parents
	classId: integer("class_id").references(() => classes.id),
	createdBy: integer("created_by").references(() => staff.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_events_date").on(table.startDate),
	index("idx_events_type").on(table.eventType)
]);

// ==================== NOTICE BOARD ====================
export const notices = pgTable("notices", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	priority: varchar("priority", { length: 20 }).default('normal'), // low, normal, high, urgent
	targetAudience: varchar("target_audience", { length: 20 }).default('all'),
	startDate: date("start_date").notNull(),
	endDate: date("end_date"),
	isActive: boolean("is_active").default(true),
	createdBy: integer("created_by").references(() => staff.id),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_notices_active").on(table.isActive),
	index("idx_notices_priority").on(table.priority),
	index("idx_notices_date").on(table.startDate)
]);

// ==================== USER AUTHENTICATION ====================
export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	userType: varchar("user_type", { length: 20 }).notNull(), // student, staff, parent, admin
	referenceId: integer("reference_id").notNull(), // links to students.id, staff.id, or parents.id
	isActive: boolean("is_active").default(true),
	lastLogin: timestamp("last_login", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_reference_unique").on(table.userType, table.referenceId)
]);

export const userSessions = pgTable("user_sessions", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull().references(() => users.id),
	token: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_user_sessions_token").on(table.token),
	index("idx_user_sessions_user").on(table.userId)
]);

// ==================== NOTIFICATIONS ====================
export const notifications = pgTable("notifications", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull().references(() => users.id),
	title: text().notNull(),
	message: text().notNull(),
	type: varchar("type", { length: 50 }).notNull(), // attendance, fee, exam, general
	relatedId: integer("related_id"), // links to relevant record
	relatedType: varchar("related_type", { length: 50 }), // attendance, fee_payment, etc.
	isRead: boolean("is_read").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_notifications_user").on(table.userId),
	index("idx_notifications_read").on(table.isRead)
]);


// Add this after all your pgTable definitions, before the final export

// ==================== DATABASE VIEWS ====================
export const dailyAttendanceView = pgView("daily_attendance_view", {
	date: date(),
	classId: integer("class_id"),
	className: text("class_name"),
	totalStudents: integer("total_students"),
	presentCount: integer("present_count"),
	absentCount: integer("absent_count"),
	lateCount: integer("late_count"),
	attendancePercentage: decimal("attendance_percentage", { precision: 5, scale: 2 })
}).as(sql`
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
  `);

import type { Chapter } from "./types";

// ==================== CURRICULUM MANAGEMENT ====================
export const curriculum = pgTable("curriculum", {
	id: serial().primaryKey().notNull(),
	classId: integer("class_id").notNull().references(() => classes.id),
	subjectId: integer("subject_id").notNull().references(() => subjects.id),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	academicYear: varchar("academic_year", { length: 10 }).notNull(),
	status: varchar("status", { length: 20 }).default('draft'),
	chapters: jsonb("chapters").$type<Chapter[]>(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_curriculum_class_subject").on(table.classId, table.subjectId),
	unique("unique_curriculum_class_subject_year").on(table.classId, table.subjectId, table.academicYear)
]);

export const curriculumProgress = pgTable("curriculum_progress", {
	id: serial().primaryKey().notNull(),
	curriculumId: integer("curriculum_id").notNull().references(() => curriculum.id),
	classId: integer("class_id").notNull().references(() => classes.id),
	completedTopics: jsonb("completed_topics").$type<string[]>(),
	progressPercentage: integer("progress_percentage").default(0),
	lastUpdated: timestamp("last_updated", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_curriculum_progress_curriculum").on(table.curriculumId),
	unique("unique_curriculum_progress").on(table.curriculumId, table.classId)
]);


// ======================== RELATIONS ===============================
// ==================== TEACHER-CLASS RELATIONSHIP ====================
export const teacherClasses = pgTable("teacher_classes", {
	id: serial().primaryKey().notNull(),
	teacherId: integer("teacher_id").notNull().references(() => teachers.id),
	classId: integer("class_id").notNull().references(() => classes.id),
	isPrimary: boolean("is_primary").default(false),
	subjects: text().array(), // Subjects taught by this teacher in this class
}, (table) => [
	index("idx_teacher_classes_teacher").on(table.teacherId),
	index("idx_teacher_classes_class").on(table.classId),
	unique("unique_teacher_class").on(table.teacherId, table.classId)
]);

// ==================== SUBJECT-CLASS RELATIONSHIP ====================
// Update the subjects table to include classId
// Since we can't modify existing table, we'll create a view or additional table
export const subjectClasses = pgTable("subject_classes", {
	id: serial().primaryKey().notNull(),
	subjectId: integer("subject_id").notNull().references(() => subjects.id),
	classId: integer("class_id").notNull().references(() => classes.id),
}, (table) => [
	index("idx_subject_classes_subject").on(table.subjectId),
	index("idx_subject_classes_class").on(table.classId),
	unique("unique_subject_class").on(table.subjectId, table.classId)
]);

// Update relations for existing tables
export const teachersRelations = relations(teachers, ({ many }) => ({
	teacherClasses: many(teacherClasses),
}));

export const classesRelations = relations(classes, ({ many }) => ({
	teacherClasses: many(teacherClasses),
	subjectClasses: many(subjectClasses),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
	subjectClasses: many(subjectClasses),
}));

export const teacherClassesRelations = relations(teacherClasses, ({ one }) => ({
	teacher: one(teachers, {
		fields: [teacherClasses.teacherId],
		references: [teachers.id],
	}),
	class: one(classes, {
		fields: [teacherClasses.classId],
		references: [classes.id],
	}),
}));

export const subjectClassesRelations = relations(subjectClasses, ({ one }) => ({
	subject: one(subjects, {
		fields: [subjectClasses.subjectId],
		references: [subjects.id],
	}),
	class: one(classes, {
		fields: [subjectClasses.classId],
		references: [classes.id],
	}),
}));