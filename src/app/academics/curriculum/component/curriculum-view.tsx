// components/curriculum/curriculum-view.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, BookOpen, Clock, Target, FileText } from 'lucide-react';
import type { Chapter } from '@api/db/types';

// components/curriculum/curriculum-view.tsx
interface CurriculumViewProps {
    curriculum: {
        id: number;
        title: string;
        description: string | null;
        academicYear: string;
        status: string | null;
        classId: number;
        subjectId: number;
        className: string | null;
        subjectName: string | null;
        chapters: Chapter[] | null;
        createdAt: string | null;
        updatedAt: string | null;
    };
}

export function CurriculumView({ curriculum }: CurriculumViewProps) {
    const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
    const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

    const toggleChapter = (index: number) => {
        const newExpanded = new Set(expandedChapters);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedChapters(newExpanded);
    };

    const toggleTopicCompletion = (topicId: string) => {
        const newCompleted = new Set(completedTopics);
        if (newCompleted.has(topicId)) {
            newCompleted.delete(topicId);
        } else {
            newCompleted.add(topicId);
        }
        setCompletedTopics(newCompleted);
    };

    const getCompletionPercentage = () => {
        const totalTopics = curriculum.chapters?.reduce((total, chapter) =>
            total + (chapter.topics?.length || 0), 0) || 0;
        return totalTopics > 0 ? Math.round((completedTopics.size / totalTopics) * 100) : 0;
    };

    // Safe date conversion
    const formatDate = (dateString: string | null): string => {
        if (!dateString) return 'Not available';

        try {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
        } catch {
            return 'Invalid date';
        }
    };

    const {
        title,
        description,
        chapters = [],
        className = 'Not specified',
        subjectName = 'Not specified',
        academicYear,
        status = 'draft',
        createdAt,
        updatedAt,
    } = curriculum;

    return (
        <div className="space-y-6">
            {/* Progress Summary */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Curriculum Progress</h3>
                            <p className="text-sm text-muted-foreground">
                                Track your completion progress
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold">{getCompletionPercentage()}%</div>
                            <div className="text-sm text-muted-foreground">
                                {completedTopics.size} of {curriculum.chapters?.reduce((total, chapter) =>
                                    total + (chapter.topics?.length || 0), 0) || 0} topics completed
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-secondary rounded-full h-2">
                        <div
                            className="bg-primary rounded-full h-2 transition-all duration-300"
                            style={{ width: `${getCompletionPercentage()}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Chapters List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Curriculum Content</h3>

                {!curriculum.chapters || curriculum.chapters.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No chapters added to this curriculum yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    curriculum.chapters.map((chapter, chapterIndex) => (
                        <Card key={chapter.id} className="overflow-hidden">
                            <CardHeader
                                className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => toggleChapter(chapterIndex)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                        >
                                            {expandedChapters.has(chapterIndex) ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <div>
                                            <CardTitle className="text-lg">
                                                Chapter {chapter.order}: {chapter.title}
                                            </CardTitle>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <Badge variant="outline">
                                                    {chapter.topics?.length || 0} topics
                                                </Badge>
                                                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>
                                                        {chapter.topics?.reduce((total, topic) => {
                                                            const match = topic.duration?.match(/(\d+)/);
                                                            return total + (match ? parseInt(match[1]) : 0);
                                                        }, 0) || 0} hours
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {Math.round(((chapter.topics?.filter(topic => completedTopics.has(topic.id)).length || 0) /
                                            (chapter.topics?.length || 1)) * 100)}% complete
                                    </div>
                                </div>
                            </CardHeader>

                            {expandedChapters.has(chapterIndex) && chapter.topics && chapter.topics.length > 0 && (
                                <CardContent className="pt-0">
                                    <div className="space-y-3">
                                        {chapter.topics.map((topic) => (
                                            <div
                                                key={topic.id}
                                                className="flex items-start space-x-3 p-3 rounded-lg border"
                                            >
                                                <Checkbox
                                                    checked={completedTopics.has(topic.id)}
                                                    onCheckedChange={() => toggleTopicCompletion(topic.id)}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h4 className="font-medium">
                                                                Topic {topic.order}: {topic.title}
                                                            </h4>
                                                            {topic.duration && (
                                                                <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span>{topic.duration}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Learning Objectives */}
                                                    {topic.objectives && topic.objectives.length > 0 && (
                                                        <div className="mt-2">
                                                            <div className="flex items-center space-x-1 text-sm font-medium text-muted-foreground">
                                                                <Target className="h-3 w-3" />
                                                                <span>Learning Objectives</span>
                                                            </div>
                                                            <ul className="mt-1 space-y-1">
                                                                {topic.objectives.map((objective, index) => (
                                                                    <li key={index} className="text-sm text-muted-foreground ml-4">
                                                                        • {objective}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Resources */}
                                                    {topic.resources && topic.resources.length > 0 && (
                                                        <div className="mt-2">
                                                            <div className="flex items-center space-x-1 text-sm font-medium text-muted-foreground">
                                                                <FileText className="h-3 w-3" />
                                                                <span>Resources</span>
                                                            </div>
                                                            <ul className="mt-1 space-y-1">
                                                                {topic.resources.map((resource, index) => (
                                                                    <li key={index} className="text-sm text-muted-foreground ml-4">
                                                                        • {resource}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}