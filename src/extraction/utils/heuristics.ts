import { ResumeData, ResumeSection } from '../../types/resume';
import { createId } from '../../utils/id';

const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_REGEX = /(?:\+?\d{1,3}[\s-]?)?(?:1\d{10}|\d{3,4}[\s-]?\d{7,8})/;
const DATE_REGEX = /(19|20)\d{2}[./-](0?[1-9]|1[0-2])(?:\s*[~-]\s*(?:至今|(19|20)\d{2}[./-](0?[1-9]|1[0-2])))?/;

const pickName = (lines: string[]): string => {
  const candidate = lines.find((line) => line.length >= 2 && line.length <= 12 && !EMAIL_REGEX.test(line) && !PHONE_REGEX.test(line));
  return candidate ?? '未命名候选人';
};

const pickSummary = (lines: string[]): string => {
  const markerIndex = lines.findIndex((line) => /个人简介|summary|profile/i.test(line));
  if (markerIndex >= 0) {
    const next = lines.slice(markerIndex + 1, markerIndex + 4).join(' ');
    if (next.trim()) return next.trim();
  }

  return lines.slice(0, 6).join(' ').slice(0, 180);
};

const pickSkills = (text: string): string[] => {
  const preset = ['TypeScript', 'JavaScript', 'React', 'Vue', 'Node.js', 'Python', 'SQL', 'Docker'];
  return preset.filter((skill) => new RegExp(skill.replace('.', '\\.'), 'i').test(text));
};

const pickWorkLines = (lines: string[]): string[] => {
  const start = lines.findIndex((line) => /工作经历|work experience|experience/i.test(line));
  if (start < 0) return lines.filter((line) => DATE_REGEX.test(line));

  const end = lines.findIndex((line, idx) => idx > start && /教育经历|education|项目经历|projects|技能|skills/i.test(line));
  return end > start ? lines.slice(start + 1, end) : lines.slice(start + 1);
};

const buildWorkSection = (lines: string[]): ResumeSection | null => {
  const blocks = pickWorkLines(lines)
    .filter((line) => line.length > 3)
    .slice(0, 4)
    .map((line) => {
      const date = line.match(DATE_REGEX)?.[0] ?? '';
      const cleaned = line.replace(date, '').trim();
      const [companyPart, titlePart] = cleaned.split(/[-|·]/).map((item) => item.trim());

      return {
        id: createId(),
        company: companyPart || '待识别公司',
        title: titlePart || '待识别岗位',
        period: date,
        projects: [],
      };
    });

  if (!blocks.length) return null;

  return {
    id: createId(),
    type: 'work',
    title: '工作经历',
    data: { items: blocks },
  };
};

export const buildResumeFromText = (rawText: string): ResumeData => {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const email = rawText.match(EMAIL_REGEX)?.[0] ?? '';
  const phone = rawText.match(PHONE_REGEX)?.[0] ?? '';
  const sections: ResumeSection[] = [
    {
      id: createId(),
      type: 'summary',
      title: '个人简介',
      data: { content: pickSummary(lines) || '从 PDF 提取内容后生成，建议手动校对。' },
    },
  ];

  const workSection = buildWorkSection(lines);
  if (workSection) sections.push(workSection);

  const skills = pickSkills(rawText);
  if (skills.length) {
    sections.push({
      id: createId(),
      type: 'skills',
      title: '技能列表',
      data: { items: skills },
    });
  }

  return {
    basics: {
      name: pickName(lines),
      role: '',
      email,
      phone,
      location: '',
    },
    sections,
  };
};
