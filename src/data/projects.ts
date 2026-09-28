import projectData from './projects.json';

export interface Project {
  slug: string;
  title: string;
  theme: string;
  summary: string;
  question: string | null;
  methodology: string[];
  results: string[];
  resultsNote?: string;
  detailsTodo?: string[];
  status: string | null;
  role?: string;
  repository: string | null;
  selected: boolean;
  published: boolean;
  isPlaceholder: boolean;
  output?: { type: 'Research software' | 'Research workflow'; role: string };
  figure?: { src: string; alt: string; caption: string };
}

// User-confirmed work; missing methods and quantitative results stay explicit.
export const projects: Project[] = (projectData as Project[]).filter(project => project.published === true);
