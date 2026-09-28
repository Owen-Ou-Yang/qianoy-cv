import profileData from './profile.json';
import researchData from './research.json';
import publicationData from './publications.json';

interface Profile {
  name: string | null;
  domain: string;
  siteUrl: string;
  identity: string;
  metaDescription: string;
  introduction: string;
  biography: string[];
  email: string | null;
  github: string | null;
  linkedin: string | null;
  education: {
    background: string;
    level: string;
    degree: string | null;
    program: string | null;
    institution: string | null;
    dates: string | null;
  };
  experience: {
    role: string;
    institution: string;
    group: string | null;
    dates: string;
    description: string;
    dateTodo: string | null;
  }[];
  skills: { title: string; description: string }[];
  programmingLanguages: string[];
  cvIsDraft: boolean;
  socialImage: string | null;
}

// JSON records are also read by the optional PDF generator.
export const profile: Profile = profileData;
export const researchThemes = researchData;
export const displayName = profile.name ?? 'TODO: Full name';
export const siteTitle = profile.name ?? profile.domain;
export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Research', href: '/research/' },
  ...(publicationData.length ? [{ label: 'Publications', href: '/publications/' }] : []),
  { label: 'CV', href: '/cv/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];
