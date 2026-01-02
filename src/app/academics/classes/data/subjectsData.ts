// ./src/app/academics/classes/data/subjectsData.ts
import { Subject } from '@api/types';

export const subjectsData: Record<string, Subject[]> = {
  "Nursery 1": [
    {
      id: "SUB-N1-001",
      name: "Early Learning",
      teacher: "Miss Sarah Williams",
      schedule: "Monday - Friday, 9:00 AM",
      duration: "1 hour",
      topics: ["Alphabet Recognition", "Number Counting", "Colors & Shapes", "Basic Vocabulary"],
      assessments: [
        { type: "Observation", date: "Weekly" },
        { type: "Progress Report", date: "Monthly" },
      ],
      // FIX: Add missing required properties
      className: "Nursery 1",
      classSection: "A", // Placeholder
      teacherIds: ["T-001"], // Placeholder for teacher IDs array
      teacherNames: ["Miss Sarah Williams"], // Placeholder for teacher names array
    },
    {
      id: "SUB-N1-002",
      name: "Play Activities",
      teacher: "Miss Sarah Williams",
      schedule: "Daily, 10:30 AM",
      duration: "45 minutes",
      topics: ["Motor Skills", "Social Interaction", "Creative Play", "Group Activities"],
      assessments: [{ type: "Development Check", date: "Bi-weekly" }],
      // FIX: Add missing required properties
      className: "Nursery 1",
      classSection: "A", 
      teacherIds: ["T-001"],
      teacherNames: ["Miss Sarah Williams"],
    },
    {
      id: "SUB-N1-003",
      name: "Music",
      teacher: "Mrs. Jennifer Lee",
      schedule: "Tuesday & Thursday, 2:00 PM",
      duration: "30 minutes",
      topics: ["Nursery Rhymes", "Rhythm & Movement", "Musical Instruments", "Singing"],
      assessments: [{ type: "Performance", date: "Monthly" }],
      // FIX: Add missing required properties
      className: "Nursery 1",
      classSection: "A",
      teacherIds: ["T-002"], // Placeholder
      teacherNames: ["Mrs. Jennifer Lee"], // Placeholder
    },
  ],
  "Standard 1": [
    // ...
  ],
  "SS 1": [
    // ...
    {
      id: "SUB-S1-001",
      name: "Mathematics",
      teacher: "Mr. Aliyu Musa",
      schedule: "Monday, Wednesday, Friday, 9:00 AM",
      duration: "1 hour",
      topics: ["Algebra", "Geometry", "Statistics", "Calculus Basics", "Trigonometry"],
      assessments: [
        { type: "Quiz", date: "Weekly" },
        { type: "Mid-term Exam", date: "Week 6" },
        { type: "Final Exam", date: "Week 12" },
      ],
      // FIX: Add missing required properties
      className: "SS 1",
      classSection: "A", // Placeholder
      teacherIds: ["T-003"],
      teacherNames: ["Mr. Aliyu Musa"],
    },
    {
      id: "SUB-S1-002",
      name: "Physics",
      teacher: "Mrs. Ngozi Okoro",
      schedule: "Tuesday, Thursday, 10:00 AM",
      duration: "1 hour",
      topics: ["Mechanics", "Heat & Thermodynamics", "Waves", "Electricity", "Modern Physics"],
      assessments: [
        { type: "Lab Practical", date: "Bi-weekly" },
        { type: "Mid-term Exam", date: "Week 6" },
        { type: "Final Exam", date: "Week 12" },
      ],
      // FIX: Add missing required properties
      className: "SS 1",
      classSection: "A",
      teacherIds: ["T-004"],
      teacherNames: ["Mrs. Ngozi Okoro"],
    },
    {
      id: "SUB-S1-003",
      name: "Biology",
      teacher: "Mr. Adebayo Oluwole",
      schedule: "Monday, Thursday, 11:00 AM",
      duration: "1 hour",
      topics: ["Cell Biology", "Genetics", "Ecology", "Human Anatomy", "Plant Biology"],
      assessments: [
        { type: "Lab Report", date: "Monthly" },
        { type: "Mid-term Exam", date: "Week 6" },
        { type: "Final Exam", date: "Week 12" },
      ],
      // FIX: Add missing required properties
      className: "SS 1",
      classSection: "A",
      teacherIds: ["T-005"],
      teacherNames: ["Mr. Adebayo Oluwole"],
    },
    {
      id: "SUB-S1-004",
      name: "Economics",
      teacher: "Mrs. Fatima Hassan",
      schedule: "Tuesday, Friday, 1:00 PM",
      duration: "1 hour",
      topics: ["Demand & Supply", "Market Systems", "Production", "Money & Banking", "International Trade"],
      assessments: [
        { type: "Mid-term Exam", date: "Week 6" },
        { type: "Project", date: "Week 10" },
        { type: "Final Exam", date: "Week 12" },
      ],
      // FIX: Add missing required properties
      className: "SS 1",
      classSection: "A",
      teacherIds: ["T-006"],
      teacherNames: ["Mrs. Fatima Hassan"],
    },
  ],
};