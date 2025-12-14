// ASRS Part A - 6 screening questions only
export const asrsQuestions = [
  {
    id: 'q1',
    text: 'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?',
    category: 'inattention',
  },
  {
    id: 'q2',
    text: 'How often do you have difficulty getting things in order when you have to do a task that requires organization?',
    category: 'inattention',
  },
  {
    id: 'q3',
    text: 'How often do you have problems remembering appointments or obligations?',
    category: 'inattention',
  },
  {
    id: 'q4',
    text: 'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?',
    category: 'inattention',
  },
  {
    id: 'q5',
    text: 'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?',
    category: 'hyperactivity',
  },
  {
    id: 'q6',
    text: 'How often do you feel overly active and compelled to do things, like you were driven by a motor?',
    category: 'hyperactivity',
  },
];

export const asrsResponseOptions = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'Often' },
  { value: 4, label: 'Very Often' },
];
