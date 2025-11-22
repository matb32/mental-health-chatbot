// Response scale types
export type ASRSResponse = 0 | 1 | 2 | 3 | 4; // Never, Rarely, Sometimes, Often, Very Often
export type GAD7Response = 0 | 1 | 2 | 3; // Not at all, Several days, More than half the days, Nearly every day
export type PHQ9Response = 0 | 1 | 2 | 3; // Not at all, Several days, More than half the days, Nearly every day
export type DIVAResponse = boolean; // Yes or No

// ASRS (Adult ADHD Self-Report Scale) - Part A only (6 questions)
export interface ASRSAnswers {
  q1: ASRSResponse; // Trouble wrapping up details
  q2: ASRSResponse; // Difficulty getting things in order
  q3: ASRSResponse; // Problems remembering appointments
  q4: ASRSResponse; // Avoid tasks requiring sustained mental effort
  q5: ASRSResponse; // Fidget when sitting long
  q6: ASRSResponse; // Feel overly active/compelled to do things
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
// Simplified: Adult questions with childhood follow-up
export interface DIVAQuestion {
  adult: DIVAResponse; // Yes/No for current symptoms
  child: DIVAResponse; // Yes/No for childhood symptoms (aged 5-12)
}

export interface DIVAAttention {
  q1: DIVAQuestion; // Fails to give close attention to details
  q2: DIVAQuestion; // Difficulty sustaining attention
  q3: DIVAQuestion; // Does not seem to listen
  q4: DIVAQuestion; // Does not follow through on instructions
  q5: DIVAQuestion; // Difficulty organizing tasks
  q6: DIVAQuestion; // Avoids tasks requiring sustained mental effort
  q7: DIVAQuestion; // Loses things necessary for tasks
  q8: DIVAQuestion; // Easily distracted
  q9: DIVAQuestion; // Forgetful in daily activities
}

export interface DIVAHyperactivity {
  q1: DIVAQuestion; // Fidgets with hands or feet
  q2: DIVAQuestion; // Leaves seat when expected to remain
  q3: DIVAQuestion; // Feels restless
  q4: DIVAQuestion; // Difficulty with quiet leisure activities
  q5: DIVAQuestion; // "On the go" or "driven by a motor"
  q6: DIVAQuestion; // Talks excessively
}

export interface DIVAImpulsivity {
  q1: DIVAQuestion; // Blurts out answers
  q2: DIVAQuestion; // Difficulty waiting turn
  q3: DIVAQuestion; // Interrupts or intrudes on others
}

export interface DIVAAnswers {
  attention: DIVAAttention;
  hyperactivity: DIVAHyperactivity;
  impulsivity: DIVAImpulsivity;
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
  score: number; // Part A score (0-24)
  highResponseCount: number; // Number of "Often" or "Very Often" responses
  interpretation: string;
  likelyADHD: boolean;
  shouldContinueToDIVA: boolean;
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
  attentionAdultCount: number;
  attentionChildCount: number;
  hyperactivityAdultCount: number;
  hyperactivityChildCount: number;
  impulsivityAdultCount: number;
  impulsivityChildCount: number;
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
