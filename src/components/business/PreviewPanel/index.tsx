import { ResumeData, ThemeType, TemplateType } from '../../../types/resume';

interface PreviewPanelProps {
  resume: ResumeData;
  template: TemplateType;
  theme: ThemeType;
}

const PreviewPanel = ({ resume, template, theme }: PreviewPanelProps) => (
  <div className={`preview-shell template-${template} theme-${theme}`}>
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

      {resume.sections.map((section) => (
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
                    <strong>
                      {work.company} · {work.title}
                    </strong>
                    {work.projects.map((project) => (
                      <div key={project.id} className="project-item">
                        <h4>{project.name}</h4>
                        <p className="muted">{project.period}</p>
                        <p>{project.description}</p>
                        <p>{project.responsibilities}</p>
                      </div>
                    ))}
                  </div>
                  <span>{work.period}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </article>
  </div>
);

export default PreviewPanel;
