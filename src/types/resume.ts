export type SectionType = 'summary' | 'work' | 'education' | 'skills';

export interface Project {
  id: string;
  name: string;
  period: string;
  description: string;
  responsibilities: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  period: string;
  projects: Project[];
}

export interface EducationExperience {
  id: string;
  school: string;
  major: string;
  period: string;
}

interface BaseSection<T extends SectionType, D> {
  id: string;
  type: T;
  title: string;
  data: D;
}

export type SummarySection = BaseSection<'summary', { content: string }>;
export type WorkSection = BaseSection<'work', { items: WorkExperience[] }>;
export type EducationSection = BaseSection<'education', { items: EducationExperience[] }>;
export type SkillsSection = BaseSection<'skills', { items: string[] }>;

export type ResumeSection = SummarySection | WorkSection | EducationSection | SkillsSection;

export interface ResumeBasics {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
}

export interface ResumeData {
  basics: ResumeBasics;
  sections: ResumeSection[];
}

export type TemplateType = 'classic' | 'modern';
export type ThemeType = 'ocean' | 'forest' | 'sunset';
