import selectionData from './cv.json';
import { profile } from './site';

interface ResearchTopic {
  id: string;
  title: string;
  paragraphs: string[];
  sourceProjects: string[];
}
interface CVSelection {
  document: { kind: 'owner-approved-pdf'; source: string; publicPath: string; sha256: string; pageCount: number };
  education: { id: string; source: 'education' | 'exchangeEducation'; courseCodes?: string[] }[];
  researchExperience: { id: string; profileRole: string; relatedRole?: string; topics: ResearchTopic[] }[];
  industryExperience: { id: string; profileRole: string; paragraphs: string[] }[];
  skills: { label: string; items: string[] }[];
}
export const cv: CVSelection = selectionData as CVSelection;
export const cvDownloadHref = `${cv.document.publicPath}?v=${cv.document.sha256.slice(0, 12)}`;

// Published projects, research-line order, and status text do not select CV content.
const ids = [...cv.education, ...cv.researchExperience, ...cv.researchExperience.flatMap(entry => entry.topics), ...cv.industryExperience].map(entry => entry.id);
if (new Set(ids).size !== ids.length) throw new Error('CV selection IDs must be unique.');

export const cvEducation = cv.education.map(entry => {
  if (entry.source === 'education') {
    return {
      id: entry.id,
      institution: profile.education.institution ?? 'TODO: Institution',
      dates: profile.education.dates ?? 'TODO: Study dates',
      description: `${profile.education.degree ?? profile.education.level} in ${profile.education.background}`,
      program: [profile.education.college, profile.education.program].filter(Boolean).join(' | '),
      semesterGpa: null,
      credits: null,
      courses: [],
    };
  }
  if (entry.source !== 'exchangeEducation') throw new Error(`Unknown CV education source: ${entry.source}`);
  const exchange = profile.exchangeEducation;
  if (!exchange) throw new Error('The selected CV exchange record is missing.');
  const courses = (entry.courseCodes ?? []).map(code => {
    const course = exchange.courses.find(course => course.code === code);
    if (!course) throw new Error(`Unknown CV course: ${code}`);
    return course;
  });
  return {
    id: entry.id,
    institution: exchange.institution,
    dates: exchange.dates,
    description: exchange.role === 'Non-degree Exchange Student' && exchange.level === 'Undergraduate exchange'
      ? 'Undergraduate Exchange Student (non-degree)' : exchange.role,
    program: null,
    semesterGpa: exchange.semesterGpa,
    credits: exchange.credits,
    courses,
  };
});

export const cvResearch = cv.researchExperience.map(entry => {
  const record = profile.experience.find(record => record.role === entry.profileRole);
  if (!record) throw new Error(`Unknown CV experience: ${entry.profileRole}`);
  const relatedProgram = entry.relatedRole ? profile.experience.find(record => record.role === entry.relatedRole) : null;
  if (entry.relatedRole && !relatedProgram) throw new Error(`Unknown related CV program: ${entry.relatedRole}`);
  return { ...record, id: entry.id, topics: entry.topics, relatedProgram };
});

export const cvIndustry = cv.industryExperience.map(entry => {
  const record = profile.industryExperience.find(record => record.role === entry.profileRole);
  if (!record) throw new Error(`Unknown CV industry experience: ${entry.profileRole}`);
  return { ...record, id: entry.id, paragraphs: entry.paragraphs };
});
