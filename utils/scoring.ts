import {
  ASRSAnswers,
  GAD7Answers,
  PHQ9Answers,
  DIVAAnswers,
  ASRSScore,
  GAD7Score,
  PHQ9Score,
  DIVAScore,
  AssessmentResults,
} from '@/types/assessment';

// ASRS Scoring
export function calculateASRSScore(answers: ASRSAnswers): ASRSScore {
  const values = Object.values(answers);

  // Part A: Questions 1-6 (screening questions)
  const partAScore = values.slice(0, 6).reduce((sum, val) => sum + val, 0);

  // Part B: Questions 7-18
  const partBScore = values.slice(6).reduce((sum, val) => sum + val, 0);

  const totalScore = partAScore + partBScore;

  // Part A screening: 4 or more questions with responses of "Often" (3) or "Very Often" (4)
  const partAHighResponses = values.slice(0, 6).filter(val => val >= 3).length;
  const likelyADHD = partAHighResponses >= 4;

  let interpretation = '';
  if (likelyADHD) {
    interpretation = 'Your responses on the ASRS screening tool suggest symptoms consistent with adult ADHD. Further comprehensive evaluation is strongly recommended.';
  } else if (partAHighResponses >= 3) {
    interpretation = 'Your responses suggest some symptoms that may be associated with ADHD. A comprehensive evaluation would be beneficial to clarify the diagnosis.';
  } else {
    interpretation = 'Your responses on the ASRS screening tool do not strongly suggest ADHD, though this does not rule out the condition. Clinical evaluation is recommended if you have concerns.';
  }

  return {
    partAScore,
    partBScore,
    totalScore,
    interpretation,
    likelyADHD,
  };
}

// GAD-7 Scoring
export function calculateGAD7Score(answers: GAD7Answers): GAD7Score {
  const values = Object.values(answers);
  const totalScore = values.reduce((sum, val) => sum + val, 0);

  let severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  let interpretation: string;

  if (totalScore <= 4) {
    severity = 'minimal';
    interpretation = 'Minimal anxiety symptoms detected. Your anxiety levels appear to be within normal range.';
  } else if (totalScore <= 9) {
    severity = 'mild';
    interpretation = 'Mild anxiety symptoms detected. Some anxiety is present but may not significantly impact daily functioning.';
  } else if (totalScore <= 14) {
    severity = 'moderate';
    interpretation = 'Moderate anxiety symptoms detected. These symptoms may be affecting your daily life and warrant clinical attention.';
  } else {
    severity = 'severe';
    interpretation = 'Severe anxiety symptoms detected. These symptoms are likely significantly impacting your daily functioning and require professional intervention.';
  }

  return {
    totalScore,
    severity,
    interpretation,
  };
}

// PHQ-9 Scoring
export function calculatePHQ9Score(answers: PHQ9Answers): PHQ9Score {
  const values = Object.values(answers);
  const totalScore = values.reduce((sum, val) => sum + val, 0);

  // Check for suicidal ideation (question 9)
  const requiresUrgentAttention = answers.q9 > 0;

  let severity: 'none' | 'mild' | 'moderate' | 'moderately-severe' | 'severe';
  let interpretation: string;

  if (totalScore <= 4) {
    severity = 'none';
    interpretation = 'Minimal or no depression detected. Your mood appears to be within normal range.';
  } else if (totalScore <= 9) {
    severity = 'mild';
    interpretation = 'Mild depression detected. Some depressive symptoms are present but may not significantly impact daily functioning.';
  } else if (totalScore <= 14) {
    severity = 'moderate';
    interpretation = 'Moderate depression detected. These symptoms are likely affecting your daily life and warrant clinical attention.';
  } else if (totalScore <= 19) {
    severity = 'moderately-severe';
    interpretation = 'Moderately severe depression detected. These symptoms are significantly impacting your functioning and require professional treatment.';
  } else {
    severity = 'severe';
    interpretation = 'Severe depression detected. Immediate professional intervention is strongly recommended.';
  }

  if (requiresUrgentAttention) {
    interpretation += ' **IMPORTANT: Thoughts of self-harm were reported - immediate clinical assessment is required.**';
  }

  return {
    totalScore,
    severity,
    interpretation,
    requiresUrgentAttention,
  };
}

