// app/academics/curriculum/page.tsx
import { getTransformedCurriculums } from '@api/curriculum-actions';
import { CurriculumTable } from './component/curriculum-table'; // Assume this is where TableCurriculum is used
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function CurriculumPage() {
  const result = await getTransformedCurriculums();

  if (!result.success) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Curriculum Management</h1>
            <p className="text-muted-foreground">
              Manage and track curriculum progress across all classes
            </p>
          </div>
          <Link href="/academics/curriculum/create">
            <Button>Create New Curriculum</Button>
          </Link>
        </div>
        <div className="text-center text-red-500 py-8">
          Error loading curriculums: {result.error}
        </div>
      </div>
    );
  }

  // FIX: Provide an empty array [] if result.data is null.
  const curriculumsToDisplay = result.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Curriculum Management</h1>
          <p className="text-muted-foreground">
            Manage and track curriculum progress across all classes
          </p>
        </div>
        <Link href="/academics/curriculum/create">
          <Button>Create New Curriculum</Button>
        </Link>
      </div>
      
      {/* Conditionally display "No Data" or the table */}
      {curriculumsToDisplay.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg text-muted-foreground">
            <p>No curriculums found. Click &apos;Create New Curriculum&apos; to get started.</p>
        </div>
      ) : (
        // FIX: Pass the guaranteed array (curriculumsToDisplay)
        <CurriculumTable 
            curriculums={curriculumsToDisplay} 
        />
      )}
    </div>
  );
}