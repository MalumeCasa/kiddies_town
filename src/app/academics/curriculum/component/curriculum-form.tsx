// components/curriculum/create-curriculum-form.tsx
'use client'

import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { ShowcaseSectionDesc } from "@/components/Layouts/showcase-section";
import { useState, useEffect } from 'react';

interface CreateCurriculumFormState {
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  academicYear: string;
  status: string;
  totalHours: number;
  objectives: string;
  learningOutcomes: string;
  assessmentMethods: string;
  resourcesRequired: string;
  gradingSystem: string;
  chapters: CurriculumChapter[];
}

interface CurriculumChapter {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  topics: CurriculumTopic[];
}

interface CurriculumTopic {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  learningObjectives: string;
  teachingMethods: string;
  assessment: string;
  resources: string;
}

export function CreateCurriculumForm() {
  // Class Options
  const classOptions = [
    { value: "GRADE_1", label: "Grade 1" },
    { value: "GRADE_2", label: "Grade 2" },
    { value: "GRADE_3", label: "Grade 3" },
    { value: "GRADE_4", label: "Grade 4" },
    { value: "GRADE_5", label: "Grade 5" },
    { value: "GRADE_6", label: "Grade 6" },
    { value: "GRADE_7", label: "Grade 7" },
    { value: "GRADE_8", label: "Grade 8" },
    { value: "GRADE_9", label: "Grade 9" },
    { value: "GRADE_10", label: "Grade 10" },
    { value: "GRADE_11", label: "Grade 11" },
    { value: "GRADE_12", label: "Grade 12" }
  ];

  // Subject Options
  const subjectOptions = [
    { value: "MATHEMATICS", label: "Mathematics" },
    { value: "ENGLISH", label: "English" },
    { value: "AFRIKAANS", label: "Afrikaans" },
    { value: "SCIENCE", label: "Science" },
    { value: "BIOLOGY", label: "Biology" },
    { value: "PHYSICS", label: "Physics" },
    { value: "CHEMISTRY", label: "Chemistry" },
    { value: "GEOGRAPHY", label: "Geography" },
    { value: "HISTORY", label: "History" },
    { value: "LIFE_ORIENTATION", label: "Life Orientation" },
    { value: "ECONOMICS", label: "Economics" },
    { value: "ACCOUNTING", label: "Accounting" },
    { value: "BUSINESS_STUDIES", label: "Business Studies" },
    { value: "COMPUTER_LITERACY", label: "Computer Literacy" },
    { value: "ART", label: "Art" },
    { value: "MUSIC", label: "Music" },
    { value: "PHYSICAL_EDUCATION", label: "Physical Education" }
  ];

  // Status Options
  const statusOptions = [
    { value: "DRAFT", label: "Draft" },
    { value: "ACTIVE", label: "Active" },
    { value: "ARCHIVED", label: "Archived" },
    { value: "UNDER_REVIEW", label: "Under Review" }
  ];

  // Grading System Options
  const gradingSystemOptions = [
    { value: "PERCENTAGE", label: "Percentage (0-100%)" },
    { value: "LEVELS", label: "Levels (1-7)" },
    { value: "LETTER_GRADES", label: "Letter Grades (A-F)" },
    { value: "COMPETENCY", label: "Competency Based" }
  ];

  const [curriculum, setCurriculum] = useState<CreateCurriculumFormState>({
    title: '',
    description: '',
    classId: '',
    subjectId: '',
    academicYear: new Date().getFullYear().toString(),
    status: 'DRAFT',
    totalHours: 0,
    objectives: '',
    learningOutcomes: '',
    assessmentMethods: '',
    resourcesRequired: '',
    gradingSystem: '',
    chapters: []
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleCurriculumChange = (field: keyof CreateCurriculumFormState, value: string | string[] | number | CurriculumChapter[]) => {
    setCurriculum(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to add a new chapter
  const addChapter = () => {
    const newChapter: CurriculumChapter = {
      id: `chapter-${Date.now()}`,
      title: '',
      description: '',
      order: curriculum.chapters.length + 1,
      duration: 0,
      topics: []
    };
    
    setCurriculum(prev => ({
      ...prev,
      chapters: [...prev.chapters, newChapter]
    }));
  };

  // Function to update a chapter
  const updateChapter = (chapterId: string, field: keyof CurriculumChapter, value: any) => {
    setCurriculum(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter => 
        chapter.id === chapterId ? { ...chapter, [field]: value } : chapter
      )
    }));
  };

  // Function to remove a chapter
  const removeChapter = (chapterId: string) => {
    setCurriculum(prev => ({
      ...prev,
      chapters: prev.chapters.filter(chapter => chapter.id !== chapterId)
    }));
  };

  // Function to add a topic to a chapter
  const addTopic = (chapterId: string) => {
    const newTopic: CurriculumTopic = {
      id: `topic-${Date.now()}`,
      title: '',
      description: '',
      order: 0,
      duration: 0,
      learningObjectives: '',
      teachingMethods: '',
      assessment: '',
      resources: ''
    };

    setCurriculum(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter => 
        chapter.id === chapterId 
          ? { ...chapter, topics: [...chapter.topics, newTopic] }
          : chapter
      )
    }));
  };

  // Function to update a topic
  const updateTopic = (chapterId: string, topicId: string, field: keyof CurriculumTopic, value: any) => {
    setCurriculum(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter => 
        chapter.id === chapterId 
          ? {
              ...chapter,
              topics: chapter.topics.map(topic =>
                topic.id === topicId ? { ...topic, [field]: value } : topic
              )
            }
          : chapter
      )
    }));
  };

  // Function to remove a topic
  const removeTopic = (chapterId: string, topicId: string) => {
    setCurriculum(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter => 
        chapter.id === chapterId 
          ? { ...chapter, topics: chapter.topics.filter(topic => topic.id !== topicId) }
          : chapter
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would call your API to create the curriculum
      console.log('Submitting curriculum:', curriculum);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success handling would go here
      alert('Curriculum created successfully!');
      
      // Reset form or redirect
      setCurriculum({
        title: '',
        description: '',
        classId: '',
        subjectId: '',
        academicYear: new Date().getFullYear().toString(),
        status: 'DRAFT',
        totalHours: 0,
        objectives: '',
        learningOutcomes: '',
        assessmentMethods: '',
        resourcesRequired: '',
        gradingSystem: '',
        chapters: []
      });
      
    } catch (error) {
      console.error('Error creating curriculum:', error);
      alert('Error creating curriculum. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ShowcaseSection
      title="Create New Curriculum"
      className="!p-6.5"
    >
      <form onSubmit={handleSubmit}>
        {/* BASIC INFORMATION */}
        <ShowcaseSection
          title="BASIC INFORMATION"
          className="space-y-5.5 !p-6.5 mb-4.5"
        >
          <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
            <InputGroup
              label="CURRICULUM TITLE"
              name="title"
              type="text"
              placeholder="Enter curriculum title"
              className="w-full xl:w-1/2"
              value={curriculum.title}
              onChange={(e) => handleCurriculumChange('title', e.target.value)}
              required
            />

            <InputGroup
              label="ACADEMIC YEAR"
              name="academicYear"
              type="text"
              placeholder="e.g., 2024-2025"
              className="w-full xl:w-1/2"
              value={curriculum.academicYear}
              onChange={(e) => handleCurriculumChange('academicYear', e.target.value)}
              required
            />
          </div>

          <TextAreaGroup
            label="DESCRIPTION"
            name="description"
            placeholder="Enter curriculum description and overview"
            className="w-full"
            value={curriculum.description}
            onChange={(e) => handleCurriculumChange('description', e.target.value)}
            required
          />

          <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
            <Select
              label="CLASS/GRADE"
              name="classId"
              placeholder="SELECT CLASS/GRADE"
              className="w-full xl:w-1/2"
              items={classOptions}
              value={curriculum.classId}
              onChange={(value: string) => handleCurriculumChange('classId', value)}
              required
            />

            <Select
              label="SUBJECT"
              name="subjectId"
              placeholder="SELECT SUBJECT"
              className="w-full xl:w-1/2"
              items={subjectOptions}
              value={curriculum.subjectId}
              onChange={(value: string) => handleCurriculumChange('subjectId', value)}
              required
            />
          </div>

          <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
            <Select
              label="STATUS"
              name="status"
              placeholder="SELECT STATUS"
              className="w-full xl:w-1/2"
              items={statusOptions}
              value={curriculum.status}
              onChange={(value: string) => handleCurriculumChange('status', value)}
              required
            />

            <InputGroup
              label="TOTAL TEACHING HOURS"
              name="totalHours"
              type="number"
              placeholder="Total hours"
              className="w-full xl:w-1/2"
              value={curriculum.totalHours !== undefined ? String(curriculum.totalHours) : ''}
              onChange={(e) => handleCurriculumChange('totalHours', parseInt(e.target.value) || 0)}
            />
          </div>
        </ShowcaseSection>

        {/* LEARNING OBJECTIVES & OUTCOMES */}
        <ShowcaseSectionDesc
          title="LEARNING OBJECTIVES & OUTCOMES"
          className="space-y-5.5 !p-6.5 mb-4.5"
          description="Define the overall objectives and expected learning outcomes for this curriculum"
        >
          <TextAreaGroup
            label="LEARNING OBJECTIVES"
            name="objectives"
            placeholder="Describe the main learning objectives for this curriculum..."
            className="w-full mb-4.5"
            value={curriculum.objectives}
            onChange={(e) => handleCurriculumChange('objectives', e.target.value)}
          />

          <TextAreaGroup
            label="EXPECTED LEARNING OUTCOMES"
            name="learningOutcomes"
            placeholder="Describe what students should be able to do after completing this curriculum..."
            className="w-full"
            value={curriculum.learningOutcomes}
            onChange={(e) => handleCurriculumChange('learningOutcomes', e.target.value)}
          />
        </ShowcaseSectionDesc>

        {/* ASSESSMENT & GRADING */}
        <ShowcaseSection
          title="ASSESSMENT & GRADING"
          className="space-y-5.5 !p-6.5 mb-4.5"
        >
          <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
            <Select
              label="GRADING SYSTEM"
              name="gradingSystem"
              placeholder="SELECT GRADING SYSTEM"
              className="w-full xl:w-1/2"
              items={gradingSystemOptions}
              value={curriculum.gradingSystem}
              onChange={(value: string) => handleCurriculumChange('gradingSystem', value)}
            />

            <InputGroup
              label="TOTAL ASSESSMENT WEIGHT"
              name="totalWeight"
              type="number"
              placeholder="100"
              className="w-full xl:w-1/2"
              value="100"
              disabled
            />
          </div>

          <TextAreaGroup
            label="ASSESSMENT METHODS"
            name="assessmentMethods"
            placeholder="Describe the assessment methods (tests, projects, exams, etc.)..."
            className="w-full mb-4.5"
            value={curriculum.assessmentMethods}
            onChange={(e) => handleCurriculumChange('assessmentMethods', e.target.value)}
          />

          <TextAreaGroup
            label="RESOURCES REQUIRED"
            name="resourcesRequired"
            placeholder="List the required resources (textbooks, materials, equipment, etc.)..."
            className="w-full"
            value={curriculum.resourcesRequired}
            onChange={(e) => handleCurriculumChange('resourcesRequired', e.target.value)}
          />
        </ShowcaseSection>

        {/* CURRICULUM STRUCTURE - CHAPTERS */}
        <ShowcaseSection
          title="CURRICULUM STRUCTURE"
          className="space-y-5.5 !p-6.5 mb-4.5"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Chapters & Topics</h3>
            <button
              type="button"
              onClick={addChapter}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
            >
              Add Chapter
            </button>
          </div>

          {curriculum.chapters.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No chapters added yet. Click Add Chapter to start building your curriculum.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {curriculum.chapters.map((chapter, chapterIndex) => (
                <div key={chapter.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-700">Chapter {chapterIndex + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeChapter(chapter.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove Chapter
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InputGroup
                      label="CHAPTER TITLE"
                      name={`chapter-title-${chapter.id}`}
                      type="text"
                      placeholder="Enter chapter title"
                      value={chapter.title}
                      onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
                    />

                    <InputGroup
                      label="DURATION (HOURS)"
                      name={`chapter-duration-${chapter.id}`}
                      type="number"
                      placeholder="Hours"
                      value={chapter.duration !== undefined ? String(chapter.duration) : ''}
                      onChange={(e) => updateChapter(chapter.id, 'duration', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <TextAreaGroup
                    label="CHAPTER DESCRIPTION"
                    name={`chapter-description-${chapter.id}`}
                    placeholder="Describe the chapter content and focus..."
                    value={chapter.description}
                    onChange={(e) => updateChapter(chapter.id, 'description', e.target.value)}
                  />

                  {/* Topics Section */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium text-gray-700">Topics</h5>
                      <button
                        type="button"
                        onClick={() => addTopic(chapter.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Add Topic
                      </button>
                    </div>

                    {chapter.topics.length === 0 ? (
                      <p className="text-gray-500 text-sm">No topics added to this chapter.</p>
                    ) : (
                      <div className="space-y-4">
                        {chapter.topics.map((topic, topicIndex) => (
                          <div key={topic.id} className="border border-gray-100 rounded p-3 bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <h6 className="font-medium">Topic {topicIndex + 1}</h6>
                              <button
                                type="button"
                                onClick={() => removeTopic(chapter.id, topic.id)}
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <InputGroup
                                label="TOPIC TITLE"
                                name={`topic-title-${topic.id}`}
                                type="text"
                                placeholder="Enter topic title"
                                value={topic.title}
                                onChange={(e) => updateTopic(chapter.id, topic.id, 'title', e.target.value)}
                              />

                              <InputGroup
                                label="DURATION (HOURS)"
                                name={`topic-duration-${topic.id}`}
                                type="number"
                                placeholder="Hours"
                                value={topic.duration !== undefined ? String(topic.duration) : ''}
                                onChange={(e) => updateTopic(chapter.id, topic.id, 'duration', parseInt(e.target.value) || 0)}
                              />
                            </div>

                            <TextAreaGroup
                              label="TOPIC DESCRIPTION"
                              name={`topic-description-${topic.id}`}
                              placeholder="Describe the topic content..."
                              value={topic.description}
                              onChange={(e) => updateTopic(chapter.id, topic.id, 'description', e.target.value)}
                              className="text-sm"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                              <InputGroup
                                label="LEARNING OBJECTIVES"
                                name={`topic-objectives-${topic.id}`}
                                type="text"
                                placeholder="Specific learning objectives"
                                value={topic.learningObjectives}
                                onChange={(e) => updateTopic(chapter.id, topic.id, 'learningObjectives', e.target.value)}
                              />

                              <InputGroup
                                label="TEACHING METHODS"
                                name={`topic-methods-${topic.id}`}
                                type="text"
                                placeholder="Teaching methods to be used"
                                value={topic.teachingMethods}
                                onChange={(e) => updateTopic(chapter.id, topic.id, 'teachingMethods', e.target.value)}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                              <InputGroup
                                label="ASSESSMENT"
                                name={`topic-assessment-${topic.id}`}
                                type="text"
                                placeholder="Assessment methods"
                                value={topic.assessment}
                                onChange={(e) => updateTopic(chapter.id, topic.id, 'assessment', e.target.value)}
                              />

                              <InputGroup
                                label="RESOURCES"
                                name={`topic-resources-${topic.id}`}
                                type="text"
                                placeholder="Required resources"
                                value={topic.resources}
                                onChange={(e) => updateTopic(chapter.id, topic.id, 'resources', e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ShowcaseSection>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
        >
          {isLoading ? 'Creating Curriculum...' : 'Create Curriculum'}
        </button>
      </form>
    </ShowcaseSection>
  );
}