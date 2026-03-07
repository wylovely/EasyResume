import { ResumeData } from '../types/resume';
import { createId } from '../utils/id';

export const createDefaultResume = (): ResumeData => ({
  basics: {
    name: '张三',
    role: '前端工程师',
    email: 'zhangsan@example.com',
    phone: '138-0000-0000',
    location: '上海',
  },
  sections: [
    {
      id: createId(),
      type: 'summary',
      title: '个人简介',
      data: {
        content: '5年前端经验，擅长 React + TypeScript，关注组件抽象与工程效率。',
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
            company: '某科技公司',
            title: '高级前端工程师',
            period: '2022.01 - 至今',
            projects: [
              {
                id: createId(),
                name: '简历系统重构',
                department: '平台研发部',
                period: '2025.03 - 2025.08',
                description: '搭建可配置简历模板系统，支持多主题与打印导出。',
                responsibilities: '负责数据建模、编辑器开发与打印样式优化。',
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
            school: '某某大学',
            major: '计算机科学与技术',
            period: '2014.09 - 2018.06',
          },
        ],
      },
    },
    {
      id: createId(),
      type: 'skills',
      title: '技能列表',
      data: {
        items: ['TypeScript', 'React', 'Vite', 'Node.js'],
      },
    },
  ],
});
