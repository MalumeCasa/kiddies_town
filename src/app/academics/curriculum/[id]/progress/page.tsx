// app/academics/curriculum/[id]/progress/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, BookOpen, Clock, Target, FileText, Users, Loader2 } from 'lucide-react';
import { updateCurriculumProgress, getCurriculumById } from '@api/curriculum-actions';
import { getCurriculumProgress } from '@api/progress-actions'; // Assuming you have a separate API for progress fetching

// ----------------------------------------------------------------------
// CORRECTED INTERFACES
// These interfaces align the component's expected types with the actual API response
// from curriculum-actions.ts, specifically using 'number' for database IDs.
// ----------------------------------------------------------------------

interface Topic {
    id: number;
    title: string;
    // Assuming topics contain a structure that includes 'id'
}

interface Chapter {
    id: number; // FIX: Changed from string to number to match database serial ID
    curriculumId: number;
    chapterNumber: number;
    title: string;
    description?: string;
    order: number;
    topics: Topic[]; 
}

interface CurriculumData {
  id: number;
  title: string;
  // FIX: Allowing string | null to match database return types
  description?: string | null; 
  chapters?: Chapter[]; 
  // FIX: Allowing string | null to match database return types
  className?: string | null; 
  subjectName?: string | null;
  academicYear: string;
  classId: number;
}

interface ProgressData {
  id: number;
  curriculumId: number;
  classId: number;
  completedTopics: string[] | null;
  progressPercentage: number | null;
  lastUpdated: string | null;
}

interface CurriculumProgressViewProps {
  curriculum: CurriculumData;
  initialProgress: ProgressData | null;
}

// ----------------------------------------------------------------------
// HELPER COMPONENTS
// ----------------------------------------------------------------------

interface ChapterItemProps {
    chapter: Chapter;
    completedTopics: string[];
    onTopicToggle: (topicId: string, isChecked: boolean) => void;
}

