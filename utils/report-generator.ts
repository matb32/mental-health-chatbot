import { format } from 'date-fns';
import {
  CompleteAssessment,
  AssessmentResults,
} from '@/types/assessment';
import { divaAttentionQuestions, divaHyperactivityImpulsivityQuestions } from '@/data/diva5-questions';

// Helper function to format DIVA symptom details with examples
function formatDIVASymptomDetails(answers: any, questionsList: any[], sectionName: string): string {
  let output = `\n${sectionName}:\n`;

  questionsList.forEach((q, idx) => {
    const answer = answers?.[q.id];
    if (!answer) return;

    const symptomPresent = answer.symptomPresent === true;
    const examplesCount = answer.examples?.length || 0;
    const hasOtherText = answer.otherText && answer.otherText.trim().length > 0;
    const totalExamples = examplesCount + (hasOtherText ? 1 : 0);

    if (symptomPresent) {
      output += `\n${idx + 1}. ${q.text}\n`;
      output += `   Response: YES\n`;

      if (totalExamples === 0) {
        output += `   Examples provided: None (Note: 2+ examples recommended for diagnostic criteria)\n`;
      } else if (totalExamples < 2) {
        output += `   Examples provided: ${totalExamples} (Note: 2+ examples recommended for diagnostic criteria)\n`;
      } else {
        output += `   Examples provided: ${totalExamples}\n`;
      }

      if (examplesCount > 0) {
        const exampleTexts = answer.examples.map((exId: string) => {
          const example = q.examples.find((ex: any) => ex.id === exId);
          return example ? `     - ${example.text}` : '';
        }).filter(Boolean);

        if (exampleTexts.length > 0) {
          output += exampleTexts.join('\n') + '\n';
        }
      }

      if (hasOtherText) {
        output += `     - Other: ${answer.otherText}\n`;
      }

      if (answer.childhoodPresent === true) {
        output += `   Also present in childhood: YES\n`;
      } else if (answer.childhoodPresent === false) {
        output += `   Also present in childhood: NO\n`;
      }
    }
  });

  return output;
}

