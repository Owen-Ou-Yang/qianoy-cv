import courseworkData from './coursework.json';

interface CourseworkProject {
  id: string;
  title: string;
  course: string;
  courseCode: string;
  institution: string;
  term: string;
  instructor: string;
  bullets: string[];
  repository: string | null;
  published: boolean;
}

// Coursework remains separate from research lines and publication records.
export const coursework: CourseworkProject[] = (courseworkData as CourseworkProject[]).filter(project => project.published);
