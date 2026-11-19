import { Course } from '../../types';
import { PRIORITY_COURSES_PART1 } from './priorityCoursesPart1';
import { PRIORITY_COURSES_PART2 } from './priorityCoursesPart2';
import { PRIORITY_COURSES_PART3 } from './priorityCoursesPart3';
import { PRIORITY_COURSES_PART4 } from './priorityCoursesPart4';

export * from './priorityCoursesPart1';
export * from './priorityCoursesPart2';
export * from './priorityCoursesPart3';
export * from './priorityCoursesPart4';

export const ALL_PRIORITY_COURSES: Course[] = [
  ...PRIORITY_COURSES_PART1,
  ...PRIORITY_COURSES_PART2,
  ...PRIORITY_COURSES_PART3,
  ...PRIORITY_COURSES_PART4,
];
