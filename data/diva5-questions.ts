// DIVA 5.0 - Diagnostic Interview for ADHD in Adults
// Complete question set with examples

export interface DIVAQuestionData {
  id: string;
  text: string;
  examples: { id: string; text: string }[];
}

// Part 1: Symptoms of attention-deficit (DSM-5 criterion A1)
export const divaAttentionQuestions: DIVAQuestionData[] = [
  {
    id: 'q1',
    text: 'Do you often fail to give close attention to detail, or do you make careless mistakes in your work or during other activities?',
    examples: [
      { id: 'careless_mistakes', text: 'Makes careless mistakes' },
      { id: 'works_slowly', text: 'Works slowly to avoid mistakes' },
      { id: 'work_inaccurate', text: 'Work is inaccurate' },
      { id: 'not_read_instructions', text: 'Does not read instructions carefully' },
      { id: 'overlooks_details', text: 'Overlooks or misses details' },
      { id: 'too_much_time', text: 'Too much time needed to complete detailed tasks' },
      { id: 'bogged_down', text: 'Gets easily bogged down by details' },
      { id: 'works_too_quickly', text: 'Works too quickly and therefore makes mistakes' },
    ],
  },
  {
    id: 'q2',
    text: 'Do you often find it difficult to sustain your attention on tasks?',
    examples: [
      { id: 'not_keep_attention', text: 'Not able to keep attention on tasks for long' },
      { id: 'distracted_thoughts', text: 'Quickly distracted by own thoughts or associations' },
      { id: 'unrelated_thoughts', text: 'Easily distracted by unrelated thoughts' },
      { id: 'difficulty_focused', text: 'Difficulty remaining focused during lectures and/or conversations' },
      { id: 'watch_film', text: 'Finds it difficult to watch a film through to the end, or to read a book' },
      { id: 'quickly_bored', text: 'Quickly becomes bored with things' },
      { id: 'asks_questions', text: 'Asks questions about subjects that have already been discussed' },
    ],
  },
  {
    id: 'q3',
    text: 'Does it often seem as though you are not listening when you are spoken to directly?',
    examples: [
      { id: 'dreamy', text: 'Dreamy or preoccupied' },
      { id: 'difficulty_conversation', text: 'Difficulty concentrating on a conversation' },
      { id: 'not_knowing', text: 'Afterwards, not knowing what a conversation was about' },
      { id: 'changing_subject', text: 'Often changing the subject of the conversation' },
      { id: 'thoughts_elsewhere', text: 'Others saying that your thoughts are somewhere else' },
      { id: 'mind_elsewhere', text: 'Mind seems elsewhere, even in the absence of any obvious distraction' },
    ],
  },
  {
    id: 'q4',
    text: 'Do you often fail to follow through on instructions and do you often fail to finish jobs or fail to meet obligations at work?',
    examples: [
      { id: 'muddled_together', text: 'Does things that are muddled up together without completing them' },
      { id: 'loses_focus', text: 'Starts tasks but quickly loses focus and is easily side-tracked' },
      { id: 'needs_time_limit', text: 'Needing a time limit to complete tasks' },
      { id: 'difficulty_admin', text: 'Difficulty completing administrative tasks' },
      { id: 'difficulty_manual', text: 'Difficulty following instructions from a manual' },
    ],
  },
  {
    id: 'q5',
    text: 'Do you often find it difficult to organise tasks and activities?',
    examples: [
      { id: 'difficulty_planning', text: 'Difficulty with planning activities of daily life' },
      { id: 'difficulty_sequential', text: 'Difficulty managing sequential tasks' },
      { id: 'disorganised', text: 'House and/or workplace are disorganised' },
      { id: 'belongings_disorder', text: 'Difficulty keeping materials and belongings in order' },
      { id: 'work_messy', text: 'Work is messy and disorganised' },
      { id: 'planning_many', text: 'Planning too many tasks or non-efficient planning' },
      { id: 'double_booking', text: 'Regularly booking things to take place at the same time - double booking' },
      { id: 'arriving_late', text: 'Arriving late' },
      { id: 'miss_deadlines', text: 'Fails to meet deadlines' },
      { id: 'not_use_agenda', text: 'Not able to use an agenda or diary consistently' },
      { id: 'inflexible', text: 'Inflexible because of the need to keep to schedules' },
      { id: 'poor_time_sense', text: 'Poor sense and management of time' },
      { id: 'schedules_not_using', text: 'Creating schedules but not using them' },
      { id: 'needs_others_structure', text: 'Needing other people to structure things' },
    ],
  },
  {
    id: 'q6',
    text: 'Do you often avoid (or do you have an aversion to, or are you unwilling to do) tasks which require sustained mental effort?',
    examples: [
      { id: 'easiest_first', text: 'Do the easiest or nicest things first of all' },
      { id: 'postpone_boring', text: 'Often postpone boring or difficult tasks' },
      { id: 'postpone_deadlines', text: 'Postpone tasks so that deadlines are missed' },
      { id: 'avoid_monotonous', text: 'Avoid monotonous work, such as administration' },
      { id: 'avoids_reports', text: 'Avoids preparing reports, completing forms, or reviewing lengthy papers' },
      { id: 'not_like_reading', text: 'Do not like reading due to mental effort' },
      { id: 'avoidance_concentration', text: 'Avoidance of tasks that require a lot of concentration' },
    ],
  },
  {
    id: 'q7',
    text: 'Do you often lose things that are needed for tasks or activities?',
    examples: [
      { id: 'mislays_tools', text: 'Mislays tools, paperwork, eyeglasses, mobile telephones, wallet, keys, or agenda' },
      { id: 'leaves_behind', text: 'Often leaves things behind' },
      { id: 'loses_papers', text: 'Loses papers for work' },
      { id: 'time_searching', text: 'Loses a lot of time searching for things' },
      { id: 'panic_moved', text: 'Gets in a panic if other people move things around' },
      { id: 'wrong_place', text: 'Stores things away in the wrong place' },
      { id: 'loses_notes', text: 'Loses notes, lists or telephone numbers' },
    ],
  },
  {
    id: 'q8',
    text: 'Are you often easily distracted by external stimuli?',
    examples: [
      { id: 'difficulty_shutting_off', text: 'Difficulty shutting off from external stimuli' },
      { id: 'difficult_pick_up', text: 'After being distracted, difficult to pick up the thread again' },
      { id: 'distracted_noises', text: 'Easily distracted by noises or events' },
      { id: 'distracted_conversations', text: 'Easily distracted by the conversations of others' },
      { id: 'difficulty_filtering', text: 'Difficulty in filtering and/or selecting information' },
    ],
  },
  {
    id: 'q9',
    text: 'Are you often forgetful during daily activities?',
    examples: [
      { id: 'forgets_appointments', text: 'Forgets appointments or other obligations' },
      { id: 'forgets_keys', text: 'Forgets keys, agenda etc.' },
      { id: 'needs_reminders', text: 'Needs frequent reminders for appointments' },
      { id: 'forgets_bills', text: 'Forgets to pay bills or to return calls' },
      { id: 'returning_home', text: 'Returning home to fetch forgotten things' },
      { id: 'rigid_lists', text: 'Rigid use of lists to make sure things aren\'t forgotten' },
      { id: 'forgets_look_agenda', text: 'Forgets to keep or look at daily agenda' },
      { id: 'forgets_chores', text: 'Forgets to do chores or run errands' },
    ],
  },
];

