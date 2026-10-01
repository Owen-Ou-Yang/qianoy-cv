import lineData from './research-lines.json';
import { projects, type Project } from './projects';

interface ResearchStage {
  slug: string;
  label: string;
  context: string;
}
interface ResearchLineRecord {
  id: string;
  title: string;
  summary: string;
  question: string;
  progression: string;
  cvSummary: string;
  stages: ResearchStage[];
}
export interface ResearchLine extends Omit<ResearchLineRecord, 'stages'> {
  stages: (ResearchStage & { project: Project })[];
}

// One shared hierarchy for the website and CV. Unknown, omitted, or duplicate
// project assignments fail the build rather than silently hiding research.
const assigned = new Set<string>();
const ids = new Set<string>();
export const researchLines: ResearchLine[] = (lineData as ResearchLineRecord[]).map(line => {
  if (ids.has(line.id)) throw new Error(`Duplicate research line: ${line.id}`);
  ids.add(line.id);
  const stages = line.stages.map(stage => {
    const project = projects.find(project => project.slug === stage.slug);
    if (!project) throw new Error(`Unknown or unpublished research project: ${stage.slug}`);
    if (assigned.has(stage.slug)) throw new Error(`Project belongs to multiple research lines: ${stage.slug}`);
    assigned.add(stage.slug);
    return { ...stage, project };
  });
  return { ...line, stages };
});
for (const project of projects) {
  if (!assigned.has(project.slug)) throw new Error(`Project needs a research line: ${project.slug}`);
}

export function researchContext(slug: string) {
  const line = researchLines.find(line => line.stages.some(stage => stage.slug === slug));
  if (!line) throw new Error(`Missing research context: ${slug}`);
  const stage = line.stages.find(stage => stage.slug === slug)!;
  return { line, stage };
}
