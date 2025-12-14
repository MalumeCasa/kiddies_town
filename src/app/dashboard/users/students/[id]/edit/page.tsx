import { notFound } from 'next/navigation';
import { getStudentById, getStudents } from '@api/student-actions';
import EditStudentForm from '../../_components/edit-student-form';
import { DisplayStudentsPage } from "../../_components/displayStudents";

interface EditStudentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  // Await the params since they're now a Promise
  const { id } = await params;
  
  // Parse the id from string to number
  const studentId = parseInt(id);
  
  // Fetch student and students data
  const student = await getStudentById(studentId);
  const students = await getStudents();

  if (!student) {
    notFound();
  }

  // Pass the entire `student` object to the EditStudentForm as a prop.
  return (
    <>
      <EditStudentForm student={student} />
      <DisplayStudentsPage students={students} />
    </>
  );
}