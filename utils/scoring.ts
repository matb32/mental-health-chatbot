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

// ASRS Scoring - Part A only (6 questions)
export function calculateASRSScore(answers: ASRSAnswers): ASRSScore {
  const values = Object.values(answers);

  // Sum of Part A scores
  const score = values.reduce((sum, val) => sum + val, 0);

  // Count "Often" (3) or "Very Often" (4) responses
  const highResponseCount = values.filter(val => val >= 3).length;

  // Threshold: 4-6 high responses suggests likely ADHD
  const likelyADHD = highResponseCount >= 4 && highResponseCount <= 6;
  const shouldContinueToDIVA = likelyADHD;

  let interpretation = '';
  if (highResponseCount >= 4) {
    interpretation = 'Your responses suggest symptoms that may indicate ADHD. We recommend continuing with the full ADHD assessment (DIVA).';
  } else {
    interpretation = 'Your responses do not strongly suggest ADHD based on this screening. Your symptoms may be related to anxiety or depression. You can self-refer to NHS Talking Therapies or continue with the full ADHD assessment if you prefer.';
  }

  return {
    score,
    highResponseCount,
    interpretation,
    likelyADHD,
    shouldContinueToDIVA,
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

// DIVA 5 Scoring - Checkbox-based system
// A symptom is positive if symptomPresent=true AND 2+ examples are checked (including "other" with text)
export function calculateDIVAScore(answers: DIVAAnswers): DIVAScore {
  // Helper function to check if a question has a positive symptom
  const isPositiveSymptom = (questionResponse: any): boolean => {
    if (!questionResponse) return false;

    // Must explicitly say symptom is present
    if (questionResponse.symptomPresent !== true) return false;

    const examplesCount = questionResponse.examples?.length || 0;
    const hasOtherText = questionResponse.otherText && questionResponse.otherText.trim().length > 0;
    const totalChecked = examplesCount + (hasOtherText ? 1 : 0);

    // Need 2+ examples to validate the symptom
    return totalChecked >= 2;
  };

  // Count positive symptoms for attention (adult and childhood)
  let attentionAdultCount = 0;
  let attentionChildCount = 0;

  Object.values(answers.attention || {}).forEach((response: any) => {
    if (isPositiveSymptom(response)) {
      attentionAdultCount++;
    }
    if (response?.childhoodPresent === true) {
      attentionChildCount++;
    }
  });

  // Count positive symptoms for hyperactivity-impulsivity (adult and childhood)
  let hyperactivityImpulsivityAdultCount = 0;
  let hyperactivityImpulsivityChildCount = 0;

  Object.values(answers.hyperactivityImpulsivity || {}).forEach((response: any) => {
    if (isPositiveSymptom(response)) {
      hyperactivityImpulsivityAdultCount++;
    }
    if (response?.childhoodPresent === true) {
      hyperactivityImpulsivityChildCount++;
    }
  });

  // DSM-5 Criteria:
  // - 5 or more inattentive symptoms (childhood and current)
  // - 5 or more hyperactive-impulsive symptoms (childhood and current)

  const inattentiveCriteria = attentionChildCount >= 5 && attentionAdultCount >= 5;
  const hyperactiveCriteria = hyperactivityImpulsivityChildCount >= 5 && hyperactivityImpulsivityAdultCount >= 5;

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

    if (attentionAdultCount >= 5 || hyperactivityImpulsivityAdultCount >= 5) {
      interpretation = 'Current symptoms suggest possible ADHD, but childhood symptom criteria are not fully met according to this assessment. This could indicate late-onset symptoms or possible recall difficulties. Clinical evaluation is recommended to explore other explanations and assess functional impairment.';
    } else if (attentionChildCount >= 5 || hyperactivityImpulsivityChildCount >= 5) {
      interpretation = 'Childhood symptoms suggest possible ADHD, but current symptom criteria are not fully met. This may indicate symptom reduction with age or compensatory strategies. Clinical evaluation can assess if residual symptoms are present and causing impairment.';
    } else {
      interpretation = 'The DIVA assessment does not indicate sufficient symptoms to meet DSM-5 criteria for ADHD. However, sub-threshold symptoms may still cause impairment and warrant clinical discussion.';
    }
  }

  // Count Criterion C impairments
  const criterionCImpairment = {
    workEducation: (answers.criterionC?.workEducation?.length || 0) +
                   (answers.criterionC?.workEducationOther ? 1 : 0),
    relationship: (answers.criterionC?.relationship?.length || 0) +
                  (answers.criterionC?.relationshipOther ? 1 : 0),
    socialContacts: (answers.criterionC?.socialContacts?.length || 0) +
                    (answers.criterionC?.socialContactsOther ? 1 : 0),
    selfConfidence: (answers.criterionC?.selfConfidence?.length || 0) +
                    (answers.criterionC?.selfConfidenceOther ? 1 : 0),
  };

  return {
    attentionAdultCount,
    attentionChildCount,
    hyperactivityImpulsivityAdultCount,
    hyperactivityImpulsivityChildCount,
    meetsDSMCriteria,
    predominantType,
    interpretation,
    supplement: answers.supplement || { adultMoreThanOthers: false, childhoodMoreThanOthers: false },
    criterionB: answers.criterionB || { alwaysHadSymptoms: false },
    criterionCImpairment,
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