export function generateGPReport(
  assessment: CompleteAssessment,
  results: AssessmentResults
): string {
  const { personalInfo, mentalHealthHistory, familyHistory } = assessment;
  const reportDate = format(new Date(), 'dd MMMM yyyy');

  return `
ADULT ADHD ASSESSMENT REPORT
Addapt.ai Clinical Assessment

================================================================================
REPORT DATE: ${reportDate}
ASSESSMENT COMPLETED: ${format(new Date(assessment.completedDate), 'dd MMMM yyyy')}
================================================================================

TO: ${personalInfo.gpName}
    ${personalInfo.gpPractice}
    ${personalInfo.gpAddress}

RE: ${personalInfo.fullName}
    DOB: ${format(new Date(personalInfo.dateOfBirth), 'dd/MM/yyyy')}
    ${personalInfo.nhsNumber ? `NHS Number: ${personalInfo.nhsNumber}` : ''}

Dear Dr ${personalInfo.gpName.split(' ').pop()},

I am writing to refer the above patient for specialist psychiatric assessment for
Adult ADHD (Attention Deficit Hyperactivity Disorder). The patient has completed a
comprehensive self-report assessment using validated clinical screening tools, and
the results suggest significant ADHD symptoms that warrant further evaluation.

================================================================================
ASSESSMENT SUMMARY
================================================================================

This report is based on the following validated assessment instruments:

1. ASRS v1.1 (Adult ADHD Self-Report Scale) - WHO-endorsed screening tool
2. DIVA 2.0 (Diagnostic Interview for ADHD in Adults) - Structured diagnostic interview
3. GAD-7 (Generalized Anxiety Disorder 7-item scale)
4. PHQ-9 (Patient Health Questionnaire for Depression)
5. Mental health and family history questionnaire

================================================================================
CURRENT PRESENTATION - ASRS SCREENING RESULTS
================================================================================

${results.asrs.interpretation}

ASRS Part A Score: ${results.asrs.score}/24 (Sum of responses)
High Response Count: ${results.asrs.highResponseCount}/6 (Often or Very Often responses)

The ASRS Part A is a validated 6-item screening tool with high sensitivity and
specificity for Adult ADHD. These 6 items are the most predictive of ADHD symptoms.
A result of 4 or more items rated as "Often" or "Very Often" suggests clinically
significant ADHD symptoms warranting comprehensive diagnostic assessment.

Current Result: ${results.asrs.likelyADHD ? '**POSITIVE SCREEN for ADHD**' : 'Screen does not meet threshold, but symptoms warrant evaluation'}

================================================================================
DIVA STRUCTURED ASSESSMENT RESULTS
================================================================================

${results.diva.interpretation}

CHILDHOOD SYMPTOMS (Before Age 12):
- Inattentive symptoms: ${results.diva.attentionChildCount}/9 criteria met
- Hyperactive-Impulsive symptoms: ${results.diva.hyperactivityImpulsivityChildCount}/9 criteria met

CURRENT ADULT SYMPTOMS:
- Inattentive symptoms: ${results.diva.attentionAdultCount}/9 criteria met
- Hyperactive-Impulsive symptoms: ${results.diva.hyperactivityImpulsivityAdultCount}/9 criteria met

DSM-5 Diagnostic Criteria: ${results.diva.meetsDSMCriteria ? '**MET**' : 'Not fully met'}
${results.diva.meetsDSMCriteria ? `Predominant Presentation: ADHD, ${results.diva.predominantType.toUpperCase()} Type` : ''}

The DIVA 2.0 is a structured assessment that systematically evaluates the 18 DSM-5
criteria for ADHD: 9 inattention items, 6 hyperactivity items, and 3 impulsivity items.
Each symptom is assessed for both childhood (ages 5-12) and current adult presentation
using Yes/No responses. DSM-5 requires 5 or more symptoms in each category, present
since childhood and currently causing impairment.

Note: For diagnostic validation, 2 or more specific examples are recommended for each
symptom marked as present. Symptoms with fewer examples are noted below but may require
further clinical exploration.

DETAILED SYMPTOM PRESENTATION:
${formatDIVASymptomDetails(assessment.diva.attention, divaAttentionQuestions, 'INATTENTION SYMPTOMS')}
${formatDIVASymptomDetails(assessment.diva.hyperactivityImpulsivity, divaHyperactivityImpulsivityQuestions, 'HYPERACTIVITY-IMPULSIVITY SYMPTOMS')}

================================================================================
CO-OCCURRING MENTAL HEALTH CONCERNS
================================================================================

ANXIETY (GAD-7):
Total Score: ${results.gad7.totalScore}/21
Severity: ${results.gad7.severity.toUpperCase()}
${results.gad7.interpretation}

DEPRESSION (PHQ-9):
Total Score: ${results.phq9.totalScore}/27
Severity: ${results.phq9.severity.toUpperCase()}
${results.phq9.interpretation}

${results.phq9.requiresUrgentAttention ? `
**CLINICAL ALERT:**
The patient has reported thoughts of self-harm (PHQ-9 item 9 positive).
Immediate risk assessment is required. Please follow local safeguarding protocols.
` : ''}

CLINICAL SIGNIFICANCE:
Anxiety and depression commonly co-occur with ADHD in adults. Studies indicate that
up to 50% of adults with ADHD have comorbid anxiety disorders, and up to 30% have
comorbid depression. These conditions can:
- Exacerbate ADHD symptoms
- Complicate diagnosis
- Require integrated treatment approaches

It is important to assess whether anxiety/depression are:
1. Primary conditions
2. Secondary to untreated ADHD (e.g., from years of struggle and impairment)
3. Independent comorbid conditions

================================================================================
MENTAL HEALTH HISTORY
================================================================================

PREVIOUS DIAGNOSES:
${mentalHealthHistory.previousDiagnoses.length > 0
  ? mentalHealthHistory.previousDiagnoses.join(', ')
  : 'None reported'}

CURRENT MEDICATIONS:
${mentalHealthHistory.currentMedications || 'None reported'}

PREVIOUS TREATMENTS:
${mentalHealthHistory.previousTreatments || 'None reported'}

SUBSTANCE USE:
- Alcohol: ${mentalHealthHistory.substanceUse.alcohol}
- Tobacco: ${mentalHealthHistory.substanceUse.tobacco}
- Cannabis: ${mentalHealthHistory.substanceUse.cannabis}
${mentalHealthHistory.substanceUse.other ? `- Other: ${mentalHealthHistory.substanceUse.other}` : ''}

SLEEP PATTERNS:
${mentalHealthHistory.sleepPatterns || 'Not specified'}

SIGNIFICANT LIFE EVENTS:
${mentalHealthHistory.significantLifeEvents || 'Not specified'}

================================================================================
FAMILY HISTORY
================================================================================

ADHD in Family: ${familyHistory.adhdInFamily ? 'YES' : 'NO'}
${familyHistory.adhdInFamily && familyHistory.adhdRelatives ? `Affected relatives: ${familyHistory.adhdRelatives}` : ''}

Anxiety Disorders in Family: ${familyHistory.anxietyInFamily ? 'YES' : 'NO'}

Depression in Family: ${familyHistory.depressionInFamily ? 'YES' : 'NO'}

Other Mental Health Conditions:
${familyHistory.otherMentalHealthConditions || 'None reported'}

CLINICAL SIGNIFICANCE:
ADHD has a strong genetic component with heritability estimated at 70-80%. Family
history of ADHD significantly increases the likelihood of the diagnosis.

================================================================================
CLINICAL RECOMMENDATIONS
================================================================================

${results.overallRecommendation}

SPECIFIC REFERRAL REQUEST:

I am requesting a comprehensive psychiatric assessment for this patient with the
following objectives:

1. DIAGNOSTIC CLARIFICATION
   - Confirm or rule out Adult ADHD diagnosis using clinical interview
   - Assess for differential diagnoses (e.g., anxiety disorders, mood disorders,
     personality disorders, autism spectrum disorder)
   - Evaluate functional impairment across multiple domains (work, relationships,
     daily activities)

2. COMORBIDITY ASSESSMENT
   - Comprehensive evaluation of anxiety and depressive symptoms
   - Assessment of substance use (particularly as self-medication)
   - Screening for other common comorbidities (sleep disorders, eating disorders)

3. TREATMENT PLANNING
   - If ADHD is confirmed, discuss pharmacological options (stimulant and
     non-stimulant medications)
   - Consider psychological interventions (CBT for ADHD, coaching, skills training)
   - Develop integrated treatment plan addressing ADHD and comorbid conditions
   - Provide psychoeducation about ADHD in adulthood

4. FUNCTIONAL ASSESSMENT
   - Evaluate impact on occupational functioning
   - Assess impact on relationships and social functioning
   - Identify areas requiring support or accommodations

================================================================================
SUPPORTING INFORMATION FOR REFERRAL
================================================================================

This comprehensive assessment provides detailed baseline data that may be useful
for the assessing psychiatrist. The patient has completed:

✓ Validated screening tools with established clinical cut-offs
✓ Structured diagnostic interview (DIVA) aligned with DSM-5 criteria
✓ Assessment of common comorbid conditions
✓ Detailed history including childhood symptoms

The assessment was completed independently by the patient using the Addapt.ai
platform, which is designed to facilitate the referral process for Adult ADHD
assessment. This does not constitute a formal diagnosis but provides standardised
information to support clinical decision-making.

================================================================================
PATIENT CONTACT INFORMATION
================================================================================

Name: ${personalInfo.fullName}
Date of Birth: ${format(new Date(personalInfo.dateOfBirth), 'dd/MM/yyyy')}
Email: ${personalInfo.email}
Phone: ${personalInfo.phone}
Address: ${personalInfo.address}

================================================================================

I would be grateful if you could facilitate a referral to Adult Psychiatry services
for comprehensive ADHD assessment. If you require any additional information or
clarification regarding this assessment, please do not hesitate to contact the patient.

Thank you for your attention to this matter.

Yours sincerely,

Addapt.ai Clinical Assessment Platform
[This is an automated report generated from validated self-report measures]

================================================================================
REFERENCES & NOTES
================================================================================

1. ASRS v1.1: Kessler RC, et al. (2005). The World Health Organization Adult ADHD
   Self-Report Scale (ASRS). Psychological Medicine, 35(2), 245-256.

2. DIVA 2.0: Kooij JJS, Francken MH. Diagnostic Interview for ADHD in Adults (DIVA 2.0).

3. GAD-7: Spitzer RL, et al. (2006). A brief measure for assessing generalized
   anxiety disorder. Archives of Internal Medicine, 166(10), 1092-1097.

4. PHQ-9: Kroenke K, et al. (2001). The PHQ-9: validity of a brief depression
   severity measure. Journal of General Internal Medicine, 16(9), 606-613.

5. NICE Guidelines: Attention deficit hyperactivity disorder: diagnosis and
   management (NG87), updated 2019.

================================================================================
END OF REPORT
================================================================================

Report Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}
Report ID: ${generateReportId(assessment)}
`;
}

