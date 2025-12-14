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

interface Curriculum {
  id: number;
  title: string;
  description?: string;
  academicYear: string;
  status: string;
  className?: string;
  subjectName?: string;
  classId: number;
  subjectId: number;
  chapters?: any[];
  createdAt: string;
}

interface CurriculumTableProps {
  curriculums: Curriculum[];
}

export function CurriculumTable({ curriculums }: CurriculumTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this curriculum?')) {
      return;
    }

    setDeletingId(id);
    const result = await deleteCurriculum(id);
    setDeletingId(null);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const getTotalTopics = (chapters?: any[]) => {
    if (!chapters) return 0;
    return chapters.reduce((total, chapter) => total + (chapter.topics?.length || 0), 0);
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Curriculum Title</TableHead>
            <TableHead>Class & Subject</TableHead>
            <TableHead>Academic Year</TableHead>
            <TableHead>Chapters/Topics</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {curriculums.map((curriculum) => (
            <TableRow key={curriculum.id}>
              <TableCell className="font-medium">
                <div>
                  <div className="font-semibold">{curriculum.title}</div>
                  {curriculum.description && (
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {curriculum.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{curriculum.className}</div>
                  <div className="text-sm text-muted-foreground">
                    {curriculum.subjectName}
                  </div>
                </div>
              </TableCell>
              <TableCell>{curriculum.academicYear}</TableCell>
              <TableCell>
                <div className="text-sm">
                  {curriculum.chapters?.length || 0} chapters
                  <br />
                  <span className="text-muted-foreground">
                    {getTotalTopics(curriculum.chapters)} topics
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(curriculum.status)}>
                  {curriculum.status}
                </Badge>
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
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No curriculums found. Create your first curriculum to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}