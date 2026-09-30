import projectData from './projects.json';

export interface Project {
  slug: string;
  title: string;
  preview?: { title: string; description: string };
  theme: string;
  summary: string;
  question: string | null;
  methodology: string[];
  results: string[];
  resultsNote?: string;
  resultsHeading?: string;
  workflow?: {
    title: string;
    note: string;
    steps: { title: string; description: string }[];
    insightTitle: string;
    insight: string;
    link: string;
    linkLabel: string;
  };
  detailsTodo?: string[];
  status: string | null;
  role?: string;
  date?: string;
  dataFile?: string;
  takeaway?: string;
  scope?: string;
  cvSummary?: string;
  limitations?: string[];
  references?: { label: string; url: string; note?: string }[];
  repository: string | null;
  selected: boolean;
  published: boolean;
  isPlaceholder: boolean;
  output?: { type: 'Research software' | 'Research workflow'; role: string };
  figure?: { src: string; alt: string; caption: string; width?: number; height?: number; download?: string };
}

// User-confirmed work; missing methods and quantitative results stay explicit.
export const projects: Project[] = (projectData as Project[]).filter(project => project.published === true);
