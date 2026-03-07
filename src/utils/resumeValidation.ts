import { ResumeData, ResumeSection, SectionType } from '../types/resume';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';

const hasRequiredIdAndTitle = (value: Record<string, unknown>): boolean =>
  isString(value.id) && isString(value.type) && isString(value.title);

const isSummarySection = (section: Record<string, unknown>): boolean =>
  section.type === 'summary' &&
  isObject(section.data) &&
  isString(section.data.content);

const isSkillsSection = (section: Record<string, unknown>): boolean =>
  section.type === 'skills' &&
  isObject(section.data) &&
  Array.isArray(section.data.items) &&
  section.data.items.every(isString);

const isEducationSection = (section: Record<string, unknown>): boolean =>
  section.type === 'education' &&
  isObject(section.data) &&
  Array.isArray(section.data.items) &&
  section.data.items.every((item) => {
    if (!isObject(item)) return false;
    return isString(item.id) && isString(item.school) && isString(item.major) && isString(item.period);
  });

const isWorkSection = (section: Record<string, unknown>): boolean =>
  section.type === 'work' &&
  isObject(section.data) &&
  Array.isArray(section.data.items) &&
  section.data.items.every((work) => {
    if (!isObject(work) || !Array.isArray(work.projects)) return false;
    const workValid = isString(work.id) && isString(work.company) && isString(work.title) && isString(work.period);
    const projectsValid = work.projects.every((project) => {
      if (!isObject(project)) return false;
      const departmentValid = typeof project.department === 'undefined' || isString(project.department);
      return (
        isString(project.id) &&
        isString(project.name) &&
        departmentValid &&
        isString(project.period) &&
        isString(project.description) &&
        isString(project.responsibilities)
      );
    });
    return workValid && projectsValid;
  });

const isKnownSectionType = (type: unknown): type is SectionType =>
  type === 'summary' || type === 'skills' || type === 'education' || type === 'work';

const isResumeSection = (section: unknown): section is ResumeSection => {
  if (!isObject(section) || !hasRequiredIdAndTitle(section) || !isKnownSectionType(section.type)) return false;
  if (section.type === 'summary') return isSummarySection(section);
  if (section.type === 'skills') return isSkillsSection(section);
  if (section.type === 'education') return isEducationSection(section);
  return isWorkSection(section);
};

export const isResumeData = (value: unknown): value is ResumeData => {
  if (!isObject(value) || !isObject(value.basics) || !Array.isArray(value.sections)) return false;

  const basics = value.basics;
  const basicsValid =
    isString(basics.name) &&
    isString(basics.role) &&
    isString(basics.email) &&
    isString(basics.phone) &&
    isString(basics.location);

  return basicsValid && value.sections.every(isResumeSection);
};
