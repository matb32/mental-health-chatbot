# Addapt.ai - Adult ADHD Assessment Platform

A comprehensive web-based Adult ADHD assessment tool using validated clinical screening instruments to facilitate UK NHS GP referrals for psychiatric assessment.

## 🎯 Overview

This platform provides a structured, evidence-based assessment for adults who suspect they may have ADHD. It generates a comprehensive medical report that can be presented to a GP to support a referral to Adult Psychiatry services.

**Latest Update:** Fixed DIVA section radio button defaults and state management.

## ✨ Features

### Assessment Tools

1. **ASRS v1.1** (Adult ADHD Self-Report Scale)
   - WHO-endorsed 18-item screening tool
   - High sensitivity and specificity for Adult ADHD
   - Part A screening (6 most predictive items)
   - Part B comprehensive assessment

2. **DIVA 2.0** (Diagnostic Interview for ADHD in Adults)
   - Structured interview based on DSM-5 criteria
   - Assesses childhood symptoms (before age 12)
   - Evaluates current adult symptoms
   - Determines ADHD presentation type (Inattentive, Hyperactive-Impulsive, Combined)

3. **GAD-7** (Generalized Anxiety Disorder Assessment)
   - 7-item anxiety screening tool
   - Identifies comorbid anxiety symptoms
   - Severity grading (minimal, mild, moderate, severe)

4. **PHQ-9** (Patient Health Questionnaire)
   - 9-item depression screening tool
   - Assesses comorbid depressive symptoms
   - Crisis detection for suicidal ideation
   - Severity grading

5. **Mental Health & Family History**
   - Previous diagnoses
   - Current medications
   - Substance use assessment
   - Sleep patterns
   - Family history of ADHD and other conditions

### Report Generation

- **Comprehensive Medical Report**: Automatically generated report addressed to the patient's GP
- **Clinical Interpretation**: Evidence-based scoring and interpretation
- **DSM-5 Alignment**: Results mapped to DSM-5 diagnostic criteria
- **UK NHS Format**: Structured for UK GP referral system
- **Multiple Formats**: Download as text file or print-friendly HTML

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mental-health-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
.
├── app/                          # Next.js app directory
│   ├── assessment/               # Multi-step assessment wizard
│   ├── results/                  # Results and report generation
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── ProgressBar.tsx          # Assessment progress indicator
│   ├── RadioGroup.tsx           # Radio button question component
│   ├── PersonalInfoForm.tsx     # Personal information form
│   └── HistoryForm.tsx          # Medical/family history form
├── data/                         # Assessment questions data
│   ├── asrs-questions.ts        # ASRS questions
│   ├── gad7-questions.ts        # GAD-7 questions
│   ├── phq9-questions.ts        # PHQ-9 questions
│   └── diva-questions.ts        # DIVA questions
├── types/                        # TypeScript type definitions
│   └── assessment.ts            # All assessment types
├── utils/                        # Utility functions
│   ├── scoring.ts               # Scoring algorithms
│   └── report-generator.ts      # Report generation
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🔬 Clinical Validity

### Evidence Base

All assessment tools used in this platform are validated clinical instruments:

- **ASRS v1.1**: Kessler RC, et al. (2005). The World Health Organization Adult ADHD Self-Report Scale
- **DIVA 2.0**: Kooij JJS, Francken MH. Diagnostic Interview for ADHD in Adults
- **GAD-7**: Spitzer RL, et al. (2006). A brief measure for assessing generalized anxiety disorder
- **PHQ-9**: Kroenke K, et al. (2001). The PHQ-9: validity of a brief depression severity measure

### Scoring Methodology

#### ASRS Scoring
- Part A: Sum of first 6 questions (0-24)
- Part B: Sum of questions 7-18 (0-48)
- Screening threshold: 4 or more Part A items rated "Often" or "Very Often"

#### DIVA Scoring
- DSM-5 criteria: 5 or more symptoms in each category
- Requires childhood onset (before age 12)
- Current symptoms must be present
- Types: Inattentive, Hyperactive-Impulsive, or Combined

