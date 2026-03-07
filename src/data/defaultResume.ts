import { ResumeData } from '../types/resume';
import { createId } from '../utils/id';

export const createDefaultResume = (): ResumeData => ({
  basics: {
    name: '无名',
    role: '正能量建设工程师',
    email: 'wuming@easyresume.com',
    phone: '139-1234-5678',
    location: '杭州',
  },
  sections: [
    {
      id: createId(),
      type: 'summary',
      title: '个人简介',
      data: {
        content:
          '始终保持乐观向上的工作状态，擅长把复杂问题拆解为可执行目标，推动团队在积极氛围中持续交付高质量成果。',
      },
    },
    {
      id: createId(),
      type: 'work',
      title: '工作经历',
      data: {
        items: [
          {
            id: createId(),
            company: '阳光自信公司',
            title: '正能量建设工程师',
            period: '2023.03 - 至今',
            projects: [
              {
                id: createId(),
                name: '向上成长计划平台',
                department: '积极文化推进部',
                period: '2024.01 - 2025.06',
                description: '打造团队成长与激励平台，沉淀目标管理、复盘反馈和正向激励机制。',
                responsibilities:
                  '负责需求澄清与方案落地；推动跨团队协同；将关键流程产品化，持续提升执行效率与团队士气。',
              },
            ],
          },
        ],
      },
    },
    {
      id: createId(),
      type: 'education',
      title: '教育经历',
      data: {
        items: [
          {
            id: createId(),
            school: '向阳理工学院',
            major: '积极系统工程',
            period: '2015.09 - 2019.06',
          },
        ],
      },
    },
    {
      id: createId(),
      type: 'skills',
      title: '技能列表',
      data: {
        items: ['目标拆解', '团队协作', '持续改进', '沟通推进', '正向反馈机制建设'],
      },
    },
  ],
});
