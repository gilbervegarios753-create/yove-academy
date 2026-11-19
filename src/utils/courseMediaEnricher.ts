import { Course, Lesson, CourseModule } from '../types';

const CATEGORY_VIDEO_MAP: Record<string, string> = {
  electrical: 'https://www.youtube.com/embed/S_8q2qO3H1k',
  multimeter: 'https://www.youtube.com/embed/0I-0W7_W45g',
  sensors: 'https://www.youtube.com/embed/M1A6w0v_l6c',
  oscilloscope: 'https://www.youtube.com/embed/M1A6w0v_l6c',
  gasoline: 'https://www.youtube.com/embed/1K35d-mGz6E',
  diesel: 'https://www.youtube.com/embed/uN5V_c1mCvg',
  canbus: 'https://www.youtube.com/embed/F0A3x7eJ8_0',
  linbus: 'https://www.youtube.com/embed/M2c0z9y9_94',
  ev: 'https://www.youtube.com/embed/V63O6p4N9vI',
  hybrid: 'https://www.youtube.com/embed/5T3E-5E0_9s',
  hv_batteries: 'https://www.youtube.com/embed/V63O6p4N9vI',
  inverters: 'https://www.youtube.com/embed/5T3E-5E0_9s',
  cvt: 'https://www.youtube.com/embed/xH6o20-7B3g',
  dct: 'https://www.youtube.com/embed/1vG9jP0z84A',
  transmissions: 'https://www.youtube.com/embed/xH6o20-7B3g',
  abs: 'https://www.youtube.com/embed/q3Z3v0v-84c',
  esp: 'https://www.youtube.com/embed/0G7c2_fA1_0',
  ecu: 'https://www.youtube.com/embed/P6eO5s3nB2g',
  mechanical: 'https://www.youtube.com/embed/uN5V_c1mCvg',
};

const DEFAULT_VIDEO = 'https://www.youtube.com/embed/S_8q2qO3H1k';

export function getLessonVideoUrl(lessonTitle: string, category?: string, currentUrl?: string): string {
  if (currentUrl && currentUrl.startsWith('http')) {
    return currentUrl;
  }

  const titleLower = lessonTitle.toLowerCase();

  if (titleLower.includes('can') || titleLower.includes('red') || titleLower.includes('lin')) {
    return CATEGORY_VIDEO_MAP.canbus;
  }
  if (titleLower.includes('osciloscopio') || titleLower.includes('ckp') || titleLower.includes('cmp') || titleLower.includes('onda')) {
    return CATEGORY_VIDEO_MAP.oscilloscope;
  }
  if (titleLower.includes('inyeccion') || titleLower.includes('gdi') || titleLower.includes('gasolina')) {
    return CATEGORY_VIDEO_MAP.gasoline;
  }
  if (titleLower.includes('bateria') || titleLower.includes('electrico') || titleLower.includes('hibrido') || titleLower.includes('hv')) {
    return CATEGORY_VIDEO_MAP.ev;
  }
  if (titleLower.includes('multimetro') || titleLower.includes('voltaje') || titleLower.includes('resistencia') || titleLower.includes('ohm')) {
    return CATEGORY_VIDEO_MAP.multimeter;
  }
  if (titleLower.includes('transmision') || titleLower.includes('cvt') || titleLower.includes('dsg') || titleLower.includes('embrague')) {
    return CATEGORY_VIDEO_MAP.cvt;
  }
  if (titleLower.includes('freno') || titleLower.includes('abs') || titleLower.includes('esp')) {
    return CATEGORY_VIDEO_MAP.abs;
  }

  if (category && CATEGORY_VIDEO_MAP[category]) {
    return CATEGORY_VIDEO_MAP[category];
  }

  return DEFAULT_VIDEO;
}

export function enrichLesson(lesson: Lesson, category?: string): Lesson {
  if (lesson.type === 'video' || !lesson.type) {
    const videoUrl = getLessonVideoUrl(lesson.title, category, lesson.contentUrl);
    return {
      ...lesson,
      contentUrl: videoUrl,
    };
  }
  return lesson;
}

export function enrichModule(module: CourseModule, category?: string): CourseModule {
  const enrichedLessons = (module.lessons || []).map(l => enrichLesson(l, category));
  return {
    ...module,
    lessons: enrichedLessons,
  };
}

export function enrichCourse(course: Course): Course {
  const enrichedModules = (course.modules || []).map(m => enrichModule(m, course.category));
  return {
    ...course,
    modules: enrichedModules,
  };
}

export function enrichCourseCatalog(courses: Course[]): Course[] {
  return courses.map(c => enrichCourse(c));
}
