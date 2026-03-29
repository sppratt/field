export interface Career {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export const careers: Career[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description:
      'Design and build applications that power the digital world. Solve complex problems through code and collaborate with teams to create innovative solutions.',
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description:
      'Uncover insights from data to drive business decisions. Analyze trends, build predictive models, and tell data stories that matter.',
  },
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    description:
      'Create visual experiences that communicate ideas and inspire people. Design everything from logos to websites to marketing campaigns.',
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    description:
      'Lead the vision for products that solve real problems. Work across teams to define features, set strategy, and drive product success.',
  },
  {
    id: 'nurse',
    title: 'Nurse',
    description:
      'Provide compassionate care to patients and make a direct impact on peoples health and wellbeing. Work in diverse healthcare settings.',
  },
  {
    id: 'architect',
    title: 'Architect',
    description:
      'Design buildings and spaces that blend functionality with beauty. Shape the physical world and leave a lasting impact on communities.',
  },
  {
    id: 'marketing-specialist',
    title: 'Marketing Specialist',
    description:
      'Build brands and connect products with audiences. Use creativity and data to craft campaigns that resonate and drive growth.',
  },
  {
    id: 'environmental-scientist',
    title: 'Environmental Scientist',
    description:
      'Protect and improve our environment. Study ecosystems, research sustainability solutions, and advocate for a healthier planet.',
  },
];
