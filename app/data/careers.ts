export type RecommendationTag = 'analytical' | 'creative' | 'hands_on' | 'social' | 'problem_solving';
export type CareerLevel = 'intro' | 'intermediate' | 'advanced';

export interface SalaryOutlook {
  entryLevel: string;
  experienced: string;
  outlook: string;
}

export interface Career {
  id: string;
  title: string;
  description: string;
  icon?: string;
  overview: string;
  level: CareerLevel;
  keySkills: string[];
  typicalTasks: string[];
  educationPath: string;
  salaryOutlook: SalaryOutlook;
  recommendationTags: RecommendationTag[];
}

export const careers: Career[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description:
      'Design and build applications that power the digital world. Solve complex problems through code and collaborate with teams to create innovative solutions.',
    overview:
      'Software engineers create the applications and systems that run modern businesses and power innovation. You\'ll spend your days solving complex problems, collaborating with teammates, and shipping code that impacts millions.',
    level: 'intro',
    keySkills: ['Problem solving', 'Coding', 'Collaboration', 'System design', 'Debugging'],
    typicalTasks: ['Write and review code', 'Debug applications', 'Attend code reviews', 'Collaborate on features', 'Test software'],
    educationPath: 'Computer Science degree or coding bootcamp',
    salaryOutlook: {
      entryLevel: '$120k - $150k',
      experienced: '$180k - $250k+',
      outlook: 'High demand across all industries',
    },
    recommendationTags: ['analytical', 'problem_solving', 'hands_on'],
  },
  {
    id: 'nurse',
    title: 'Nurse',
    description:
      'Provide compassionate care to patients and make a direct impact on peoples health and wellbeing. Work in diverse healthcare settings.',
    overview:
      'Nurses are the backbone of healthcare. You\'ll assess patients, administer treatments, advocate for patient needs, and work as part of a interdisciplinary medical team. Every day brings new challenges and the reward of helping people.',
    level: 'intermediate',
    keySkills: ['Patient care', 'Critical thinking', 'Communication', 'Compassion', 'Technical knowledge'],
    typicalTasks: ['Monitor patient vitals', 'Administer medications', 'Create care plans', 'Communicate with doctors', 'Document patient progress'],
    educationPath: 'RN or BSN program, NCLEX licensure, ongoing continuing education',
    salaryOutlook: {
      entryLevel: '$65k - $75k',
      experienced: '$85k - $110k',
      outlook: 'Very high demand, aging population increases need',
    },
    recommendationTags: ['social', 'hands_on', 'problem_solving'],
  },
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    description:
      'Create visual experiences that communicate ideas and inspire people. Design everything from logos to websites to marketing campaigns.',
    overview:
      'Graphic designers use creativity and technology to solve visual communication problems. You\'ll work with clients and teams to bring ideas to life, balancing artistic vision with business objectives.',
    level: 'intro',
    keySkills: ['Visual design', 'Creativity', 'Communication', 'Technical design software', 'Attention to detail'],
    typicalTasks: ['Design logos and branding', 'Create marketing materials', 'Design websites', 'Present concepts to clients', 'Iterate on feedback'],
    educationPath: 'Design degree, bootcamp, or self-taught portfolio approach',
    salaryOutlook: {
      entryLevel: '$40k - $55k',
      experienced: '$65k - $95k',
      outlook: 'Moderate demand, varies by industry and location',
    },
    recommendationTags: ['creative', 'social', 'hands_on'],
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description:
      'Uncover insights from data to drive business decisions. Analyze trends, build predictive models, and tell data stories that matter.',
    overview:
      'Data analysts are detectives of the modern world. You\'ll explore datasets, find patterns, and communicate insights that drive business strategy. Every decision is informed by evidence you uncover.',
    level: 'intermediate',
    keySkills: ['Statistical analysis', 'Data visualization', 'SQL', 'Critical thinking', 'Communication'],
    typicalTasks: ['Query databases', 'Create visualizations', 'Analyze trends', 'Present insights to leadership', 'Build dashboards'],
    educationPath: 'Statistics/Math degree, analytics bootcamp, or SQL/Python certifications',
    salaryOutlook: {
      entryLevel: '$55k - $70k',
      experienced: '$85k - $130k',
      outlook: 'Very high demand across all sectors',
    },
    recommendationTags: ['analytical', 'problem_solving', 'creative'],
  },
  {
    id: 'architect',
    title: 'Architect',
    description:
      'Design buildings and spaces that blend functionality with beauty. Shape the physical world and leave a lasting impact on communities.',
    overview:
      'Architects are visionaries who translate dreams into physical reality. You\'ll design buildings and spaces, manage complex projects, and work within technical, budget, and safety constraints.',
    level: 'advanced',
    keySkills: ['Design', 'Project management', 'Technical knowledge', 'Communication', 'Problem-solving'],
    typicalTasks: ['Design building concepts', 'Create technical drawings', 'Manage construction projects', 'Present designs to stakeholders', 'Ensure code compliance'],
    educationPath: 'Architecture degree (5+ years), internship, licensure exam (ALE), 3+ years apprenticeship',
    salaryOutlook: {
      entryLevel: '$50k - $70k',
      experienced: '$100k - $180k+',
      outlook: 'Moderate demand, varies with economic cycles',
    },
    recommendationTags: ['analytical', 'creative', 'problem_solving'],
  },
];