// DIVA Scoring
export function calculateDIVAScore(answers: DIVAAnswers): DIVAScore {
  // Count "Yes" responses (value of 2) for each section
  const childhoodInattentionCount = Object.values(answers.childhoodInattention).filter(v => v === 2).length;
  const childhoodHyperactivityCount = Object.values(answers.childhoodHyperactivity).filter(v => v === 2).length;
  const adultInattentionCount = Object.values(answers.adultInattention).filter(v => v === 2).length;
  const adultHyperactivityCount = Object.values(answers.adultHyperactivity).filter(v => v === 2).length;

  // DSM-5 Criteria:
  // - 5 or more inattentive symptoms (childhood and current)
  // - 5 or more hyperactive-impulsive symptoms (childhood and current)
  // - Symptoms present before age 12
  // - Symptoms present in 2 or more settings
  // - Clear evidence symptoms interfere with functioning

  const inattentiveCriteria = childhoodInattentionCount >= 5 && adultInattentionCount >= 5;
  const hyperactiveCriteria = childhoodHyperactivityCount >= 5 && adultHyperactivityCount >= 5;

  let predominantType: 'inattentive' | 'hyperactive-impulsive' | 'combined' | 'none';
  let meetsDSMCriteria = false;
  let interpretation = '';

  if (inattentiveCriteria && hyperactiveCriteria) {
    predominantType = 'combined';
    meetsDSMCriteria = true;
    interpretation = 'The DIVA assessment indicates symptoms consistent with ADHD, Combined Presentation. Both inattentive and hyperactive-impulsive symptoms are present from childhood to adulthood, meeting DSM-5 diagnostic criteria.';
  } else if (inattentiveCriteria) {
    predominantType = 'inattentive';
    meetsDSMCriteria = true;
    interpretation = 'The DIVA assessment indicates symptoms consistent with ADHD, Predominantly Inattentive Presentation. Significant inattentive symptoms are present from childhood to adulthood, meeting DSM-5 diagnostic criteria.';
  } else if (hyperactiveCriteria) {
    predominantType = 'hyperactive-impulsive';
    meetsDSMCriteria = true;
    interpretation = 'The DIVA assessment indicates symptoms consistent with ADHD, Predominantly Hyperactive-Impulsive Presentation. Significant hyperactive-impulsive symptoms are present from childhood to adulthood, meeting DSM-5 diagnostic criteria.';
  } else {
    predominantType = 'none';
    meetsDSMCriteria = false;

    if (adultInattentionCount >= 5 || adultHyperactivityCount >= 5) {
      interpretation = 'Current symptoms suggest possible ADHD, but childhood symptom criteria are not fully met according to this assessment. This could indicate late-onset symptoms or possible recall difficulties. Clinical evaluation is recommended to explore other explanations and assess functional impairment.';
    } else if (childhoodInattentionCount >= 5 || childhoodHyperactivityCount >= 5) {
      interpretation = 'Childhood symptoms suggest possible ADHD, but current symptom criteria are not fully met. This may indicate symptom reduction with age or compensatory strategies. Clinical evaluation can assess if residual symptoms are present and causing impairment.';
    } else {
      interpretation = 'The DIVA assessment does not indicate sufficient symptoms to meet DSM-5 criteria for ADHD. However, sub-threshold symptoms may still cause impairment and warrant clinical discussion.';
    }
  }

  return {
    childhoodInattentionCount,
    childhoodHyperactivityCount,
    adultInattentionCount,
    adultHyperactivityCount,
    meetsDSMCriteria,
    predominantType,
    interpretation,
  };
}

// Overall Assessment
export function calculateOverallAssessment(
  asrsScore: ASRSScore,
  gad7Score: GAD7Score,
  phq9Score: PHQ9Score,
  divaScore: DIVAScore
): string {
  const recommendations: string[] = [];

  // Primary ADHD assessment
  if (divaScore.meetsDSMCriteria || asrsScore.likelyADHD) {
    recommendations.push('Based on the assessment results, there is strong evidence suggesting Adult ADHD. A comprehensive psychiatric evaluation for ADHD diagnosis and treatment planning is strongly recommended.');
  } else {
    recommendations.push('While the assessment does not definitively indicate ADHD, the presenting symptoms warrant further clinical evaluation to rule out ADHD or explore alternative diagnoses.');
  }

  // Comorbid conditions
  const comorbidConditions: string[] = [];

  if (gad7Score.severity === 'moderate' || gad7Score.severity === 'severe') {
    comorbidConditions.push('significant anxiety symptoms');
  }

  if (phq9Score.severity === 'moderate' || phq9Score.severity === 'moderately-severe' || phq9Score.severity === 'severe') {
    comorbidConditions.push('significant depressive symptoms');
  }

  if (comorbidConditions.length > 0) {
    recommendations.push(`Co-occurring conditions detected: ${comorbidConditions.join(' and ')}. These conditions commonly co-exist with ADHD and require integrated treatment planning.`);
  }

  // Urgency
  if (phq9Score.requiresUrgentAttention) {
    recommendations.push('**URGENT: Suicidal ideation was reported. Immediate psychiatric assessment is required. Please contact crisis services if the patient is at immediate risk.**');
  }

  // Treatment considerations
  recommendations.push('Recommended next steps: (1) Comprehensive psychiatric assessment for ADHD and comorbid conditions, (2) Consider neuropsychological testing if diagnostic uncertainty remains, (3) Discuss treatment options including pharmacotherapy and psychological interventions.');

  return recommendations.join('\n\n');
}
