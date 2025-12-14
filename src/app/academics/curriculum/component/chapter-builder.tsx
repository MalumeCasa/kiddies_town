// components/curriculum/chapter-builder.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextAreaGroup as Textarea } from '@/components/FormElements/InputGroup/text-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { Chapter, Topic } from '@api/db/types';

interface ChapterBuilderProps {
  chapters: Chapter[];
  setChapters: (chapters: Chapter[]) => void;
}

export function ChapterBuilder({ chapters, setChapters }: ChapterBuilderProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());

  const addChapter = () => {
    const newChapter: Chapter = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      topics: [],
      order: chapters.length + 1,
    };
    setChapters([...chapters, newChapter]);
  };

  const updateChapter = (index: number, updates: Partial<Chapter>) => {
    const updatedChapters = [...chapters];
    updatedChapters[index] = { ...updatedChapters[index], ...updates };
    setChapters(updatedChapters);
  };

  const deleteChapter = (index: number) => {
    const updatedChapters = chapters.filter((_, i) => i !== index);
    // Update order for remaining chapters
    const reorderedChapters = updatedChapters.map((chapter, i) => ({
      ...chapter,
      order: i + 1,
    }));
    setChapters(reorderedChapters);
  };

  const addTopic = (chapterIndex: number) => {
    const chapter = chapters[chapterIndex];
    const newTopic: Topic = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      duration: '',
      objectives: [],
      resources: [],
      isCompleted: false,
      order: chapter.topics.length + 1,
    };
    
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].topics = [...chapter.topics, newTopic];
    setChapters(updatedChapters);
  };

  const updateTopic = (chapterIndex: number, topicIndex: number, updates: Partial<Topic>) => {
    const updatedChapters = [...chapters];
    const topics = [...updatedChapters[chapterIndex].topics];
    topics[topicIndex] = { ...topics[topicIndex], ...updates };
    updatedChapters[chapterIndex].topics = topics;
    setChapters(updatedChapters);
  };

  const deleteTopic = (chapterIndex: number, topicIndex: number) => {
    const updatedChapters = [...chapters];
    const topics = updatedChapters[chapterIndex].topics.filter((_, i) => i !== topicIndex);
    // Update order for remaining topics
    updatedChapters[chapterIndex].topics = topics.map((topic, i) => ({
      ...topic,
      order: i + 1,
    }));
    setChapters(updatedChapters);
  };

  const addObjective = (chapterIndex: number, topicIndex: number) => {
    const topic = chapters[chapterIndex].topics[topicIndex];
    const updatedObjectives = [...topic.objectives, ''];
    updateTopic(chapterIndex, topicIndex, { objectives: updatedObjectives });
  };

  const updateObjective = (chapterIndex: number, topicIndex: number, objIndex: number, value: string) => {
    const topic = chapters[chapterIndex].topics[topicIndex];
    const updatedObjectives = [...topic.objectives];
    updatedObjectives[objIndex] = value;
    updateTopic(chapterIndex, topicIndex, { objectives: updatedObjectives });
  };

  const deleteObjective = (chapterIndex: number, topicIndex: number, objIndex: number) => {
    const topic = chapters[chapterIndex].topics[topicIndex];
    const updatedObjectives = topic.objectives.filter((_, i) => i !== objIndex);
    updateTopic(chapterIndex, topicIndex, { objectives: updatedObjectives });
  };

  const addResource = (chapterIndex: number, topicIndex: number) => {
    const topic = chapters[chapterIndex].topics[topicIndex];
    const updatedResources = [...topic.resources, ''];
    updateTopic(chapterIndex, topicIndex, { resources: updatedResources });
  };

  const updateResource = (chapterIndex: number, topicIndex: number, resIndex: number, value: string) => {
    const topic = chapters[chapterIndex].topics[topicIndex];
    const updatedResources = [...topic.resources];
    updatedResources[resIndex] = value;
    updateTopic(chapterIndex, topicIndex, { resources: updatedResources });
  };

  const deleteResource = (chapterIndex: number, topicIndex: number, resIndex: number) => {
    const topic = chapters[chapterIndex].topics[topicIndex];
    const updatedResources = topic.resources.filter((_, i) => i !== resIndex);
    updateTopic(chapterIndex, topicIndex, { resources: updatedResources });
  };

  const toggleChapter = (index: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedChapters(newExpanded);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Curriculum Structure</h4>
        <Button onClick={addChapter} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Chapter
        </Button>
      </div>

      {chapters.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No chapters added yet. Click "Add Chapter" to start building your curriculum.
          </CardContent>
        </Card>
      )}

      {chapters.map((chapter, chapterIndex) => (
        <Card key={chapter.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => toggleChapter(chapterIndex)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => toggleChapter(chapterIndex)}
                >
                  {expandedChapters.has(chapterIndex) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                <div className="flex-1">
                  <Input
                    placeholder="Chapter title"
                    value={chapter.title}
                    onChange={(e) => updateChapter(chapterIndex, { title: e.target.value })}
                    className="border-none p-0 h-auto text-lg font-semibold focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Chapter {chapter.order}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteChapter(chapterIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {expandedChapters.has(chapterIndex) && (
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Topics</label>
                <div className="space-y-3">
                  {chapter.topics.map((topic, topicIndex) => (
                    <Card key={topic.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3 flex-1">
                            <Badge variant="outline">Topic {topic.order}</Badge>
                            <Input
                              placeholder="Topic title"
                              value={topic.title}
                              onChange={(e) => updateTopic(chapterIndex, topicIndex, { title: e.target.value })}
                              className="flex-1"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTopic(chapterIndex, topicIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Duration</label>
                            <Input
                              placeholder="e.g., 2 weeks, 5 hours"
                              value={topic.duration}
                              onChange={(e) => updateTopic(chapterIndex, topicIndex, { duration: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* Learning Objectives */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">Learning Objectives</label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addObjective(chapterIndex, topicIndex)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Objective
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {topic.objectives.map((objective, objIndex) => (
                              <div key={objIndex} className="flex items-center space-x-2">
                                <Input
                                  placeholder="Learning objective"
                                  value={objective}
                                  onChange={(e) => updateObjective(chapterIndex, topicIndex, objIndex, e.target.value)}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteObjective(chapterIndex, topicIndex, objIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Resources */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">Resources</label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addResource(chapterIndex, topicIndex)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Resource
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {topic.resources.map((resource, resIndex) => (
                              <div key={resIndex} className="flex items-center space-x-2">
                                <Input
                                  placeholder="Resource name or URL"
                                  value={resource}
                                  onChange={(e) => updateResource(chapterIndex, topicIndex, resIndex, e.target.value)}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteResource(chapterIndex, topicIndex, resIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addTopic(chapterIndex)}
                  className="mt-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Topic
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}