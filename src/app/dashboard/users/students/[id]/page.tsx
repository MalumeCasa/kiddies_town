import { notFound } from 'next/navigation';
import { getStudentById, getStudents } from '@api/student-actions';
import { DisplayStudentsPage } from "../_components/displayStudents";
import { ShowcaseSection } from '@/components/Layouts/showcase-section';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EditStudentPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface StudentDetailsSectionProps {
  student: any; // Replace 'any' with your actual Student type
}

// Student Details Section Component for better organization
function StudentDetailsSection({ student }: StudentDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Student Details
        </CardTitle>
        <CardDescription className="text-lg">
          Complete information for {student.surname} {student.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="SURNAME"
              name="surname"
              type="text"
              placeholder={student.surname || "Not provided"}
              defaultValue={student.surname || ""}
              className="w-full"
              disabled
            />
            <InputGroup
              label="FIRST NAME/S"
              name="name"
              type="text"
              placeholder={student.name || "Not provided"}
              defaultValue={student.name || ""}
              className="w-full"
              disabled
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="EMAIL"
              name="email"
              type="email"
              placeholder={student.email || "Not provided"}
              defaultValue={student.email || ""}
              className="w-full"
              disabled
            />
            <InputGroup
              label="PHONE NUMBER"
              name="phone"
              type="text"
              placeholder={student.phone || "Not provided"}
              defaultValue={student.phone || ""}
              className="w-full"
              disabled
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="ADDRESS"
              name="address"
              type="text"
              placeholder={student.address || "Not provided"}
              defaultValue={student.address || ""}
              className="w-full"
              disabled
            />
            <InputGroup
              label="ATTENDANCE"
              name="attendance"
              type="text"
              placeholder={student.attendance || "Not provided"}
              defaultValue={student.attendance || ""}
              className="w-full"
              disabled
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Link href={`/dashboard/users/students`}>
            <Button variant="outline" className="px-6">
              Back to Students
            </Button>
          </Link>
          <Link href={`/dashboard/users/students/${student.id}/edit`}>
            <Button className="px-6 bg-primary hover:bg-primary-dark">
              Edit Student
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading component for better UX
function StudentDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  try {
    // Await the params since they're now a Promise in Next.js 14+
    const { id } = await params;
    
    // Parse the id from string to number with validation
    const studentId = parseInt(id);
    
    if (isNaN(studentId)) {
      console.error('Invalid student ID:', id);
      notFound();
    }

    // Fetch data in parallel for better performance
    const [student, students] = await Promise.all([
      getStudentById(studentId),
      getStudents()
    ]);

    if (!student) {
      console.error('Student not found with ID:', studentId);
      notFound();
    }

    return (
      <div className="space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb 
          pageName={`View Student: ${student.surname} ${student.name?.charAt(0) || ''}`} 
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col gap-8">
            <ShowcaseSection 
              title={`Student: ${student.surname} ${student.name} Details`}
              className="space-y-6 !p-8"
            >
              <StudentDetailsSection student={student} />
            </ShowcaseSection>
          </div>
        </div>

        {/* Students List Section */}
        <div className="mt-12">
          <ShowcaseSection 
            title="All Students"
            className="space-y-6 !p-8"
          >
            <DisplayStudentsPage students={students} />
          </ShowcaseSection>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading student page:', error);
    notFound();
  }
}

// Optional: Add metadata for SEO
export async function generateMetadata({ params }: EditStudentPageProps) {
  try {
    const { id } = await params;
    const studentId = parseInt(id);
    const student = await getStudentById(studentId);

    if (!student) {
      return {
        title: 'Student Not Found',
      };
    }

    return {
      title: `${student.surname} ${student.name} - Student Details`,
      description: `View details for student ${student.surname} ${student.name}`,
    };
  } catch (error) {
    return {
      title: 'Student Details',
    };
  }
}