import Panel from '../../common/Panel';
import Field from '../../common/Field';
import {
  EducationExperience,
  ResumeData,
  ResumeSection,
  SectionType,
  WorkExperience,
} from '../../../types/resume';
import { createId } from '../../../utils/id';

interface EditorPanelProps {
  value: ResumeData;
  onChange: (next: ResumeData) => void;
}

const newSectionFactory = (type: SectionType): ResumeSection => {
  switch (type) {
    case 'summary':
      return { id: createId(), type, title: '个人简介', data: { content: '' } };
    case 'work':
      return {
        id: createId(),
        type,
        title: '工作经历',
        data: { items: [{ id: createId(), company: '', title: '', period: '', projects: [] }] },
      };
    case 'education':
      return {
        id: createId(),
        type,
        title: '教育经历',
        data: { items: [{ id: createId(), school: '', major: '', period: '' }] },
      };
    case 'skills':
      return { id: createId(), type, title: '技能列表', data: { items: [''] } };
    default:
      return { id: createId(), type: 'summary', title: '个人简介', data: { content: '' } };
  }
};

const EditorPanel = ({ value, onChange }: EditorPanelProps) => {
  const updateBasics = (key: keyof ResumeData['basics'], v: string) => {
    onChange({ ...value, basics: { ...value.basics, [key]: v } });
  };

  const updateSection = (sectionId: string, updater: (section: ResumeSection) => ResumeSection) => {
    onChange({
      ...value,
      sections: value.sections.map((section) => (section.id === sectionId ? updater(section) : section)),
    });
  };

  const addSection = (type: SectionType) => {
    onChange({ ...value, sections: [...value.sections, newSectionFactory(type)] });
  };

  const removeSection = (sectionId: string) => {
    onChange({ ...value, sections: value.sections.filter((section) => section.id !== sectionId) });
  };

  const addWork = (sectionId: string) => {
    updateSection(sectionId, (section) => {
      if (section.type !== 'work') return section;
      return {
        ...section,
        data: {
          items: [
            ...section.data.items,
            { id: createId(), company: '', title: '', period: '', projects: [] } satisfies WorkExperience,
          ],
        },
      };
    });
  };

  const addEducation = (sectionId: string) => {
    updateSection(sectionId, (section) => {
      if (section.type !== 'education') return section;
      return {
        ...section,
        data: {
          items: [...section.data.items, { id: createId(), school: '', major: '', period: '' } satisfies EducationExperience],
        },
      };
    });
  };

  const addProject = (sectionId: string, workId: string) => {
    updateSection(sectionId, (section) => {
      if (section.type !== 'work') return section;
      return {
        ...section,
        data: {
          items: section.data.items.map((work) =>
            work.id === workId
              ? {
                  ...work,
                  projects: [
                    ...work.projects,
                    { id: createId(), name: '', period: '', description: '', responsibilities: '' },
                  ],
                }
              : work
          ),
        },
      };
    });
  };

  return (
    <div className="editor">
      <Panel title="基础信息">
        <Field label="姓名" value={value.basics.name} onChange={(v) => updateBasics('name', v)} />
        <Field label="职位" value={value.basics.role} onChange={(v) => updateBasics('role', v)} />
        <Field label="邮箱" value={value.basics.email} onChange={(v) => updateBasics('email', v)} />
        <Field label="电话" value={value.basics.phone} onChange={(v) => updateBasics('phone', v)} />
        <Field label="地点" value={value.basics.location} onChange={(v) => updateBasics('location', v)} />
      </Panel>

      <Panel
        title="新增模块"
        extra={
          <div className="row-actions">
            <button type="button" onClick={() => addSection('summary')}>
              + 简介
            </button>
            <button type="button" onClick={() => addSection('work')}>
              + 工作
            </button>
            <button type="button" onClick={() => addSection('education')}>
              + 教育
            </button>
            <button type="button" onClick={() => addSection('skills')}>
              + 技能
            </button>
          </div>
        }
      >
        <p className="tip">每个模块都可以添加、删除，所有数据会同步到右侧 JSON。</p>
      </Panel>

      {value.sections.map((section) => (
        <Panel
          key={section.id}
          title={section.title}
          extra={
            <button type="button" className="danger" onClick={() => removeSection(section.id)}>
              删除模块
            </button>
          }
        >
          <Field
            label="模块标题"
            value={section.title}
            onChange={(v) => updateSection(section.id, (current) => ({ ...current, title: v }))}
          />

          {section.type === 'summary' && (
            <Field
              label="简介内容"
              multiline
              value={section.data.content}
              onChange={(v) =>
                updateSection(section.id, (current) => {
                  if (current.type !== 'summary') return current;
                  return { ...current, data: { content: v } };
                })
              }
            />
          )}

          {section.type === 'skills' && (
            <div className="stack">
              {section.data.items.map((skill, index) => (
                <div className="line" key={`${section.id}-skill-${index}`}>
                  <Field
                    label={`技能 ${index + 1}`}
                    value={skill}
                    onChange={(v) =>
                      updateSection(section.id, (current) => {
                        if (current.type !== 'skills') return current;
                        const items = [...current.data.items];
                        items[index] = v;
                        return { ...current, data: { items } };
                      })
                    }
                  />
                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      updateSection(section.id, (current) => {
                        if (current.type !== 'skills') return current;
                        return {
                          ...current,
                          data: { items: current.data.items.filter((_, idx) => idx !== index) },
                        };
                      })
                    }
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  updateSection(section.id, (current) => {
                    if (current.type !== 'skills') return current;
                    return { ...current, data: { items: [...current.data.items, ''] } };
                  })
                }
              >
                + 添加技能
              </button>
            </div>
          )}

          {section.type === 'education' && (
            <div className="stack">
              {section.data.items.map((edu) => (
                <div className="group" key={edu.id}>
                  <div className="row-actions">
                    <strong>教育项</strong>
                    <button
                      type="button"
                      className="danger"
                      onClick={() =>
                        updateSection(section.id, (current) => {
                          if (current.type !== 'education') return current;
                          return { ...current, data: { items: current.data.items.filter((item) => item.id !== edu.id) } };
                        })
                      }
                    >
                      删除
                    </button>
                  </div>
                  <Field
                    label="学校"
                    value={edu.school}
                    onChange={(v) =>
                      updateSection(section.id, (current) => {
                        if (current.type !== 'education') return current;
                        return {
                          ...current,
                          data: {
                            items: current.data.items.map((item) => (item.id === edu.id ? { ...item, school: v } : item)),
                          },
                        };
                      })
                    }
                  />
                  <Field
                    label="专业"
                    value={edu.major}
                    onChange={(v) =>
                      updateSection(section.id, (current) => {
                        if (current.type !== 'education') return current;
                        return {
                          ...current,
                          data: {
                            items: current.data.items.map((item) => (item.id === edu.id ? { ...item, major: v } : item)),
                          },
                        };
                      })
                    }
                  />
                  <Field
                    label="时间"
                    value={edu.period}
                    onChange={(v) =>
                      updateSection(section.id, (current) => {
                        if (current.type !== 'education') return current;
                        return {
                          ...current,
                          data: {
                            items: current.data.items.map((item) => (item.id === edu.id ? { ...item, period: v } : item)),
                          },
                        };
                      })
                    }
                  />
                </div>
              ))}
              <button type="button" onClick={() => addEducation(section.id)}>
                + 添加教育项
              </button>
            </div>
          )}

          {section.type === 'work' && (
            <div className="stack">
              {section.data.items.map((work) => (
                <div className="group" key={work.id}>
                  <div className="row-actions">
                    <strong>工作项</strong>
                    <button
                      type="button"
                      className="danger"
                      onClick={() =>
                        updateSection(section.id, (current) => {
                          if (current.type !== 'work') return current;
                          return { ...current, data: { items: current.data.items.filter((item) => item.id !== work.id) } };
                        })
                      }
                    >
                      删除
                    </button>
                  </div>

                  <Field
                    label="公司"
                    value={work.company}
                    onChange={(v) =>
                      updateSection(section.id, (current) => {
                        if (current.type !== 'work') return current;
                        return {
                          ...current,
                          data: {
                            items: current.data.items.map((item) => (item.id === work.id ? { ...item, company: v } : item)),
                          },
                        };
                      })
                    }
                  />
                  <Field
                    label="职位"
                    value={work.title}
                    onChange={(v) =>
                      updateSection(section.id, (current) => {
                        if (current.type !== 'work') return current;
                        return {
                          ...current,
                          data: {
                            items: current.data.items.map((item) => (item.id === work.id ? { ...item, title: v } : item)),
                          },
                        };
                      })
                    }
                  />
                  <Field
                    label="时间"
                    value={work.period}
                    onChange={(v) =>
                      updateSection(section.id, (current) => {
                        if (current.type !== 'work') return current;
                        return {
                          ...current,
                          data: {
                            items: current.data.items.map((item) => (item.id === work.id ? { ...item, period: v } : item)),
                          },
                        };
                      })
                    }
                  />

                  {work.projects.map((project) => (
                    <div key={project.id} className="sub-group">
                      <div className="row-actions">
                        <span>项目</span>
                        <button
                          type="button"
                          className="danger"
                          onClick={() =>
                            updateSection(section.id, (current) => {
                              if (current.type !== 'work') return current;
                              return {
                                ...current,
                                data: {
                                  items: current.data.items.map((item) =>
                                    item.id === work.id
                                      ? {
                                          ...item,
                                          projects: item.projects.filter((proj) => proj.id !== project.id),
                                        }
                                      : item
                                  ),
                                },
                              };
                            })
                          }
                        >
                          删除项目
                        </button>
                      </div>
                      <Field
                        label="项目名称"
                        value={project.name}
                        onChange={(v) =>
                          updateSection(section.id, (current) => {
                            if (current.type !== 'work') return current;
                            return {
                              ...current,
                              data: {
                                items: current.data.items.map((item) =>
                                  item.id === work.id
                                    ? {
                                        ...item,
                                        projects: item.projects.map((proj) =>
                                          proj.id === project.id ? { ...proj, name: v } : proj
                                        ),
                                      }
                                    : item
                                ),
                              },
                            };
                          })
                        }
                      />
                      <Field
                        label="项目时间"
                        value={project.period}
                        onChange={(v) =>
                          updateSection(section.id, (current) => {
                            if (current.type !== 'work') return current;
                            return {
                              ...current,
                              data: {
                                items: current.data.items.map((item) =>
                                  item.id === work.id
                                    ? {
                                        ...item,
                                        projects: item.projects.map((proj) =>
                                          proj.id === project.id ? { ...proj, period: v } : proj
                                        ),
                                      }
                                    : item
                                ),
                              },
                            };
                          })
                        }
                      />
                      <Field
                        label="项目描述"
                        multiline
                        value={project.description}
                        onChange={(v) =>
                          updateSection(section.id, (current) => {
                            if (current.type !== 'work') return current;
                            return {
                              ...current,
                              data: {
                                items: current.data.items.map((item) =>
                                  item.id === work.id
                                    ? {
                                        ...item,
                                        projects: item.projects.map((proj) =>
                                          proj.id === project.id ? { ...proj, description: v } : proj
                                        ),
                                      }
                                    : item
                                ),
                              },
                            };
                          })
                        }
                      />
                      <Field
                        label="工作职责"
                        multiline
                        value={project.responsibilities}
                        onChange={(v) =>
                          updateSection(section.id, (current) => {
                            if (current.type !== 'work') return current;
                            return {
                              ...current,
                              data: {
                                items: current.data.items.map((item) =>
                                  item.id === work.id
                                    ? {
                                        ...item,
                                        projects: item.projects.map((proj) =>
                                          proj.id === project.id ? { ...proj, responsibilities: v } : proj
                                        ),
                                      }
                                    : item
                                ),
                              },
                            };
                          })
                        }
                      />
                    </div>
                  ))}
                  <button type="button" onClick={() => addProject(section.id, work.id)}>
                    + 添加项目
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addWork(section.id)}>
                + 添加工作项
              </button>
            </div>
          )}
        </Panel>
      ))}

      <Panel title="简历 JSON 数据（只读）">
        <pre className="json-view">{JSON.stringify(value, null, 2)}</pre>
      </Panel>
    </div>
  );
};

export default EditorPanel;
