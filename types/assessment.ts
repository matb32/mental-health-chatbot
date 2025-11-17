// Response scale types
export type ASRSResponse = 0 | 1 | 2 | 3 | 4; // Never, Rarely, Sometimes, Often, Very Often
export type GAD7Response = 0 | 1 | 2 | 3; // Not at all, Several days, More than half the days, Nearly every day
export type PHQ9Response = 0 | 1 | 2 | 3; // Not at all, Several days, More than half the days, Nearly every day
export type DIVAResponse = 0 | 1 | 2; // No, Sometimes, Yes

// ASRS (Adult ADHD Self-Report Scale) - 18 questions
export interface ASRSAnswers {
  q1: ASRSResponse; // Trouble wrapping up details
  q2: ASRSResponse; // Difficulty getting things in order
  q3: ASRSResponse; // Problems remembering appointments
  q4: ASRSResponse; // Avoid tasks requiring sustained mental effort
  q5: ASRSResponse; // Fidget when sitting long
  q6: ASRSResponse; // Feel overly active/compelled to do things
  q7: ASRSResponse; // Make careless mistakes
  q8: ASRSResponse; // Difficulty keeping attention
  q9: ASRSResponse; // Difficulty concentrating
  q10: ASRSResponse; // Difficulty finding things
  q11: ASRSResponse; // Easily distracted
  q12: ASRSResponse; // Leave seat in meetings
  q13: ASRSResponse; // Feel restless or fidgety
  q14: ASRSResponse; // Difficulty unwinding
  q15: ASRSResponse; // Talk too much
  q16: ASRSResponse; // Finish others' sentences
  q17: ASRSResponse; // Difficulty waiting turn
  q18: ASRSResponse; // Interrupt others
}

// GAD-7 (Generalized Anxiety Disorder) - 7 questions
export interface GAD7Answers {
  q1: GAD7Response; // Feeling nervous, anxious, or on edge
  q2: GAD7Response; // Not being able to stop or control worrying
  q3: GAD7Response; // Worrying too much about different things
  q4: GAD7Response; // Trouble relaxing
  q5: GAD7Response; // Being so restless that it's hard to sit still
  q6: GAD7Response; // Becoming easily annoyed or irritable
  q7: GAD7Response; // Feeling afraid as if something awful might happen
}

// PHQ-9 (Patient Health Questionnaire) - 9 questions
export interface PHQ9Answers {
  q1: PHQ9Response; // Little interest or pleasure
  q2: PHQ9Response; // Feeling down, depressed, or hopeless
  q3: PHQ9Response; // Trouble falling/staying asleep, sleeping too much
  q4: PHQ9Response; // Feeling tired or having little energy
  q5: PHQ9Response; // Poor appetite or overeating
  q6: PHQ9Response; // Feeling bad about yourself
  q7: PHQ9Response; // Trouble concentrating
  q8: PHQ9Response; // Moving or speaking slowly/being fidgety
  q9: PHQ9Response; // Thoughts of self-harm
}

// DIVA (Diagnostic Interview for ADHD in adults)
// Part A: Childhood symptoms (before age 12)
export interface DIVAChildhoodInattention {
  q1: DIVAResponse; // Fails to give close attention to details
  q2: DIVAResponse; // Difficulty sustaining attention
  q3: DIVAResponse; // Does not seem to listen
  q4: DIVAResponse; // Does not follow through on instructions
  q5: DIVAResponse; // Difficulty organizing tasks
  q6: DIVAResponse; // Avoids tasks requiring sustained mental effort
  q7: DIVAResponse; // Loses things necessary for tasks
  q8: DIVAResponse; // Easily distracted by extraneous stimuli
  q9: DIVAResponse; // Forgetful in daily activities
}

