// components/curriculum/curriculum-progress-view.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, BookOpen, Clock, Target, FileText, Users } from 'lucide-react';
import { updateCurriculumProgress } from '@api/curriculum-actions';
import type { Chapter } from '@api/db/types';

interface CurriculumProgressViewProps {
  curriculum: {
    id: number;
    title: string;
    description?: string;
    chapters?: Chapter[];
    className?: string;
    subjectName?: string;
    academicYear: string;
    classId: number;
  };
  progress: {
    id: number;
    curriculumId: number;
    classId: number;
    completedTopics: string[];
    progressPercentage: number;
    lastUpdated: string;
  } | null;
}

export function CurriculumProgressView({ curriculum, progress }: CurriculumProgressViewProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(
    new Set(progress?.completedTopics || [])
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleChapter = (index: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedChapters(newExpanded);
  };

  const handleTopicCompletion = async (topicId: string, completed: boolean) => {
    const newCompleted = new Set(completedTopics);
    
    if (completed) {
      newCompleted.add(topicId);
    } else {
      newCompleted.delete(topicId);
    }
    
    setCompletedTopics(newCompleted);
    
    // Update progress in database
    setIsUpdating(true);
    try {
      await updateCurriculumProgress(
        curriculum.id,
        curriculum.classId,
        Array.from(newCompleted)
      );
    } catch (error) {
      console.error('Failed to update progress:', error);
      // Revert on error
      if (completed) {
        newCompleted.delete(topicId);
      } else {
        newCompleted.add(topicId);
      }
      setCompletedTopics(new Set(newCompleted));
    } finally {
      setIsUpdating(false);
    }
  };

  const getChapterCompletion = (chapter: Chapter) => {
    const completed = chapter.topics?.filter(topic => completedTopics.has(topic.id)).length || 0;
    const total = chapter.topics?.length || 0;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getOverallCompletion = () => {
    const totalTopics = curriculum.chapters?.reduce((total, chapter) => 
      total + (chapter.topics?.length || 0), 0) || 0;
    return totalTopics > 0 ? Math.round((completedTopics.size / totalTopics) * 100) : 0;
  };

  const getTotalDuration = () => {
    return curriculum.chapters?.reduce((total, chapter) => {
      return total + (chapter.topics?.reduce((chapterTotal, topic) => {
        const match = topic.duration?.match(/(\d+)/);
        return chapterTotal + (match ? parseInt(match[1]) : 0);
      }, 0) || 0);
    }, 0) || 0;
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{getOverallCompletion()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Topics Completed</p>
                <p className="text-2xl font-bold">
                  {completedTopics.size} / {curriculum.chapters?.reduce((total, chapter) => 
                    total + (chapter.topics?.length || 0), 0) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Duration</p>
                <p className="text-2xl font-bold">{getTotalDuration()}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Class</p>
                <p className="text-lg font-bold truncate">{curriculum.className}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Curriculum Completion</h3>
              <p className="text-sm text-muted-foreground">
                Track progress for {curriculum.className} - {curriculum.subjectName}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{getOverallCompletion()}%</div>
              <div className="text-sm text-muted-foreground">
                {completedTopics.size} of {curriculum.chapters?.reduce((total, chapter) => 
                  total + (chapter.topics?.length || 0), 0) || 0} topics
              </div>
            </div>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <div 
              className="bg-green-600 rounded-full h-3 transition-all duration-300"
              style={{ width: `${getOverallCompletion()}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Chapters Progress */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Chapter Progress</h3>
        
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
                    <div className="flex-1">
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
                            }, 0) || 0}h
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {getChapterCompletion(chapter)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {chapter.topics?.filter(topic => completedTopics.has(topic.id)).length || 0}/
                        {chapter.topics?.length || 0}
                      </div>
                    </div>
                    <div className="w-20 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-green-600 rounded-full h-2"
                        style={{ width: `${getChapterCompletion(chapter)}%` }}
                      />
                    </div>
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
                          onCheckedChange={(checked) => handleTopicCompletion(topic.id, checked as boolean)}
                          disabled={isUpdating}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
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
                            <Badge variant={completedTopics.has(topic.id) ? "default" : "outline"}>
                              {completedTopics.has(topic.id) ? "Completed" : "Pending"}
                            </Badge>
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