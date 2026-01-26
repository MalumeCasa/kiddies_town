// components/curriculum/curriculum-table.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Edit, BookOpen, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteCurriculum } from '@api/curriculum-actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Define your transformed data type
interface TableCurriculum {
  id: number;
  title: string;
  description?: string | null | undefined;
  academicYear: string;
  status: string | null; 
  className: string | null; 
  subjectName: string | null; 
  classId: number;
  subjectId: number;
  chapters: any[] | null; 
  createdAt: string | null; 
  updatedAt: string | null;
}

interface CurriculumTableProps {
  curriculums: TableCurriculum[]; 
}

// FIX 1: Update getStatusVariant to accept string | null and provide a fallback.
const getStatusVariant = (status: string | null): "default" | "secondary" | "outline" | "destructive" | "warning" => { 
  // Use a fallback of 'draft' if status is null before switching
  const s = status ?? 'draft'; 
  switch (s) {
    case 'published':
      return 'default';
    case 'draft':
      return 'secondary';
    case 'archived':
      return 'outline';
    default:
      return 'outline';
  }
};


export function CurriculumTable({ curriculums }: CurriculumTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this curriculum?')) {
      return;
    }
    setDeletingId(id);
    const result = await deleteCurriculum(id);
    setDeletingId(null);
    if (result.success) {
      router.refresh();
    } else {
      alert(`Failed to delete curriculum: ${result.error}`);
    }
  };


  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Academic Year</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Chapters</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {curriculums.map((curriculum) => (
            <TableRow key={curriculum.id}>
              <TableCell className="font-medium">{curriculum.title}</TableCell>
              <TableCell>
                {/* FIX 2: Pass status which is string | null, handled by getStatusVariant */}
                <Badge variant={getStatusVariant(curriculum.status)}> 
                  {/* FIX 3: Use nullish coalescing to display a fallback string */}
                  {curriculum.status ?? 'N/A'}
                </Badge>
              </TableCell>
              <TableCell>{curriculum.academicYear}</TableCell>
              {/* FIX 4: Use nullish coalescing for nullable string properties */}
              <TableCell>{curriculum.className ?? 'N/A'}</TableCell> 
              <TableCell>{curriculum.subjectName ?? 'N/A'}</TableCell>
              <TableCell>
                {/* FIX 5: Use optional chaining (?.) and nullish coalescing (??) for chapters length */}
                {curriculum.chapters?.length ?? 0} Chapters
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Link href={`/academics/curriculum/${curriculum.id}/view`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/academics/curriculum/${curriculum.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/academics/curriculum/${curriculum.id}/progress`}>
                    <Button variant="default" size="sm">
                      <BookOpen className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(curriculum.id)}
                    disabled={deletingId === curriculum.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {curriculums.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No curriculums found. Create your first curriculum to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}