// ./src/app/academics/classes/data/teachersData.ts
import { Teacher } from '@api/types';

export const teachersData: Record<string, Teacher[]> = {
  "Nursery 1": [
    {
      id: "T-001",
      name: "Miss Sarah Williams",
      surname: '',
      role: "Class Teacher",
      email: "sarah.w@school.com",
      phone: "+234 801 111 2222",
      subjects: ["Early Learning", "Play Activities", "Story Time", "Art & Craft"],
      experience: 5,
      qualification: "B.Ed Early Childhood Education",
      staffId: 1001, // FIX: Added missing staffId
      classIds: [1], // FIX: Added classIds placeholder
      classes: ['Nursery 1'], // FIX: Added classes placeholder
    },
    {
      id: "T-002",
      name: "Mrs. Jennifer Lee",
      surname: '',
      role: "Assistant Teacher",
      email: "jennifer.l@school.com",
      phone: "+234 802 222 3333",
      subjects: ["Music", "Physical Education"],
      experience: 3,
      qualification: "Diploma in Early Education",
      staffId: 1002, // FIX: Added missing staffId
      classIds: [1], // FIX: Added classIds placeholder
      classes: ['Nursery 1'], // FIX: Added classes placeholder
    },
  ],
  "Primary 3": [
    {
      id: "T-010",
      name: "Mr. James Wilson",
      surname: '',
      role: "Class Teacher",
      email: "james.w@school.com",
      phone: "+234 803 333 4444",
      subjects: ["Mathematics", "English Language", "Science"],
      experience: 10,
      qualification: "B.Sc Education, PGD Mathematics",
      staffId: 1010, // FIX: Added missing staffId
      classIds: [3], // Placeholder
      classes: ['Primary 3'], // Placeholder
    },
    {
      id: "T-011",
      name: "Mrs. Tola Adekunle",
      surname: '',
      role: "Subject Teacher",
      email: "tola.a@school.com",
      phone: "+234 804 444 5555",
      subjects: ["Social Studies", "Yoruba"],
      experience: 8,
      qualification: "B.A Linguistics, M.Ed",
      staffId: 1011, // FIX: Added missing staffId
      classIds: [3], // Placeholder
      classes: ['Primary 3'], // Placeholder
    },
    {
      id: "T-012",
      name: "Mr. Yusuf Ibrahim",
      surname: '',
      role: "Subject Teacher",
      email: "yusuf.i@school.com",
      phone: "+234 809 999 0000",
      subjects: ["Social Studies", "Civic Education"],
      experience: 9,
      qualification: "B.A History, M.Ed",
      staffId: 1012, // FIX: Added missing staffId
      classIds: [3], // Placeholder
      classes: ['Primary 3'], // Placeholder
    },
  ],
  "SS 1": [
    {
      id: "T-030",
      name: "Mrs. Blessing Nwosu",
      surname: '',
      role: "Class Teacher",
      email: "blessing.n@school.com",
      phone: "+234 810 000 1111",
      subjects: ["Chemistry", "Physics"],
      experience: 15,
      qualification: "Ph.D Chemistry",
      staffId: 1030, // FIX: Added missing staffId
      classIds: [5], // Placeholder
      classes: ['SS 1'], // Placeholder
    },
    {
      id: "T-031",
      name: "Mr. Adebayo Oluwole",
      surname: '',
      role: "Subject Teacher",
      email: "adebayo.o@school.com",
      phone: "+234 811 111 2222",
      subjects: ["Biology", "Agricultural Science"],
      experience: 11,
      qualification: "M.Sc Biology",
      staffId: 1031, // FIX: Added missing staffId
      classIds: [5], // Placeholder
      classes: ['SS 1'], // Placeholder
    },
    {
      id: "T-032",
      name: "Mrs. Fatima Hassan",
      surname: '',
      role: "Subject Teacher",
      email: "fatima.h@school.com",
      phone: "+234 812 222 3333",
      subjects: ["Economics", "Accounting"],
      experience: 12,
      qualification: "M.A Economics",
      staffId: 1032, // FIX: Added missing staffId
      classIds: [5], // Placeholder
      classes: ['SS 1'], // Placeholder
    },
  ],
};