function generateReportId(assessment: CompleteAssessment): string {
  const date = new Date(assessment.completedDate);
  const dateStr = format(date, 'yyyyMMdd');
  const nameHash = assessment.personalInfo.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ADDAPT-${dateStr}-${nameHash}-${randomStr}`;
}

export function generateHTMLReport(
  assessment: CompleteAssessment,
  results: AssessmentResults
): string {
  const textReport = generateGPReport(assessment, results);

  // Convert text report to HTML with proper formatting
  const htmlContent = textReport
    .split('\n')
    .map(line => {
      if (line.trim().startsWith('===========')) {
        return '<hr style="border: 2px solid #333; margin: 20px 0;" />';
      } else if (line.trim().match(/^[A-Z\s]{10,}$/)) {
        return `<h2 style="color: #0369a1; margin-top: 30px;">${line.trim()}</h2>`;
      } else if (line.includes('**') && line.includes('**')) {
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #dc2626;">$1</strong>');
        return `<p style="margin: 10px 0;">${formatted}</p>`;
      } else if (line.trim().startsWith('-')) {
        return `<li style="margin-left: 20px;">${line.trim().substring(1)}</li>`;
      } else if (line.trim()) {
        return `<p style="margin: 10px 0;">${line}</p>`;
      }
      return '<br />';
    })
    .join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Adult ADHD Assessment Report - ${assessment.personalInfo.fullName}</title>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      line-height: 1.6;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20mm;
      background: white;
      color: #000;
    }
    @media print {
      body {
        padding: 0;
      }
    }
    h2 {
      color: #0369a1;
      margin-top: 30px;
      font-size: 18px;
    }
    hr {
      border: 2px solid #333;
      margin: 20px 0;
    }
    .alert {
      background-color: #fee;
      border-left: 4px solid #dc2626;
      padding: 15px;
      margin: 20px 0;
    }
    strong {
      font-weight: bold;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
  `;
}
