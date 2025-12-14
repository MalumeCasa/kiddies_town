// app/academics/curriculum/page.tsx
import { getCurriculums } from '@api/attendance-actions';
import { CurriculumTable } from './component/curriculum-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function CurriculumPage() {
  const result = await getCurriculums();

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

      <CurriculumTable curriculums={result.data || []} />
    </div>
  );
}