// Part 2: Symptoms of hyperactivity-impulsivity (DSM-5 criterion A2)
export const divaHyperactivityImpulsivityQuestions: DIVAQuestionData[] = [
  {
    id: 'q1',
    text: 'Do you often move your hands or feet in a restless manner, or do you often fidget in your chair?',
    examples: [
      { id: 'difficulty_sitting', text: 'Difficulty sitting still' },
      { id: 'fidgets_legs', text: 'Fidgets with the legs' },
      { id: 'tapping_pen', text: 'Tapping with a pen or playing with something' },
      { id: 'fiddling_hair', text: 'Fiddling with hair or biting nails' },
      { id: 'control_restlessness', text: 'Able to control restlessness, but feels stressed as a result' },
    ],
  },
  {
    id: 'q2',
    text: 'Do you often stand up in situations where the expectation is that you should remain in your seat?',
    examples: [
      { id: 'leaves_place', text: 'Often leaves their place in the office or workspace' },
      { id: 'avoids_symposiums', text: 'Avoids symposiums, lectures, church etc.' },
      { id: 'prefers_walk', text: 'Prefers to walk around rather than sit' },
      { id: 'never_sits_still', text: 'Never sits still for long, always moving around' },
      { id: 'stressed_sitting', text: 'Stressed owing to the difficulty of sitting still' },
      { id: 'makes_excuses', text: 'Makes excuses in order to be able to walk around' },
    ],
  },
  {
    id: 'q3',
    text: 'Do you often feel restless?',
    examples: [
      { id: 'feeling_restless', text: 'Feeling restless or agitated inside' },
      { id: 'constantly_doing', text: 'Constantly having the feeling that you have to be doing something' },
      { id: 'hard_to_relax', text: 'Finding it hard to relax' },
    ],
  },
  {
    id: 'q4',
    text: 'Do you often find it difficult to engage in leisure activities quietly?',
    examples: [
      { id: 'talks_during', text: 'Talks during activities when this is not appropriate' },
      { id: 'too_cocky', text: 'Becoming quickly too cocky in public' },
      { id: 'loud_situations', text: 'Being loud in all kinds of situations' },
      { id: 'difficulty_quietly', text: 'Difficulty doing activities quietly' },
      { id: 'difficulty_softly', text: 'Difficulty in speaking softly' },
    ],
  },
  {
    id: 'q5',
    text: 'Are you often on the go or do you often act as if "driven by a motor"?',
    examples: [
      { id: 'always_busy', text: 'Always busy doing something' },
      { id: 'uncomfortable_still', text: 'Is uncomfortable being still for extended periods e.g. in restaurants or meetings' },
      { id: 'too_much_energy', text: 'Has too much energy, always on the move' },
      { id: 'difficult_keep_up', text: 'Others find you restless or difficult to keep up with' },
      { id: 'stepping_boundaries', text: 'Stepping over own boundaries' },
      { id: 'excessively_driven', text: 'Finds it difficult to let things go, excessively driven' },
    ],
  },
  {
    id: 'q6',
    text: 'Do you often talk excessively?',
    examples: [
      { id: 'busy_talking', text: 'So busy talking that other people find it tiring' },
      { id: 'incessant_talker', text: 'Known to be an incessant talker' },
      { id: 'difficult_stop', text: 'Finds it difficult to stop talking' },
      { id: 'tendency_talk', text: 'Tendency to talk too much' },
      { id: 'not_giving_room', text: 'Not giving others room to interject during a conversation' },
      { id: 'lot_of_words', text: 'Needing a lot of words to say something' },
    ],
  },
  {
    id: 'q7',
    text: 'Do you often give the answer before questions have been completed?',
    examples: [
      { id: 'blabbermouth', text: 'Being a blabbermouth, saying what you think' },
      { id: 'saying_without_thinking', text: 'Saying things without thinking first' },
      { id: 'answers_before_finished', text: 'Giving people answers before they have finished speaking' },
      { id: 'completing_words', text: 'Completing other people\'s words' },
      { id: 'being_tactless', text: 'Being tactless' },
    ],
  },
  {
    id: 'q8',
    text: 'Do you often find it difficult to await your turn?',
    examples: [
      { id: 'difficulty_queue', text: 'Difficulty waiting in a queue, jumping the queue' },
      { id: 'difficulty_traffic', text: 'Difficulty in patiently waiting in the traffic/traffic jams' },
      { id: 'being_impatient', text: 'Being impatient' },
      { id: 'quickly_starting', text: 'Quickly starting relationships/jobs, or ending/leaving these because of impatience' },
    ],
  },
  {
    id: 'q9',
    text: 'Do you often interrupt the activities of others, or intrude on others?',
    examples: [
      { id: 'quick_interfere', text: 'Being quick to interfere with others' },
      { id: 'intrudes', text: 'Intrudes on others' },
      { id: 'disturbs_activities', text: 'Disturbs other people\'s activities without being asked, or takes over their tasks' },
      { id: 'comments_interference', text: 'Comments from others about interference' },
      { id: 'difficulty_boundaries', text: 'Difficulty respecting the boundaries of others' },
      { id: 'opinion_everything', text: 'Having an opinion about everything and immediately expressing this' },
    ],
  },
];