function ChapterItem({ chapter, completedTopics, onTopicToggle }: ChapterItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    const chapterTotalTopics = chapter.topics?.length || 0;
    const chapterCompletedTopics = chapter.topics?.filter(topic => 
        completedTopics.includes(topic.id.toString())
    ).length || 0;
    
    const progressText = `${chapterCompletedTopics} / ${chapterTotalTopics}`;
    const progressPercent = chapterTotalTopics > 0 
        ? Math.round((chapterCompletedTopics / chapterTotalTopics) * 100)
        : 0;

    return (
        <div className="border rounded-lg shadow-sm">
            <div 
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center space-x-3">
                    {isOpen ? <ChevronDown className="h-5 w-5 text-blue-600" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
                    <h3 className="font-semibold text-lg">{chapter.chapterNumber}. {chapter.title}</h3>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Progress: {progressText} ({progressPercent}%)</span>
                    <Badge variant={progressPercent === 100 ? 'default' : 'secondary'}>
                        {progressPercent === 100 ? 'Completed' : 'In Progress'}
                    </Badge>
                </div>
            </div>
            {isOpen && (
                <div className="p-4 border-t bg-gray-50">
                    <p className="text-sm text-muted-foreground mb-4">{chapter.description}</p>
                    <ul className="space-y-3">
                        {chapter.topics?.map(topic => {
                            const topicIdString = topic.id.toString();
                            const isCompleted = completedTopics.includes(topicIdString);
                            return (
                                <li key={topic.id} className="flex items-center space-x-3">
                                    <Checkbox
                                        id={`topic-${topic.id}`}
                                        checked={isCompleted}
                                        onCheckedChange={(checked) => onTopicToggle(topicIdString, !!checked)}
                                    />
                                    <label
                                        htmlFor={`topic-${topic.id}`}
                                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isCompleted ? 'line-through text-green-600' : ''}`}
                                    >
                                        {topic.title}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

function CurriculumProgressView({ curriculum, initialProgress }: CurriculumProgressViewProps) {
    const [currentProgress, setCurrentProgress] = useState<ProgressData | null>(initialProgress);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    // Memoize the completed topics array for performance
    const completedTopics = useMemo(() => 
        currentProgress?.completedTopics || [], 
        [currentProgress]
    );

    // Calculate overall progress
    const totalTopics = useMemo(() => 
        curriculum.chapters?.reduce((total, chapter) => 
            total + (chapter.topics?.length || 0), 0) || 0, 
        [curriculum.chapters]
    );
    const overallCompletedCount = completedTopics.length;
    const overallProgressPercent = totalTopics > 0 
        ? Math.round((overallCompletedCount / totalTopics) * 100) 
        : 0;

    const handleTopicToggle = useCallback((topicId: string, isChecked: boolean) => {
        setCurrentProgress(prev => {
            const prevCompleted = prev?.completedTopics || [];
            let newCompleted = prevCompleted;

            if (isChecked && !prevCompleted.includes(topicId)) {
                newCompleted = [...prevCompleted, topicId];
            } else if (!isChecked && prevCompleted.includes(topicId)) {
                newCompleted = prevCompleted.filter(id => id !== topicId);
            }

            // The progress percentage will be recalculated on save
            return {
                ...prev,
                curriculumId: curriculum.id,
                classId: curriculum.classId,
                completedTopics: newCompleted,
                progressPercentage: null, // Reset percentage to be calculated server-side
                id: prev?.id || 0, // Placeholder if new record
                lastUpdated: prev?.lastUpdated || null
            } as ProgressData;
        });
    }, [curriculum.id, curriculum.classId]);

    const handleSaveProgress = async () => {
        if (!currentProgress || currentProgress.completedTopics === initialProgress?.completedTopics) {
            setSaveMessage('No changes to save.');
            setTimeout(() => setSaveMessage(null), 3000);
            return;
        }

        setIsSaving(true);
        setSaveMessage(null);
        
        try {
            const result = await updateCurriculumProgress(
                curriculum.id, 
                curriculum.classId, 
                currentProgress.completedTopics || []
            );

            if (result.success && result.data) {
                setCurrentProgress(result.data as ProgressData);
                setSaveMessage('Progress saved successfully!');
            } else {
                setSaveMessage(`Error saving progress: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Save progress error:', error);
            setSaveMessage('An unexpected error occurred during saving.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(null), 5000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header and Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <div>
                        <h1 className="text-3xl font-bold">{curriculum.title}</h1>
                        <p className="text-muted-foreground">
                            {curriculum.className} - {curriculum.subjectName} • {curriculum.academicYear}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2 items-center">
                    {saveMessage && (
                        <Badge variant={saveMessage.includes('Error') ? 'destructive' : 'default'}>
                            {saveMessage}
                        </Badge>
                    )}
                    <Button 
                        onClick={handleSaveProgress} 
                        disabled={isSaving || completedTopics.length === initialProgress?.completedTopics?.length}
                    >
                        {isSaving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <BookOpen className="mr-2 h-4 w-4" />
                        )}
                        {isSaving ? 'Saving...' : 'Save Progress'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {curriculum.chapters?.length === 0 && (
                        <Card>
                            <CardContent className="py-6 text-center text-muted-foreground">
                                No chapters defined for this curriculum.
                            </CardContent>
                        </Card>
                    )}
                    {curriculum.chapters?.map(chapter => (
                        <ChapterItem
                            key={chapter.id}
                            chapter={chapter}
                            completedTopics={completedTopics}
                            onTopicToggle={handleTopicToggle}
                        />
                    ))}
                </div>

                {/* Progress Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <Target className="h-5 w-5 mr-2" /> Overall Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground">Completion</h4>
                                <p className="mt-1 text-4xl font-bold text-blue-600">
                                    {overallProgressPercent}%
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground">Topics Completed</h4>
                                <p className="mt-1 text-lg font-semibold">
                                    {overallCompletedCount} / {totalTopics}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground">Curriculum Status</h4>
                                <p className="mt-1">
                                    <Badge variant={overallProgressPercent === 100 ? 'default' : 'secondary'}>
                                        {overallProgressPercent === 100 ? 'Mastered' : 'In Progress'}
                                    </Badge>
                                </p>
                            </div>
                            {currentProgress?.lastUpdated && (
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground flex items-center">
                                        <Clock className="h-4 w-4 mr-1" /> Last Saved
                                    </h4>
                                    <p className="mt-1 text-sm">
                                        {new Date(currentProgress.lastUpdated).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <FileText className="h-5 w-5 mr-2" /> Curriculum Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-y-2">
                                <h4 className="font-medium text-muted-foreground">Class:</h4>
                                <p className="font-semibold">{curriculum.className || 'N/A'}</p>
                                <h4 className="font-medium text-muted-foreground">Subject:</h4>
                                <p className="font-semibold">{curriculum.subjectName || 'N/A'}</p>
                                <h4 className="font-medium text-muted-foreground">Academic Year:</h4>
                                <p className="font-semibold">{curriculum.academicYear}</p>
                            </div>
                            <h4 className="font-medium text-muted-foreground mt-4">Description:</h4>
                            <p>{curriculum.description || 'No description provided.'}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export default function CurriculumProgressPage() {
  const [curriculum, setCurriculum] = useState<CurriculumData | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = params.id as string;
        const curriculumId = parseInt(id, 10);
        
        if (isNaN(curriculumId)) {
          notFound();
        }

        // 1. Fetch the wrapped responses
        // NOTE: We assume getCurriculumProgress accepts classId as a parameter or fetches it internally.
        // For simplicity, we pass a placeholder classId (e.g., 1) for the progress fetch, 
        // as the actual classId is needed for the progress query. You must replace '1' with the real class ID logic.
        // In a real app, you would need to know the current user's class ID.
        const PLACEHOLDER_CLASS_ID = 1; 
        
        const [curriculumRes, progressRes] = await Promise.all([
          getCurriculumById(curriculumId),
          getCurriculumProgress(curriculumId, PLACEHOLDER_CLASS_ID)
        ]);

        // 2. Handle Curriculum Response
        if (!curriculumRes.success || !curriculumRes.data) {
          setError(curriculumRes.error || 'Failed to load curriculum data');
          // Important: If data is not found, stop here.
          setLoading(false);
          return; 
        }
        
        // Unwrap: Pass only the 'data' property to the state
        setCurriculum(curriculumRes.data as CurriculumData); // Cast to CurriculumData now that types are fixed

        // 3. Handle Progress Response
        // progressRes contains { success: boolean, progress: ProgressData | null }
        if (progressRes.success) {
          // Unwrap: Pass only the 'progress' property to the state
          setProgress(progressRes.progress as ProgressData | null);
        } else {
          // If the progress fetch failed, initialize progress as null
          setProgress(null);
          console.error('Error fetching progress:', progressRes.error);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load curriculum data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !curriculum) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2">{error || 'Curriculum not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <CurriculumProgressView curriculum={curriculum} initialProgress={progress} />
    </div>
  );
}