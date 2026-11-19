import { useState, useCallback } from 'react';

export type ContentStudioView = 
  | 'DASHBOARD'
  | 'COURSE_BUILDER'
  | 'MEDIA_LIBRARY'
  | 'SYLLABUS_EDITOR'
  | 'QUIZ_BUILDER'
  | 'CASE_BUILDER';

export interface ViewNavigationParams {
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  topicContext?: string;
}

export interface ContentStudioRouterState {
  currentView: ContentStudioView;
  selectedCourseId: string | null;
  selectedModuleId: string | null;
  selectedLessonId: string | null;
  topicContext: string;
  
  // Modals & Overlay States
  isPreviewOpen: boolean;
  isAiAssistantOpen: boolean;
  isCreateCourseModalOpen: boolean;
  isMediaLibraryModalOpen: boolean;
}

export const useContentStudioRouter = (initialView: ContentStudioView = 'DASHBOARD') => {
  const [state, setState] = useState<ContentStudioRouterState>({
    currentView: initialView,
    selectedCourseId: null,
    selectedModuleId: null,
    selectedLessonId: null,
    topicContext: '',
    isPreviewOpen: false,
    isAiAssistantOpen: false,
    isCreateCourseModalOpen: false,
    isMediaLibraryModalOpen: false,
  });

  // Navigation handlers
  const navigateTo = useCallback((view: ContentStudioView, params?: ViewNavigationParams) => {
    setState((prev) => ({
      ...prev,
      currentView: view,
      selectedCourseId: params?.courseId !== undefined ? params.courseId : prev.selectedCourseId,
      selectedModuleId: params?.moduleId !== undefined ? params.moduleId : prev.selectedModuleId,
      selectedLessonId: params?.lessonId !== undefined ? params.lessonId : prev.selectedLessonId,
      topicContext: params?.topicContext !== undefined ? params.topicContext : prev.topicContext,
    }));
  }, []);

  const openCourseBuilder = useCallback((courseId?: string) => {
    setState((prev) => ({
      ...prev,
      currentView: 'COURSE_BUILDER',
      selectedCourseId: courseId || prev.selectedCourseId,
    }));
  }, []);

  const openMediaLibrary = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentView: 'MEDIA_LIBRARY',
      isMediaLibraryModalOpen: true,
    }));
  }, []);

  const openSyllabusEditor = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentView: 'SYLLABUS_EDITOR',
    }));
  }, []);

  const openQuizBuilder = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentView: 'QUIZ_BUILDER',
    }));
  }, []);

  const openCaseBuilder = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentView: 'CASE_BUILDER',
    }));
  }, []);

  const backToDashboard = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentView: 'DASHBOARD',
    }));
  }, []);

  // Modal toggles
  const setPreviewOpen = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, isPreviewOpen: open }));
  }, []);

  const setAiAssistantOpen = useCallback((open: boolean, context?: string) => {
    setState((prev) => ({
      ...prev,
      isAiAssistantOpen: open,
      topicContext: context !== undefined ? context : prev.topicContext,
    }));
  }, []);

  const setCreateCourseModalOpen = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, isCreateCourseModalOpen: open }));
  }, []);

  const setMediaLibraryModalOpen = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, isMediaLibraryModalOpen: open }));
  }, []);

  return {
    ...state,
    navigateTo,
    openCourseBuilder,
    openMediaLibrary,
    openSyllabusEditor,
    openQuizBuilder,
    openCaseBuilder,
    backToDashboard,
    setPreviewOpen,
    setAiAssistantOpen,
    setCreateCourseModalOpen,
    setMediaLibraryModalOpen,
  };
};
