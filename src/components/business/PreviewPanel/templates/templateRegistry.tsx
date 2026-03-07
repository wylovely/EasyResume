import { ReactNode } from 'react';
import { ResumeData, TemplateType } from '../../../../types/resume';

interface TemplateProps {
  resume: ResumeData;
}

interface TemplatePlugin {
  id: TemplateType;
  label: string;
  render: (props: TemplateProps) => ReactNode;
}

const renderSections = (resume: ResumeData, options?: { compact?: boolean }) =>
  resume.sections.map((section) => (
    <section className="resume-section" key={section.id}>
      <h2>{section.title}</h2>

      {section.type === 'summary' && <p>{section.data.content}</p>}

      {section.type === 'skills' && (
        <ul className="tag-list">
          {section.data.items.filter(Boolean).map((item, index) => (
            <li key={`${section.id}-${index}`}>{item}</li>
          ))}
        </ul>
      )}

      {section.type === 'education' && (
        <div className="timeline">
          {section.data.items.map((edu) => (
            <div key={edu.id} className="timeline-item">
              <div>
                <strong>{edu.school}</strong>
                <p>{edu.major}</p>
              </div>
              <span>{edu.period}</span>
            </div>
          ))}
        </div>
      )}

      {section.type === 'work' && (
        <div className="timeline">
          {section.data.items.map((work) => (
            <div key={work.id} className="timeline-item work-item">
              <div>
                <div className="work-head">
                  <strong>
                    {work.company} · {work.title}
                  </strong>
                  <span className="work-period">{work.period}</span>
                </div>
                {work.projects.map((project) => (
                  <div key={project.id} className="project-item">
                    <h4>{project.name}</h4>
                    <p className="muted project-meta">{project.period}</p>
                    {project.department && <p className="muted project-meta">部门：{project.department}</p>}
                    {!options?.compact && (
                      <div className="project-content project-description">
                        <span className="project-content-label">项目描述</span>
                        <p>{project.description}</p>
                      </div>
                    )}
                    <div className="project-content project-responsibilities">
                      <span className="project-content-label">工作职责</span>
                      <p>{project.responsibilities}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  ));

const ClassicTemplate = ({ resume }: TemplateProps) => (
  <article className="paper" id="resume-paper">
    <header className="resume-header">
      <h1>{resume.basics.name || '你的姓名'}</h1>
      <p>{resume.basics.role || '目标职位'}</p>
      <div className="meta">
        <span>{resume.basics.phone}</span>
        <span>{resume.basics.email}</span>
        <span>{resume.basics.location}</span>
      </div>
    </header>
    {renderSections(resume)}
  </article>
);

const ModernTemplate = ({ resume }: TemplateProps) => (
  <article className="paper modern-paper" id="resume-paper">
    <header className="resume-header modern-header">
      <div>
        <h1>{resume.basics.name || '你的姓名'}</h1>
        <p>{resume.basics.role || '目标职位'}</p>
      </div>
      <div className="meta modern-meta">
        <span>{resume.basics.phone}</span>
        <span>{resume.basics.email}</span>
        <span>{resume.basics.location}</span>
      </div>
    </header>
    {renderSections(resume)}
  </article>
);

const CompactTemplate = ({ resume }: TemplateProps) => (
  <article className="paper compact-paper" id="resume-paper">
    <header className="resume-header compact-header">
      <h1>{resume.basics.name || '你的姓名'}</h1>
      <div className="meta">
        <span>{resume.basics.role}</span>
        <span>{resume.basics.phone}</span>
        <span>{resume.basics.email}</span>
      </div>
    </header>
    {renderSections(resume, { compact: true })}
  </article>
);

export const TEMPLATE_REGISTRY: TemplatePlugin[] = [
  { id: 'classic', label: 'Classic', render: ClassicTemplate },
  { id: 'modern', label: 'Modern', render: ModernTemplate },
  { id: 'compact', label: 'Compact', render: CompactTemplate },
];

export const getTemplatePlugin = (template: TemplateType): TemplatePlugin => {
  const matched = TEMPLATE_REGISTRY.find((item) => item.id === template);
  return matched ?? TEMPLATE_REGISTRY[0];
};
