import selectionData from './cv.json';
import courseworkData from './coursework.json';
import { profile } from './site';

interface ResearchTopic {
  id: string;
  title: string;
  paragraphs: string[];
  sourceProjects: string[];
}
interface CVSelection {
  education: { id: string; source: 'education' | 'exchangeEducation'; courseCodes?: string[] }[];
  researchExperience: { id: string; profileRole: string; topics: ResearchTopic[] }[];
  courseProjects: { id: string; paragraph: string }[];
  skills: { label: string; items: string[] }[];
}
export const cv: CVSelection = selectionData as CVSelection;

// Published projects, research-line order, and status text do not select CV content.
const ids = [...cv.education, ...cv.researchExperience, ...cv.researchExperience.flatMap(entry => entry.topics), ...cv.courseProjects].map(entry => entry.id);
if (new Set(ids).size !== ids.length) throw new Error('CV selection IDs must be unique.');

export const cvEducation = cv.education.map(entry => {
  if (entry.source === 'education') {
    return {
      id: entry.id,
      institution: profile.education.institution ?? 'TODO: Institution',
      dates: profile.education.dates ?? 'TODO: Study dates',
      description: `${profile.education.degree ?? profile.education.level} studies in ${profile.education.background}`,
      program: profile.education.program,
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
  return { ...record, id: entry.id, topics: entry.topics };
});

export const cvCourseProjects = cv.courseProjects.map(entry => {
  const record = courseworkData.find(record => record.id === entry.id);
  if (!record) throw new Error(`Unknown CV course project: ${entry.id}`);
  return { ...record, paragraph: entry.paragraph };
});
