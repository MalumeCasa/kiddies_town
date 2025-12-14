// app/academics/curriculum/[id]/view/page.tsx
import { getCurriculumById } from '@api/curriculum-actions';
import { CurriculumView } from '../../component/curriculum-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface CurriculumViewPageProps {
    params: {
        id: string;
    };
}

export default async function CurriculumViewPage({ params }: CurriculumViewPageProps) {
    const result = await getCurriculumById(parseInt(params.id));

    if (!result.success || !result.data) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Link href="/academics/curriculum">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Curriculum Not Found</h1>
                    </div>
                </div>
                <Card>
                    <CardContent className="py-8 text-center text-red-500">
                        Error: {result.error}
                    </CardContent>
                </Card>
            </div>
        );
    }

    const curriculum = result.data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/academics/curriculum">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{curriculum.title}</h1>
                        <p className="text-muted-foreground">
                            {curriculum.className} - {curriculum.subjectName} • {curriculum.academicYear}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant={
                        curriculum.status === 'active' ? 'default' :
                            curriculum.status === 'draft' ? 'secondary' : 'outline'
                    }>
                        {curriculum.status}
                    </Badge>
                    <Link href={`/academics/curriculum/${curriculum.id}/edit`}>
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                    <Link href={`/academics/curriculum/${curriculum.id}/progress`}>
                        <Button size="sm">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Track Progress
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <CurriculumView curriculum={curriculum} />
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Curriculum Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
                                <p className="mt-1">
                                    {curriculum.description || 'No description provided.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Total Chapters</h4>
                                    <p className="mt-1 text-lg font-semibold">
                                        {curriculum.chapters?.length || 0}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Total Topics</h4>
                                    <p className="mt-1 text-lg font-semibold">
                                        {curriculum.chapters?.reduce((total, chapter) =>
                                            total + (chapter.topics?.length || 0), 0) || 0}
                                    </p>
                                </div>
                            </div>

                            {/*
                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground">Created</h4>
                                <p className="mt-1">
                                    {
                                        new Date(curriculum.createdAt).toLocaleDateString()
                                    }
                                </p>
                            </div>
                            */}

                            {curriculum.updatedAt && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Last Updated</h4>
                                    <p className="mt-1">
                                        {new Date(curriculum.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}