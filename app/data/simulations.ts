import type { RecommendationTag } from './careers';

export interface TagEffects {
  analytical?: number;
  creative?: number;
  hands_on?: number;
  social?: number;
  problem_solving?: number;
}

export interface SimulationChoice {
  id: string;
  text: string;
  feedback: string;
  tagEffects?: TagEffects;
  nextStep: number | null;
}

export interface SimulationStep {
  id: string;
  stepNumber: number;
  scenario: string;
  question: string;
  choices: SimulationChoice[];
}

export interface Simulation {
  pathwayId: string;
  title: string;
  intro: string;
  steps: SimulationStep[];
  outcomeSummary: string;
  estimatedTime: number;
}

export const simulations: Record<string, Simulation> = {
  'software-engineer': {
    pathwayId: 'software-engineer',
    title: 'A Day as a Junior Software Engineer',
    intro:
      "You're starting your first day as a junior software engineer at a growing tech startup. Your first task is reviewing a peer's code before it ships to production. How do you approach this?",
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        scenario:
          'Your teammate Sarah just submitted code for a critical feature. Your manager asks you to review it before deployment. You notice a few potential issues but nothing blocking. Sarah is excited to ship and move on to the next task.',
        question: 'What do you do?',
        choices: [
          {
            id: 'choice-1a',
            text: 'Approve the code quickly to keep momentum going',
            feedback:
              'You approve the code and it ships. The feature works, but two weeks later a subtle bug emerges that takes 6 hours to fix. Lesson: Speed without quality has costs.',
            tagEffects: {
              problem_solving: 1,
              hands_on: 1,
            },
            nextStep: 2,
          },
          {
            id: 'choice-1b',
            text: 'Request revisions to improve code quality',
            feedback:
              'Sarah is slightly frustrated but appreciates the feedback. The revised code is cleaner and more maintainable. Your team ships a better product.',
            tagEffects: {
              analytical: 2,
              problem_solving: 1,
            },
            nextStep: 2,
          },
          {
            id: 'choice-1c',
            text: 'Ask a senior engineer for help with the review',
            feedback:
              'Great call! Your senior catches an edge case and uses it as a teaching moment. You learn something and the code is stronger for it.',
            tagEffects: {
              social: 2,
              analytical: 1,
            },
            nextStep: 2,
          },
        ],
      },
      {
        id: 'step-2',
        stepNumber: 2,
        scenario:
          'After the code review, your manager brings you into a team meeting. Two features are competing for your time this sprint: a fast feature that meets a key deadline, or a well-architected solution that will be easier to maintain long-term.',
        question: 'Which do you prioritize?',
        choices: [
          {
            id: 'choice-2a',
            text: 'Build the fast feature to hit the deadline',
            feedback:
              'You ship on time and the business is happy. But 3 months later, the technical debt makes adding new features painful.',
            tagEffects: {
              hands_on: 2,
            },
            nextStep: 3,
          },
          {
            id: 'choice-2b',
            text: 'Argue for the well-architected solution',
            feedback:
              'You push back and propose a timeline that allows for better design. Your manager respects the input and you build something that scales beautifully.',
            tagEffects: {
              analytical: 2,
              problem_solving: 2,
            },
            nextStep: 3,
          },
          {
            id: 'choice-2c',
            text: 'Suggest a compromise that balances both',
            feedback:
              'You propose an MVP with a refactoring plan. The team aligns on this approach and ships on time without major technical debt.',
            tagEffects: {
              social: 1,
              problem_solving: 1,
            },
            nextStep: 3,
          },
        ],
      },
      {
        id: 'step-3',
        stepNumber: 3,
        scenario:
          'Late Friday afternoon, a user reports a critical bug in production. The system is behaving erratically and no one is sure why. Your manager asks you to help debug it.',
        question: 'How do you approach this?',
        choices: [
          {
            id: 'choice-3a',
            text: 'Start trying random fixes to see what works',
            feedback:
              'You fix the bug through trial and error, but it takes 4 hours. You learn through experimentation but miss the opportunity to understand the root cause.',
            tagEffects: {
              hands_on: 3,
              problem_solving: 1,
            },
            nextStep: null,
          },
          {
            id: 'choice-3b',
            text: 'Systematically trace through the code and logs',
            feedback:
              'You methodically work through the problem, understand the root cause, and implement a clean fix. You document the issue so it never happens again.',
            tagEffects: {
              analytical: 3,
              problem_solving: 2,
            },
            nextStep: null,
          },
          {
            id: 'choice-3c',
            text: 'Call a senior engineer and pair with them on the fix',
            feedback:
              'You and your mentor debug together. You learn the debugging process and build trust. The fix is solid and you feel supported.',
            tagEffects: {
              social: 2,
              problem_solving: 1,
            },
            nextStep: null,
          },
        ],
      },
    ],
    outcomeSummary:
      'As a software engineer, your day revolves around solving problems—both technical and human. You balance shipping fast with building quality. Success depends on technical depth, collaboration, and knowing when to ask for help. Every decision has trade-offs, and learning to navigate them is part of the craft.',
    estimatedTime: 10,
  },

  nurse: {
    pathwayId: 'nurse',
    title: 'A Shift in the ICU',
    intro:
      "You're a nurse starting your shift in the Intensive Care Unit. You have 3 patients, and one of them is declining. Your charge nurse is busy, and you need to prioritize your actions. What's your first move?",
    steps: [
      {
        id: 'nurse-step-1',
        stepNumber: 1,
        scenario:
          'Patient A is stable but post-op and needs monitoring. Patient B is recovering well. Patient C is showing signs of distress—elevated heart rate, labored breathing. You have limited time.',
        question: 'What do you do first?',
        choices: [
          {
            id: 'nurse-choice-1a',
            text: 'Immediately assess Patient C',
            feedback:
              'You catch the early signs of a complication, alert the doctor, and interventions begin quickly. Patient C improves. Your quick action saved time.',
            tagEffects: {
              hands_on: 2,
              problem_solving: 2,
            },
            nextStep: 2,
          },
          {
            id: 'nurse-choice-1b',
            text: 'Get the charge nurse to help triage',
            feedback:
              'You alert the charge nurse who coordinates the response. Patient C gets the care needed, and you learn the importance of team communication.',
            tagEffects: {
              social: 2,
              problem_solving: 1,
            },
            nextStep: 2,
          },
          {
            id: 'nurse-choice-1c',
            text: 'Check vitals on all three systematically',
            feedback:
              'You follow protocol, but Patient C deteriorates before you finish rounds. The oversight costs time and you realize clinical judgment matters.',
            tagEffects: {
              analytical: 1,
              hands_on: 1,
            },
            nextStep: 2,
          },
        ],
      },
      {
        id: 'nurse-step-2',
        stepNumber: 2,
        scenario:
          'After stabilizing Patient C, a family member of Patient A comes to the desk upset. They feel their relative isn\'t getting enough attention and are questioning the care plan.',
        question: 'How do you respond?',
        choices: [
          {
            id: 'nurse-choice-2a',
            text: 'Explain the care plan thoroughly and listen to their concerns',
            feedback:
              'You spend 10 minutes addressing their worries. They feel heard and become an ally in the patient\'s care. Communication builds trust.',
            tagEffects: {
              social: 2,
              hands_on: 1,
            },
            nextStep: 3,
          },
          {
            id: 'nurse-choice-2b',
            text: 'Reassure them and continue with tasks',
            feedback:
              'You offer brief reassurance but move on quickly. The family remains anxious and calls the charge nurse later anyway.',
            tagEffects: {
              problem_solving: 1,
            },
            nextStep: 3,
          },
          {
            id: 'nurse-choice-2c',
            text: 'Ask the doctor to speak with the family',
            feedback:
              'You involve the physician, which is appropriate. But the family wishes they\'d talked to you first—the nurse they see every day.',
            tagEffects: {
              social: 1,
              analytical: 1,
            },
            nextStep: 3,
          },
        ],
      },
      {
        id: 'nurse-step-3',
        stepNumber: 3,
        scenario:
          'End of shift update: Patient C is stable, Patient A is recovering well, and Patient B is being discharged tomorrow. You\'ve managed medications, charted carefully, and supported three families through a stressful day.',
        question: 'How do you feel about your shift?',
        choices: [
          {
            id: 'nurse-choice-3a',
            text: 'Exhausted but fulfilled—you made a real difference',
            feedback:
              'This is the essence of nursing: you provided direct care, advocated for your patients, and navigated complex situations with compassion.',
            tagEffects: {
              social: 2,
              hands_on: 2,
            },
            nextStep: null,
          },
          {
            id: 'nurse-choice-3b',
            text: 'Overwhelmed by the pace and complexity',
            feedback:
              'You realize nursing is intense. But you also see why it\'s rewarding—every decision impacts someone\'s health and life.',
            tagEffects: {
              problem_solving: 2,
              hands_on: 1,
            },
            nextStep: null,
          },
          {
            id: 'nurse-choice-3c',
            text: 'Already planning tomorrow—what to do better',
            feedback:
              'You\'re reflective and growth-oriented. This mindset will make you a great nurse. Continuous learning and improvement define the profession.',
            tagEffects: {
              analytical: 2,
              problem_solving: 1,
            },
            nextStep: null,
          },
        ],
      },
    ],
    outcomeSummary:
      'Nursing is a dance between technical skill, emotional intelligence, and rapid decision-making. You care for the whole person—their medical needs, their fears, their family. The job is demanding but deeply meaningful. You\'re not just treating illness; you\'re advocating for people at their most vulnerable.',
    estimatedTime: 10,
  },

  'graphic-designer': {
    pathwayId: 'graphic-designer',
    title: 'Design Sprint with a New Client',
    intro:
      "You're a graphic designer working with a new client—a sustainable fashion startup. They want a logo and brand identity. You have one week. Your first meeting is today. What's your approach?",
    steps: [
      {
        id: 'designer-step-1',
        stepNumber: 1,
        scenario:
          'In the kickoff meeting, the client says they want their brand to feel "modern, sustainable, and trustworthy." They show you 5 competitor logos they like. They have a tight budget and aggressive timeline.',
        question: 'What do you do?',
        choices: [
          {
            id: 'designer-choice-1a',
            text: 'Start designing immediately based on the mood board',
            feedback:
              'You jump in and create designs quickly. But they don\'t align with the client\'s deeper values. Multiple rounds of revision waste time.',
            tagEffects: {
              hands_on: 2,
              creative: 1,
            },
            nextStep: 2,
          },
          {
            id: 'designer-choice-1b',
            text: 'Ask deeper questions about their brand values and target audience',
            feedback:
              'You uncover that their audience is eco-conscious millennials who value transparency. Your insights lead to stronger design concepts.',
            tagEffects: {
              social: 2,
              creative: 1,
            },
            nextStep: 2,
          },
          {
            id: 'designer-choice-1c',
            text: 'Propose a strategic design process before creating concepts',
            feedback:
              'You outline research, concept development, and refinement phases. The client respects the professionalism and commits to the timeline.',
            tagEffects: {
              analytical: 1,
              creative: 2,
            },
            nextStep: 2,
          },
        ],
      },
      {
        id: 'designer-step-2',
        stepNumber: 2,
        scenario:
          'You\'ve created 3 strong logo concepts. In the review, the client loves one direction but wants you to "make it pop more" and incorporate a leaf (sustainability symbol). But adding a leaf might clash with your minimalist concept.',
        question: 'How do you handle the feedback?',
        choices: [
          {
            id: 'designer-choice-2a',
            text: 'Add a leaf as requested, even though it\'s not your vision',
            feedback:
              'You compromise on design integrity. The logo works but feels less cohesive. You learn the cost of not advocating for your ideas.',
            tagEffects: {
              hands_on: 2,
              social: 1,
            },
            nextStep: 3,
          },
          {
            id: 'designer-choice-2b',
            text: 'Push back and explain why the minimalist direction is stronger',
            feedback:
              'You present your reasoning and show examples of how sustainability is implied through the design rather than literal symbols. The client agrees and trusts your expertise.',
            tagEffects: {
              creative: 2,
              social: 1,
            },
            nextStep: 3,
          },
          {
            id: 'designer-choice-2c',
            text: 'Propose a compromise that incorporates subtle leaf-inspired curves',
            feedback:
              'You find a middle ground that honors both the client\'s wish and your vision. Everyone feels heard and the logo is stronger for the evolution.',
            tagEffects: {
              creative: 2,
              problem_solving: 1,
            },
            nextStep: 3,
          },
        ],
      },
      {
        id: 'designer-step-3',
        stepNumber: 3,
        scenario:
          'The logo is approved! Now you\'re designing their website. You have beautiful imagery and typography to work with, but the client keeps asking for changes to colors "to make it more pop."',
        question: 'What do you do?',
        choices: [
          {
            id: 'designer-choice-3a',
            text: 'Keep adjusting colors until they say they\'re happy',
            feedback:
              'You make 7 revisions. The colors end up vibrant but clash with the sophisticated brand identity. You spend more hours than budgeted.',
            tagEffects: {
              hands_on: 3,
              creative: 1,
            },
            nextStep: null,
          },
          {
            id: 'designer-choice-3b',
            text: 'Educate the client on color theory and your design rationale',
            feedback:
              'You explain how the current palette supports their brand message and psychology. The client understands and approves the design.',
            tagEffects: {
              social: 2,
              creative: 2,
            },
            nextStep: null,
          },
          {
            id: 'designer-choice-3c',
            text: 'Create 2-3 strong color options and let them choose',
            feedback:
              'You provide options that all work within the brand guidelines. The client chooses confidently and feels involved in the process.',
            tagEffects: {
              creative: 2,
              problem_solving: 1,
            },
            nextStep: null,
          },
        ],
      },
    ],
    outcomeSummary:
      'Graphic design is the marriage of aesthetics and strategy. You solve visual problems, but you also educate clients and advocate for strong design. The job is collaborative—your job is to listen, create, and guide. The best designers balance creativity with communication.',
    estimatedTime: 10,
  },

  'data-analyst': {
    pathwayId: 'data-analyst',
    title: 'Uncovering Insights in a Data Lake',
    intro:
      "You're a data analyst at an e-commerce company. The CEO asks: \"Why are our customer acquisition costs rising?\" You have a week to find the answer. Where do you start?",
    steps: [
      {
        id: 'analyst-step-1',
        stepNumber: 1,
        scenario:
          'You have access to data on ad spend, impressions, clicks, conversions, and customer demographics. The dataset is large and somewhat messy. Your first step is understanding the question.',
        question: 'What do you do?',
        choices: [
          {
            id: 'analyst-choice-1a',
            text: 'Dive into the data and explore patterns',
            feedback:
              'You find interesting correlations but lack context. Your analysis shows correlations without causation. The CEO wants to know "why," not just "what."',
            tagEffects: {
              analytical: 2,
              hands_on: 1,
            },
            nextStep: 2,
          },
          {
            id: 'analyst-choice-1b',
            text: 'Ask the CEO clarifying questions first',
            feedback:
              'You learn they\'ve increased ad spend in new channels and the cost-per-acquisition differs by channel. This context guides your analysis toward actionable insights.',
            tagEffects: {
              social: 2,
              problem_solving: 1,
            },
            nextStep: 2,
          },
          {
            id: 'analyst-choice-1c',
            text: 'Build a hypothesis and test it with data',
            feedback:
              'You hypothesize that expanded ad channels have different CAC profiles. Your analysis confirms it. You move forward with validated direction.',
            tagEffects: {
              analytical: 2,
              problem_solving: 2,
            },
            nextStep: 2,
          },
        ],
      },
      {
        id: 'analyst-step-2',
        stepNumber: 2,
        scenario:
          'Your analysis reveals that CAC increased because of a new advertising channel (expensive but high-volume). Two recommendations: (A) Pull back on the channel, or (B) Optimize the channel because future LTV might justify it.',
        question: 'What do you recommend?',
        choices: [
          {
            id: 'analyst-choice-2a',
            text: 'Recommend pulling back immediately',
            feedback:
              'CAC improves short-term, but you miss potential long-term growth. Your boss wishes you\'d recommended waiting for LTV data.',
            tagEffects: {
              analytical: 2,
              hands_on: 1,
            },
            nextStep: 3,
          },
          {
            id: 'analyst-choice-2b',
            text: 'Present both options with their trade-offs',
            feedback:
              'You show the short-term cost and potential long-term value. Your boss appreciates the nuance and makes an informed decision. You look like a strategic partner.',
            tagEffects: {
              analytical: 3,
              problem_solving: 1,
            },
            nextStep: 3,
          },
          {
            id: 'analyst-choice-2c',
            text: 'Suggest A/B testing to gather more data',
            feedback:
              'You propose running the channel in a controlled way to measure LTV before scaling. This creative approach reduces risk and provides clarity.',
            tagEffects: {
              problem_solving: 2,
              creative: 1,
            },
            nextStep: 3,
          },
        ],
      },
      {
        id: 'analyst-step-3',
        stepNumber: 3,
        scenario:
          'Your analysis is complete and you need to present to the executive team. You have insights but need to communicate them clearly to people who don\'t read SQL.',
        question: 'How do you present?',
        choices: [
          {
            id: 'analyst-choice-3a',
            text: 'Walk them through your methodology and code',
            feedback:
              'You dive deep into the technical approach. Most of the room is lost after the first slide. Your insights are buried in methodology.',
            tagEffects: {
              analytical: 3,
              hands_on: 1,
            },
            nextStep: null,
          },
          {
            id: 'analyst-choice-3b',
            text: 'Start with the business question and visualize the findings',
            feedback:
              'You show clear charts, tell the story of what happened, and explain what it means for the business. The exec team acts on your recommendations.',
            tagEffects: {
              creative: 2,
              social: 1,
            },
            nextStep: null,
          },
          {
            id: 'analyst-choice-3c',
            text: 'Prepare a dashboard they can explore themselves',
            feedback:
              'You give them tools to dig deeper. They love the autonomy and keep asking more questions. You become indispensable.',
            tagEffects: {
              analytical: 2,
              problem_solving: 2,
            },
            nextStep: null,
          },
        ],
      },
    ],
    outcomeSummary:
      'Data analysis is about asking the right questions, finding answers in data, and translating those answers into action. Technical skill matters, but so does business acumen and communication. The best analysts bridge the gap between data and decision-makers.',
    estimatedTime: 10,
  },

  architect: {
    pathwayId: 'architect',
    title: 'Designing a Community Center',
    intro:
      "You're an architect designing a new community center for a mid-sized city. The client wants it to be accessible, beautiful, and sustainable. The budget is $25M. You're leading the design team. What's your first move?",
    steps: [
      {
        id: 'architect-step-1',
        stepNumber: 1,
        scenario:
          'During the design phase, your team proposes a modern, glass-heavy design that\'s visually stunning but might be too expensive and difficult to maintain. An alternative is a more traditional approach that\'s easier to build but less striking.',
        question: 'What do you do?',
        choices: [
          {
            id: 'architect-choice-1a',
            text: 'Go with the striking modern design',
            feedback:
              'The design is beautiful but budget overruns force you to cut essential community spaces. The building looks great but doesn\'t serve its purpose fully.',
            tagEffects: {
              creative: 2,
              hands_on: 1,
            },
            nextStep: 2,
          },
          {
            id: 'architect-choice-1b',
            text: 'Choose the safer, traditional approach',
            feedback:
              'You stay on budget and on schedule. But the design is forgettable. The community gets a functional building, not an iconic one.',
            tagEffects: {
              analytical: 2,
              problem_solving: 1,
            },
            nextStep: 2,
          },
          {
            id: 'architect-choice-1c',
            text: 'Propose a hybrid design that balances innovation with practicality',
            feedback:
              'You use modern design elements strategically—glass in the atrium, traditional materials elsewhere. On budget, visually distinctive, and functional.',
            tagEffects: {
              creative: 2,
              analytical: 2,
            },
            nextStep: 2,
          },
        ],
      },
      {
        id: 'architect-step-2',
        stepNumber: 2,
        scenario:
          'During permitting, the city raises a concern: the building doesn\'t comply with new accessibility standards that just passed. You have two options: redesign sections (expensive and delay) or work closely with the city to interpret the standards.',
        question: 'How do you handle this?',
        choices: [
          {
            id: 'architect-choice-2a',
            text: 'Comply with all new standards fully',
            feedback:
              'You rebuild parts of the design. Budget stretches. But the building becomes a model of accessibility—a legacy achievement.',
            tagEffects: {
              analytical: 2,
              hands_on: 2,
            },
            nextStep: 3,
          },
          {
            id: 'architect-choice-2b',
            text: 'Negotiate with the city for a variance',
            feedback:
              'You present a thoughtful argument and propose a timeline for future compliance upgrades. The city works with you. You stay on track.',
            tagEffects: {
              problem_solving: 2,
              social: 1,
            },
            nextStep: 3,
          },
          {
            id: 'architect-choice-2c',
            text: 'Bring in an accessibility consultant',
            feedback:
              'You collaborate with an expert who finds creative solutions. The design exceeds standards and serves all community members beautifully.',
            tagEffects: {
              social: 2,
              creative: 1,
            },
            nextStep: 3,
          },
        ],
      },
      {
        id: 'architect-step-3',
        stepNumber: 3,
        scenario:
          'Construction begins. Six months in, unforeseen site conditions (soil stability issues) require design adjustments. The general contractor asks how to proceed.',
        question: 'What do you do?',
        choices: [
          {
            id: 'architect-choice-3a',
            text: 'Make quick decisions to keep construction moving',
            feedback:
              'You stay adaptive and solve problems on the fly. But some decisions lack long-term thinking and lead to maintenance issues later.',
            tagEffects: {
              hands_on: 3,
              problem_solving: 1,
            },
            nextStep: null,
          },
          {
            id: 'architect-choice-3b',
            text: 'Pause and redesign the foundation system properly',
            feedback:
              'You take time to address the root cause. It delays slightly but ensures structural integrity. The building will last 100 years.',
            tagEffects: {
              analytical: 3,
              problem_solving: 2,
            },
            nextStep: null,
          },
          {
            id: 'architect-choice-3c',
            text: 'Collaborate with engineers and contractors to find solutions',
            feedback:
              'You lead a team discussion that combines structural expertise, practical constraints, and design vision. The solution is strong and collaborative.',
            tagEffects: {
              social: 2,
              problem_solving: 2,
            },
            nextStep: null,
          },
        ],
      },
    ],
    outcomeSummary:
      'Architecture is about more than aesthetics—it\'s about solving complex problems within constraints (budget, time, physics, regulations). You work across disciplines, make trade-offs, and create lasting impact. Every building tells a story and serves a community.',
    estimatedTime: 10,
  },
};
