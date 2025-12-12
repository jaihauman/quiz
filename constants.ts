import { Topic } from './types';

export const TOPICS: Topic[] = [
  {
    id: 'level1_full',
    name: 'REET Level 1 (Common)',
    icon: 'GraduationCap',
    description: 'लेवल 1 के लिए सम्पूर्ण पाठ्यक्रम - राजस्थान GK, गणित, पर्यावरण, मनोविज्ञान।',
  },
  {
    id: 'l2_math',
    name: 'Level 2: Maths (गणित)',
    icon: 'Calculator',
    description: 'गणित विषय (Maths) - अंकगणित, बीजगणित, ज्यामिति और शिक्षण विधियां।',
  },
  {
    id: 'l2_science',
    name: 'Level 2: Science (विज्ञान)',
    icon: 'FlaskConical',
    description: 'विज्ञान विषय (Science) - भौतिकी, रसायन, जीव विज्ञान और शिक्षण विधियां।',
  },
  {
    id: 'l2_sst',
    name: 'Level 2: Social Studies',
    icon: 'Globe',
    description: 'सामाजिक अध्ययन (SST) - इतिहास, भूगोल, राजनीति विज्ञान।',
  },
  {
    id: 'l2_hindi',
    name: 'Level 2: Hindi (हिंदी)',
    icon: 'ScrollText',
    description: 'हिंदी विषय - व्याकरण, शिक्षण विधियां और साहित्य।',
  },
  {
    id: 'l2_english',
    name: 'Level 2: English',
    icon: 'BookOpen',
    description: 'English Subject - Grammar, Vocabulary, and Teaching Methods.',
  },
  {
    id: 'l2_sanskrit',
    name: 'Level 2: Sanskrit (संस्कृत)',
    icon: 'ScrollText',
    description: 'संस्कृत विषय - व्याकरण और शिक्षण विधियां।',
  },
  {
    id: 'raj_gk',
    name: 'Rajasthan GK Special',
    icon: 'Landmark',
    description: 'राजस्थान का भूगोल, इतिहास, कला-संस्कृति और राजस्थानी भाषा।',
  },
  {
    id: 'psychology_it',
    name: 'Psychology & IT',
    icon: 'BrainCircuit',
    description: 'शैक्षिक मनोविज्ञान, शिक्षण विधियां और सूचना तकनीकी (IT)।',
  },
];

export const DIFFICULTIES = ['आसान', 'मध्यम', 'कठिन', 'विशेषज्ञ'];
export const QUESTION_COUNTS = [10, 20, 30, 50];