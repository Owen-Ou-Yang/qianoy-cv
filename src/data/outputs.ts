import { projects } from './projects';
import publicationData from './publications.json';

export const outputTypes = ['Publication', 'Preprint', 'Manuscript', 'Poster', 'Talk'] as const;
export interface ResearchOutput {
  id: string;
  type: typeof outputTypes[number];
  title: string;
  authors: string;
  venue?: string;
  date?: string;
  status?: string;
  url?: string;
  code?: string;
}
// Add only real, verified entries. See README.md for an example shape.
export const outputs: ResearchOutput[] = publicationData as ResearchOutput[];

// Software and workflow contributions are not publication citations.
export const softwareOutputs = projects.filter(project => project.output);