export interface DIVAChildhoodHyperactivity {
  q1: DIVAResponse; // Fidgets with hands or feet
  q2: DIVAResponse; // Leaves seat in classroom
  q3: DIVAResponse; // Runs about or climbs excessively
  q4: DIVAResponse; // Difficulty playing quietly
  q5: DIVAResponse; // "On the go" or "driven by a motor"
  q6: DIVAResponse; // Talks excessively
  q7: DIVAResponse; // Blurts out answers
  q8: DIVAResponse; // Difficulty waiting turn
  q9: DIVAResponse; // Interrupts or intrudes on others
}

// Part B: Current symptoms (adulthood)
export interface DIVAAdultInattention {
  q1: DIVAResponse; // Careless mistakes in work
  q2: DIVAResponse; // Difficulty sustaining attention
  q3: DIVAResponse; // Does not seem to listen
  q4: DIVAResponse; // Does not follow through
  q5: DIVAResponse; // Difficulty organizing
  q6: DIVAResponse; // Avoids sustained mental effort
  q7: DIVAResponse; // Loses things
  q8: DIVAResponse; // Easily distracted
  q9: DIVAResponse; // Forgetful
}

export interface DIVAAdultHyperactivity {
  q1: DIVAResponse; // Fidgets with hands or feet
  q2: DIVAResponse; // Leaves seat when expected to remain
  q3: DIVAResponse; // Feels restless
  q4: DIVAResponse; // Difficulty with leisure activities
  q5: DIVAResponse; // "On the go" or "driven by a motor"
  q6: DIVAResponse; // Talks excessively
  q7: DIVAResponse; // Blurts out answers
  q8: DIVAResponse; // Difficulty waiting
  q9: DIVAResponse; // Interrupts or intrudes
}

export interface DIVAAnswers {
  childhoodInattention: DIVAChildhoodInattention;
  childhoodHyperactivity: DIVAChildhoodHyperactivity;
  adultInattention: DIVAAdultInattention;
  adultHyperactivity: DIVAAdultHyperactivity;
}

// Mental Health and Family History
export interface MentalHealthHistory {
  previousDiagnoses: string[];
  currentMedications: string;
  previousTreatments: string;
  substanceUse: {
    alcohol: 'none' | 'occasional' | 'regular' | 'heavy';
    tobacco: 'none' | 'occasional' | 'regular' | 'heavy';
    cannabis: 'none' | 'occasional' | 'regular' | 'heavy';
    other: string;
  };
  sleepPatterns: string;
  significantLifeEvents: string;
}

export interface FamilyHistory {
  adhdInFamily: boolean;
  adhdRelatives: string;
  anxietyInFamily: boolean;
  depressionInFamily: boolean;
  otherMentalHealthConditions: string;
}

// Personal Information
export interface PersonalInformation {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  gpName: string;
  gpPractice: string;
  gpAddress: string;
  nhsNumber?: string;
}

// Complete Assessment
export interface CompleteAssessment {
  personalInfo: PersonalInformation;
  asrs: ASRSAnswers;
  gad7: GAD7Answers;
  phq9: PHQ9Answers;
  diva: DIVAAnswers;
  mentalHealthHistory: MentalHealthHistory;
  familyHistory: FamilyHistory;
  completedDate: string;
}

// Scoring Results
export interface ASRSScore {
  partAScore: number; // First 6 questions
  partBScore: number; // Questions 7-18
  totalScore: number;
  interpretation: string;
  likelyADHD: boolean;
}

export interface GAD7Score {
  totalScore: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  interpretation: string;
}

export interface PHQ9Score {
  totalScore: number;
  severity: 'none' | 'mild' | 'moderate' | 'moderately-severe' | 'severe';
  interpretation: string;
  requiresUrgentAttention: boolean;
}

export interface DIVAScore {
  childhoodInattentionCount: number;
  childhoodHyperactivityCount: number;
  adultInattentionCount: number;
  adultHyperactivityCount: number;
  meetsDSMCriteria: boolean;
  predominantType: 'inattentive' | 'hyperactive-impulsive' | 'combined' | 'none';
  interpretation: string;
}

export interface AssessmentResults {
  asrs: ASRSScore;
  gad7: GAD7Score;
  phq9: PHQ9Score;
  diva: DIVAScore;
  overallRecommendation: string;
}
