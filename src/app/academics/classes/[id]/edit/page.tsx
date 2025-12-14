// app/dashboard/classes/[id]/edit/page.tsx
import { notFound } from 'next/navigation';
import { getClassById, getAllClasses, getAllTeachers, getAllSubjects } from '@api/class-actions';
import EditClassForm from '../edit/component/edit-class-form';
import { DisplayClassesPage } from "../../components/displayClasses";

// Define the type for available subjects
interface AvailableSubject {
    id: number;
    name: string;
}

export default async function EditClassPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const classId = parseInt(id);

    if (isNaN(classId)) {
        notFound();
    }

    const [classResult, classesResult, teachersResult, subjectsResult] = await Promise.all([
        getClassById(classId),
        getAllClasses(),
        getAllTeachers(),
        getAllSubjects()
    ]);

    if (!classResult.success || !classResult.data) {
        notFound();
    }

    const currentClass = classResult.data;

    // Get full teacher objects from the database
    const availableTeachers = teachersResult.success
        ? teachersResult.data.map((teacher: any) => ({
            id: teacher.id,
            name: teacher.name,
            surname: teacher.surname,
            email: teacher.email,
            phone: teacher.phone,
            role: teacher.role,
        }))
        : [];

    // Debug: Log the raw subjects data to see the actual structure
    console.log('Raw subjects data:', subjectsResult);
    console.log('Current Class Name:', currentClass.className);

    // Filter subjects by the current class name - try different field names
    let availableSubjects: AvailableSubject[] = [];
    
    if (subjectsResult.success && Array.isArray(subjectsResult.data)) {
        const rawSubjects = subjectsResult.data;
        console.log('All subjects from database:', rawSubjects);
        
        // Try different possible field names for class name
        availableSubjects = rawSubjects
            .filter((subject: any) => {
                // Try multiple possible field names for class name
                const subjectClassName = subject.class_name || subject.className || subject.class;
                console.log(`Subject: ${subject.name}, Class Field: ${subjectClassName}, Looking for: ${currentClass.className}`);
                
                return subjectClassName && 
                       subjectClassName.toLowerCase() === currentClass.className.toLowerCase();
            })
            // Remove any duplicates by name
            .filter((subject: any, index: number, self: any[]) => 
                index === self.findIndex(s => s.name.toLowerCase() === subject.name.toLowerCase())
            )
            .map((subject: any) => ({
                id: subject.id,
                name: subject.name
            }));
    }

    console.log('Available Subjects for this class:', availableSubjects);

    return (
        <>
            <EditClassForm
                classData={currentClass}
                availableTeachers={availableTeachers}
                availableSubjects={availableSubjects}
            />
            <DisplayClassesPage classes={classesResult.success ? classesResult.data : []} />
        </>
    );
}