import { Course } from '../types';
import { COURSES_50_CATALOG } from './courses50Data';
import { ALL_PRIORITY_COURSES } from './courses';

// Priority courses take precedence over base 50 catalog if duplicate IDs exist
const priorityMap = new Map<string, Course>(ALL_PRIORITY_COURSES.map(c => [c.id, c]));

const baseFiltered = COURSES_50_CATALOG.filter(c => !priorityMap.has(c.id));

export const ALL_COURSES_DATA: Course[] = [
  ...ALL_PRIORITY_COURSES,
  ...baseFiltered
];

