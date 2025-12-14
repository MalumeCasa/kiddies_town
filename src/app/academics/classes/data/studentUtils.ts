import { Student } from '@api/types';

// Fallback student data in case the API fails
export const fallbackStudentsData: Record<string, Student[]> = {
  "Nursery 1": [
    {
      id: "1",
      name: "Emma",
      surname: 'Thompson',
      email: "emma.t@parent.com",
      phone: "+234 801 234 5678",
      address: "12 Victoria Island, Lagos",
      attendance: 95,
    },
    {
      id: "2",
      name: "Liam",
      surname: 'Johnson',
      email: "liam.j@parent.com",
      phone: "+234 802 345 6789",
      address: "45 Ikoyi Street, Lagos",
      attendance: 92,
    },
    {
      id: "3",
      name: "Olivia",
      surname: 'Williams',
      email: "olivia.w@parent.com",
      phone: "+234 803 456 7890",
      address: "78 Lekki Phase 1, Lagos",
      attendance: 98,
    },
  ],
  "Primary 3": [
    {
      id: "P3-001",
      name: "Noah",
      surname: 'Anderson',
      email: "noah.a@parent.com",
      phone: "+234 804 567 8901",
      address: "23 Surulere, Lagos",
      attendance: 88,
    },
    {
      id: "P3-002",
      name: "Ava",
      surname: 'Martinez',
      email: "ava.m@parent.com",
      phone: "+234 805 678 9012",
      address: "56 Yaba, Lagos",
      attendance: 94,
    },
    {
      id: "P3-003",
      name: "Ethan",
      surname: 'Davis',
      email: "ethan.d@parent.com",
      phone: "+234 806 789 0123",
      address: "89 Ikeja GRA, Lagos",
      attendance: 91,
    },
  ],
  "JSS 2": [
    {
      id: "J2-001",
      name: "Chioma",
      surname: 'Okafor',
      email: "chioma.o@student.com",
      phone: "+234 808 901 2345",
      address: "67 Festac Town, Lagos",
      attendance: 89,
    },
    {
      id: "J2-002",
      name: "Tunde",
      surname: 'Adebayo',
      email: "tunde.a@student.com",
      phone: "+234 809 012 3456",
      address: "12 Ajah, Lagos",
      attendance: 93,
    },
  ],
  "SS 1": [
    {
      id: "S1-001",
      name: "Adewale",
      surname: 'Johnson',
      email: "adewale.j@student.com",
      phone: "+234 813 456 7890",
      address: "56 Victoria Island, Lagos",
      attendance: 92,
    },
    {
      id: "S1-002",
      name: "Fatima",
      surname: 'Bello',
      email: "fatima.b@student.com",
      phone: "+234 814 567 8901",
      address: "89 Ikoyi, Lagos",
      attendance: 88,
    },
  ],
};

// Enhanced helper function to transform database student data
export const transformStudentData = (studentsFromDB: any[]): Record<string, Student[]> => {
  console.log('🔄 TRANSFORMING STUDENT DATA - RAW DATA:', studentsFromDB);
  
  const transformedData: Record<string, Student[]> = {};
  
  if (!studentsFromDB || !Array.isArray(studentsFromDB)) {
    console.error('❌ INVALID DATA: studentsFromDB is not an array or is null:', studentsFromDB);
    return {};
  }
  
  if (studentsFromDB.length === 0) {
    console.warn('⚠️ EMPTY DATA: studentsFromDB array is empty');
    return {};
  }
  
  try {
    studentsFromDB.forEach((student, index) => {
      console.log(`📝 Processing student ${index}:`, student);
      
      // Try multiple possible field names for class with better matching
      const className = student.class || 
                       student.className || 
                       student.grade || 
                       student.classLevel || 
                       student.level ||
                       student.form ||
                       "Unassigned";
      
      console.log(`🏫 Student ${index} class resolved as: "${className}"`);
      
      if (!transformedData[className]) {
        transformedData[className] = [];
      }
      
      // Try multiple possible field names for each property
      const studentData: Student = {
        id: student.id?.toString() || 
            student.studentId?.toString() || 
            student._id?.toString() || 
            `temp-${Math.random().toString(36).substr(2, 9)}`,
        name: student.name, 
        surname: student.surname,
        email: student.email || 
               student.parentEmail || 
               student.contactEmail || 
               student.emailAddress || 
               `student${index + 1}@school.com`,
        phone: student.phone || 
               student.parentPhone || 
               student.contactPhone || 
               student.phoneNumber || 
               "+234 800 000 0000",
        address: student.address || 
                 student.homeAddress || 
                 student.residentialAddress || 
                 student.contactAddress || 
                 "Lagos, Nigeria",
        attendance: student.attendance || 
                    student.attendancePercentage || 
                    student.attendanceRate || 
                    Math.floor(Math.random() * 20) + 80 // 80-99%
      };
      
      console.log(`✅ Student ${index} transformed:`, studentData);
      transformedData[className].push(studentData);
    });
    
    console.log('🎯 FINAL TRANSFORMED DATA STRUCTURE:', transformedData);
    console.log('📊 CLASSES WITH STUDENTS:', Object.keys(transformedData));
    
    return transformedData;
  } catch (error) {
    console.error('❌ ERROR transforming student data:', error);
    return {};
  }
};

// Function to normalize class names for matching
export const normalizeClassName = (className: string): string => {
  return className.toLowerCase().replace(/\s+/g, ' ').trim();
};

// Function to find matching class name
export const findMatchingClass = (studentClass: string, availableClasses: string[]): string | null => {
  const normalizedStudentClass = normalizeClassName(studentClass);
  
  for (const availableClass of availableClasses) {
    const normalizedAvailableClass = normalizeClassName(availableClass);
    
    // Exact match
    if (normalizedStudentClass === normalizedAvailableClass) {
      return availableClass;
    }
    
    // Partial match (e.g., "nursery1" vs "nursery 1")
    if (normalizedStudentClass.replace(/\s+/g, '') === normalizedAvailableClass.replace(/\s+/g, '')) {
      return availableClass;
    }
    
    // Contains match
    if (normalizedAvailableClass.includes(normalizedStudentClass) || normalizedStudentClass.includes(normalizedAvailableClass)) {
      return availableClass;
    }
  }
  
  return null;
};