// Supplement questions
export const divaSupplementQuestions = {
  adult: 'Do you have more of these symptoms than other people, or do you experience these more frequently than other people of your age?',
  childhood: 'Did you have more of these symptoms than other children of your age, or did you experience these more frequently than other children of your age?',
};

// Criterion B
export const divaCriterionB = {
  question: 'Have you always had these symptoms of attention deficit and/or hyperactivity/impulsivity?',
  followUp: 'If \'no\', from what age?',
};

// Criterion C - Impairment areas
export const divaCriterionC = {
  workEducation: {
    title: 'Work/education',
    question: 'In which areas do you have / have you had problems with these symptoms?',
    examples: [
      { id: 'not_complete_education', text: 'Did not complete education/training needed for work' },
      { id: 'work_below_level', text: 'Work below level of education' },
      { id: 'tire_workplace', text: 'Tire quickly of a workplace' },
      { id: 'many_short_jobs', text: 'Pattern of many short-lasting jobs' },
      { id: 'difficulty_admin', text: 'Difficulty with administrative work/planning' },
      { id: 'not_achieving_promotions', text: 'Not achieving promotions' },
      { id: 'under_performing', text: 'Under-performing at work' },
      { id: 'left_work', text: 'Left work following arguments or dismissal' },
      { id: 'sickness_benefits', text: 'Sickness benefits/disability benefit as a result of symptoms' },
      { id: 'limited_iq', text: 'Limited impairment through compensation of high IQ' },
      { id: 'limited_structure', text: 'Limited impairment through compensation of external structure' },
    ],
  },
  relationship: {
    title: 'Relationship and/or family',
    question: '',
    examples: [
      { id: 'tire_relationships', text: 'Tire quickly of relationships' },
      { id: 'impulsively_commencing', text: 'Impulsively commencing/ending relationships' },
      { id: 'unequal_partner', text: 'Unequal partner relationship owing to symptoms' },
      { id: 'relationship_problems', text: 'Relationship problems, lots of arguments, lack of intimacy' },
      { id: 'divorced', text: 'Divorced owing to symptoms' },
      { id: 'problems_sexuality', text: 'Problems with sexuality as a result of symptoms' },
      { id: 'problems_upbringing', text: 'Problems with upbringing as a result of symptoms' },
      { id: 'difficulty_housekeeping', text: 'Difficulty with housekeeping and/or administration' },
      { id: 'financial_problems', text: 'Financial problems or gambling' },
      { id: 'not_daring_relationship', text: 'Not daring to start a relationship' },
    ],
  },
  socialContacts: {
    title: 'Social contacts',
    question: '',
    examples: [
      { id: 'unable_relax', text: 'Unable to relax properly during free time' },
      { id: 'lots_sports', text: 'Having to play lots of sports in order to relax' },
      { id: 'injuries_sport', text: 'Injuries as a result of excessive sport' },
      { id: 'unable_finish_book', text: 'Unable to finish a book or watch a film all the way through' },
      { id: 'continually_busy', text: 'Being continually busy and therefore becoming overtired' },
      { id: 'tire_hobbies', text: 'Tire quickly of hobbies' },
      { id: 'accidents_driving', text: 'Accidents/loss of driving licence as a result of reckless driving behaviour' },
      { id: 'sensation_seeking', text: 'Sensation seeking and/or taking too many risks' },
      { id: 'contact_police', text: 'Contact with the police/the courts' },
      { id: 'binge_eating', text: 'Binge eating' },
    ],
  },
  selfConfidence: {
    title: 'Self-confidence / self-image',
    question: '',
    examples: [
      { id: 'uncertainty', text: 'Uncertainty through negative comments of others' },
      { id: 'negative_self_image', text: 'Negative self-image due to experiences of failure' },
      { id: 'fear_failure', text: 'Fear of failure in terms of starting new things' },
      { id: 'excessive_reaction', text: 'Excessive intense reaction to criticism' },
      { id: 'perfectionism', text: 'Perfectionism' },
      { id: 'distressed_symptoms', text: 'Distressed by the symptoms of ADHD' },
      { id: 'lots_sports_relax', text: 'Having to play lots of sports in order to relax' },
    ],
  },
};