#### GAD-7 Scoring
- 0-4: Minimal anxiety
- 5-9: Mild anxiety
- 10-14: Moderate anxiety
- 15-21: Severe anxiety

#### PHQ-9 Scoring
- 0-4: None/minimal depression
- 5-9: Mild depression
- 10-14: Moderate depression
- 15-19: Moderately severe depression
- 20-27: Severe depression

## 🏥 UK NHS Integration

### GP Referral Process

1. Patient completes comprehensive assessment (30-45 minutes)
2. System generates medical report addressed to patient's GP
3. Patient downloads/prints report
4. Patient books GP appointment
5. GP reviews report and makes referral to Adult Psychiatry
6. Specialist assessment and diagnosis

### Report Contents

The generated report includes:

- Patient demographics and GP details
- Assessment summary with all scores
- Clinical interpretation
- DSM-5 criteria analysis
- Comorbidity assessment
- Family history
- Specific referral recommendations
- Supporting references

## 🔒 Data Privacy & Security

### GDPR Compliance

- All data stored locally in browser (localStorage)
- No data transmitted to external servers
- Patient controls their own data
- Can be deleted at any time

### Production Recommendations

For production deployment, implement:

- Secure backend database
- Encryption at rest and in transit
- User authentication
- Audit logging
- GDPR-compliant data retention policies
- NHS Data Security and Protection Toolkit compliance

## ⚠️ Important Disclaimers

### Clinical Use

**This is a screening tool, NOT a diagnostic instrument.**

- Does not replace clinical assessment by qualified professionals
- Only healthcare professionals can diagnose ADHD
- Results should be interpreted by a clinician
- Designed to facilitate referral process, not diagnose

### Crisis Support

If experiencing suicidal thoughts or mental health crisis:

- **Emergency Services**: 999
- **Samaritans**: 116 123 (24/7)
- **Crisis Text Line**: Text SHOUT to 85258
- **NHS 111**: For urgent mental health support

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns
- **PDF Generation**: jsPDF + html2canvas (for future enhancement)

## 📈 Future Enhancements

- [ ] PDF generation with professional medical formatting
- [ ] Backend API with secure database storage
- [ ] User accounts and assessment history
- [ ] Email delivery of reports to GPs
- [ ] Multi-language support
- [ ] Accessibility improvements (WCAG AAA)
- [ ] Mobile app versions (iOS/Android)
- [ ] Integration with NHS systems
- [ ] Follow-up assessment tracking
- [ ] Treatment response monitoring

## 🤝 Contributing

This is a clinical tool requiring careful validation. Contributions should:

1. Maintain clinical accuracy
2. Preserve validated scoring algorithms
3. Follow medical device software guidelines
4. Include appropriate disclaimers
5. Consider regulatory requirements

## 📄 License

[Specify your license here]

## 👥 Credits

### Clinical Content

- ASRS: WHO Composite International Diagnostic Interview
- DIVA: J.J.S. Kooij & M.H. Francken
- GAD-7: Spitzer, Kroenke, Williams, and Löwe
- PHQ-9: Kroenke, Spitzer, and Williams

### Development

Built with Next.js and modern web technologies for optimal user experience and clinical utility.

## 📞 Support

For clinical questions, please consult with a qualified healthcare professional.

For technical support or questions about the platform:
- Create an issue in the repository
- Contact: [your-contact-info]

## 🔗 Resources

- [NICE Guidelines for ADHD](https://www.nice.org.uk/guidance/ng87)
- [ADHD Foundation UK](https://www.adhdfoundation.org.uk/)
- [Royal College of Psychiatrists - ADHD](https://www.rcpsych.ac.uk/mental-health/problems-disorders/adhd)
- [NHS - ADHD](https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/)

---

**Note**: This tool is designed for the UK healthcare system. Referral processes and diagnostic criteria may differ in other countries