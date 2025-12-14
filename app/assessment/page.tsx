'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import HistoryForm from '@/components/HistoryForm';
import RadioGroup from '@/components/RadioGroup';
import {
  PersonalInformation,
  MentalHealthHistory,
  FamilyHistory,
  ASRSAnswers,
  GAD7Answers,
  PHQ9Answers,
  DIVAAnswers,
  CompleteAssessment,
} from '@/types/assessment';
import { asrsQuestions, asrsResponseOptions } from '@/data/asrs-questions';
import { gad7Questions, gad7Intro, gad7ResponseOptions } from '@/data/gad7-questions';
import { phq9Questions, phq9Intro, phq9ResponseOptions } from '@/data/phq9-questions';
import {
  divaAttentionQuestions,
  divaHyperactivityImpulsivityQuestions,
  divaSupplementQuestions,
  divaCriterionB,
  divaCriterionC,
} from '@/data/diva5-questions';
import { calculateASRSScore } from '@/utils/scoring';

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [skipDIVA, setSkipDIVA] = useState(false);

  // State for all form data
  const [personalInfo, setPersonalInfo] = useState<PersonalInformation>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    gpName: '',
    gpPractice: '',
    gpAddress: '',
    nhsNumber: '',
  });

  const [mentalHealthHistory, setMentalHealthHistory] = useState<MentalHealthHistory>({
    previousDiagnoses: [],
    currentMedications: '',
    previousTreatments: '',
    substanceUse: {
      alcohol: 'none',
      tobacco: 'none',
      cannabis: 'none',
      other: '',
    },
    sleepPatterns: '',
    significantLifeEvents: '',
  });

  const [familyHistory, setFamilyHistory] = useState<FamilyHistory>({
    adhdInFamily: false,
    adhdRelatives: '',
    anxietyInFamily: false,
    depressionInFamily: false,
    otherMentalHealthConditions: '',
  });

  const [gad7Answers, setGad7Answers] = useState<Partial<GAD7Answers>>({});
  const [phq9Answers, setPhq9Answers] = useState<Partial<PHQ9Answers>>({});
  const [asrsAnswers, setAsrsAnswers] = useState<Partial<ASRSAnswers>>({});
  const [divaAnswers, setDivaAnswers] = useState<any>({
    attention: {},
    hyperactivityImpulsivity: {},
    supplement: {
      adultMoreThanOthers: false,
      childhoodMoreThanOthers: false,
    },
    criterionB: {
      alwaysHadSymptoms: false,
      ageOfOnset: undefined,
    },
    criterionC: {
      workEducation: [],
      workEducationOther: '',
      relationship: [],
      relationshipOther: '',
      socialContacts: [],
      socialContactsOther: '',
      selfConfidence: [],
      selfConfidenceOther: '',
    },
  });

  // Calculate steps dynamically
  const getSteps = () => {
    const baseSteps = ['Personal Info', 'History', 'GAD-7', 'PHQ-9', 'ASRS'];

    // Check if ASRS is complete to show decision
    if (Object.keys(asrsAnswers).length === 6) {
      const score = calculateASRSScore(asrsAnswers as ASRSAnswers);
      if (score.shouldContinueToDIVA || !skipDIVA) {
        return [...baseSteps, 'Decision', 'DIVA', 'Review'];
      } else {
        return [...baseSteps, 'Decision', 'Review'];
      }
    }

    return [...baseSteps, 'Review'];
  };

  const steps = getSteps();

  const handleNext = () => {
    // Validation
    if (currentStep === 1) {
      const required = ['fullName', 'dateOfBirth', 'gender', 'email', 'phone', 'address', 'gpName', 'gpPractice', 'gpAddress'];
      const isValid = required.every(field => personalInfo[field as keyof PersonalInformation]);
      if (!isValid) {
        alert('Please fill in all required fields');
        return;
      }
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleContinueToDIVA = () => {
    setSkipDIVA(false);
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handleSkipToDone = () => {
    setSkipDIVA(true);
    // Skip to review
    const reviewStep = steps.indexOf('Review');
    if (reviewStep > 0) {
      setCurrentStep(reviewStep + 1);
    } else {
      setCurrentStep(steps.length);
    }
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    const assessment: CompleteAssessment = {
      personalInfo,
      asrs: asrsAnswers as ASRSAnswers,
      gad7: gad7Answers as GAD7Answers,
      phq9: phq9Answers as PHQ9Answers,
      diva: divaAnswers as DIVAAnswers,
      mentalHealthHistory,
      familyHistory,
      completedDate: new Date().toISOString(),
    };

    localStorage.setItem('assessment', JSON.stringify(assessment));
    router.push('/results');
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return Object.keys(personalInfo).filter(k => k !== 'nhsNumber').every(
          key => personalInfo[key as keyof PersonalInformation]
        );
      case 2:
        return true; // History is optional
      case 3:
        return Object.keys(gad7Answers).length === 7;
      case 4:
        return Object.keys(phq9Answers).length === 9;
      case 5:
        return Object.keys(asrsAnswers).length === 6;
      case 6:
        // Decision step is always complete
        return true;
      case 7:
        if (skipDIVA) return true;
        // Check that all 18 symptom questions are answered (9 attention + 9 hyperactivity-impulsivity)
        const attentionComplete = Object.keys(divaAnswers.attention || {}).length === 9;
        const hyperactivityComplete = Object.keys(divaAnswers.hyperactivityImpulsivity || {}).length === 9;

        // Check supplement questions are answered
        const supplementComplete =
          typeof divaAnswers.supplement?.adultMoreThanOthers === 'boolean' &&
          typeof divaAnswers.supplement?.childhoodMoreThanOthers === 'boolean';

        // Check criterion B is answered
        const criterionBComplete = typeof divaAnswers.criterionB?.alwaysHadSymptoms === 'boolean';

        return attentionComplete && hyperactivityComplete && supplementComplete && criterionBComplete;
      default:
        return true;
    }
  };

  const renderStep = () => {
    const stepName = steps[currentStep - 1];

    switch (stepName) {
      case 'Personal Info':
        return (
          <PersonalInfoForm
            data={personalInfo}
            onChange={setPersonalInfo}
          />
        );

      case 'History':
        return (
          <HistoryForm
            mentalHealth={mentalHealthHistory}
            familyHistory={familyHistory}
            onMentalHealthChange={setMentalHealthHistory}
            onFamilyHistoryChange={setFamilyHistory}
          />
        );

      case 'GAD-7':
        return (
          <div>
            <div className="section-header">
              <h2 className="text-2xl font-bold text-gray-900">GAD-7 - Anxiety Assessment</h2>
              <p className="text-gray-600 mt-2">{gad7Intro}</p>
            </div>
            {gad7Questions.map((q) => (
              <RadioGroup
                key={q.id}
                question={q.text}
                options={gad7ResponseOptions}
                value={(gad7Answers as any)[q.id]}
                onChange={(value) =>
                  setGad7Answers({ ...gad7Answers, [q.id]: value })
                }
                name={q.id}
              />
            ))}
          </div>
        );

      case 'PHQ-9':
        return (
          <div>
            <div className="section-header">
              <h2 className="text-2xl font-bold text-gray-900">PHQ-9 - Depression Assessment</h2>
              <p className="text-gray-600 mt-2">{phq9Intro}</p>
            </div>
            {phq9Questions.map((q, idx) => (
              <div key={q.id}>
                {idx === 8 && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                    <p className="text-sm text-amber-800">
                      <strong>Important:</strong> If you are experiencing thoughts of self-harm,
                      please contact emergency services (999) or the Samaritans (116 123) immediately.
                    </p>
                  </div>
                )}
                <RadioGroup
                  question={q.text}
                  options={phq9ResponseOptions}
                  value={(phq9Answers as any)[q.id]}
                  onChange={(value) =>
                    setPhq9Answers({ ...phq9Answers, [q.id]: value })
                  }
                  name={q.id}
                />
              </div>
            ))}
          </div>
        );

      case 'ASRS':
        return (
          <div>
            <div className="section-header">
              <h2 className="text-2xl font-bold text-gray-900">
                ASRS - ADHD Screening (Part A)
              </h2>
              <p className="text-gray-600 mt-2">
                Please answer each question based on how you have felt and conducted yourself
                over the past 6 months.
              </p>
            </div>
            {asrsQuestions.map((q) => (
              <RadioGroup
                key={q.id}
                question={q.text}
                options={asrsResponseOptions}
                value={(asrsAnswers as any)[q.id]}
                onChange={(value) =>
                  setAsrsAnswers({ ...asrsAnswers, [q.id]: value })
                }
                name={q.id}
              />
            ))}
          </div>
        );

      case 'Decision':
        const asrsScore = calculateASRSScore(asrsAnswers as ASRSAnswers);
        return (
          <div>
            <div className="section-header">
              <h2 className="text-2xl font-bold text-gray-900">
                ASRS Screening Results
              </h2>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Score</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">
                    High-response items (Often/Very Often):
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    {asrsScore.highResponseCount} / 6
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-600 h-3 rounded-full transition-all"
                    style={{ width: `${(asrsScore.highResponseCount / 6) * 100}%` }}
                  />
                </div>
              </div>

              <div className={`p-6 rounded-lg border-l-4 ${
                asrsScore.shouldContinueToDIVA
                  ? 'bg-amber-50 border-amber-500'
                  : 'bg-blue-50 border-blue-500'
              }`}>
                <h3 className="text-lg font-semibold mb-3">
                  {asrsScore.shouldContinueToDIVA
                    ? '⚠️ This may indicate ADHD'
                    : 'ℹ️ Lower likelihood of ADHD'}
                </h3>
                <p className="text-gray-800 mb-4">{asrsScore.interpretation}</p>

                {asrsScore.shouldContinueToDIVA ? (
                  <div>
                    <p className="text-gray-700 mb-4">
                      We recommend continuing with the full ADHD assessment (DIVA) to provide
                      comprehensive information for your GP.
                    </p>
                    <button
                      onClick={handleContinueToDIVA}
                      className="btn-primary w-full"
                    >
                      Continue to Full ADHD Assessment (DIVA)
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 mb-4">
                      Based on your responses, your symptoms may be more related to anxiety or
                      depression rather than ADHD.
                    </p>

                    <div className="bg-white rounded-lg border border-blue-300 p-4 mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        NHS Talking Therapies (Free)
                      </h4>
                      <p className="text-sm text-gray-700 mb-3">
                        You can self-refer to NHS Talking Therapies for anxiety and depression
                        support without seeing your GP.
                      </p>
                      <a
                        href="https://www.nhs.uk/nhs-services/mental-health-services/find-nhs-talking-therapies-for-anxiety-and-depression/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                      >
                        Find NHS Talking Therapies →
                      </a>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <p className="text-gray-700 mb-3">
                        <strong>Still want to complete the full ADHD assessment?</strong>
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        You can continue if you'd like comprehensive ADHD screening for your GP,
                        or skip to complete your assessment.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={handleContinueToDIVA}
                          className="btn-secondary flex-1"
                        >
                          Continue to DIVA Assessment
                        </button>
                        <button
                          onClick={handleSkipToDone}
                          className="btn-primary flex-1"
                        >
                          Skip to Complete Assessment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'DIVA':
        // Helper functions for checkbox handling
        const handleSymptomPresentToggle = (section: 'attention' | 'hyperactivityImpulsivity', questionId: string, value: boolean) => {
          const currentQuestion = (divaAnswers[section] as any)?.[questionId] || { symptomPresent: false, examples: [], otherText: '', childhoodPresent: false };

          setDivaAnswers({
            ...divaAnswers,
            [section]: {
              ...divaAnswers[section],
              [questionId]: { ...currentQuestion, symptomPresent: value, examples: value ? currentQuestion.examples : [] },
            },
          });
        };

        const handleExampleToggle = (section: 'attention' | 'hyperactivityImpulsivity', questionId: string, exampleId: string) => {
          const currentQuestion = (divaAnswers[section] as any)?.[questionId] || { symptomPresent: false, examples: [], otherText: '', childhoodPresent: false };
          const currentExamples = currentQuestion.examples || [];

          const newExamples = currentExamples.includes(exampleId)
            ? currentExamples.filter((id: string) => id !== exampleId)
            : [...currentExamples, exampleId];

          setDivaAnswers({
            ...divaAnswers,
            [section]: {
              ...divaAnswers[section],
              [questionId]: { ...currentQuestion, examples: newExamples },
            },
          });
        };

        const handleOtherTextChange = (section: 'attention' | 'hyperactivityImpulsivity', questionId: string, text: string) => {
          const currentQuestion = (divaAnswers[section] as any)?.[questionId] || { symptomPresent: false, examples: [], otherText: '', childhoodPresent: false };

          setDivaAnswers({
            ...divaAnswers,
            [section]: {
              ...divaAnswers[section],
              [questionId]: { ...currentQuestion, otherText: text },
            },
          });
        };

        const handleChildhoodToggle = (section: 'attention' | 'hyperactivityImpulsivity', questionId: string, value: boolean) => {
          const currentQuestion = (divaAnswers[section] as any)?.[questionId] || { symptomPresent: false, examples: [], otherText: '', childhoodPresent: false };

          setDivaAnswers({
            ...divaAnswers,
            [section]: {
              ...divaAnswers[section],
              [questionId]: { ...currentQuestion, childhoodPresent: value },
            },
          });
        };

        const handleCriterionCToggle = (area: 'workEducation' | 'relationship' | 'socialContacts' | 'selfConfidence', exampleId: string) => {
          const currentExamples = divaAnswers.criterionC?.[area] || [];
          const newExamples = currentExamples.includes(exampleId)
            ? currentExamples.filter((id: string) => id !== exampleId)
            : [...currentExamples, exampleId];

          setDivaAnswers({
            ...divaAnswers,
            criterionC: {
              ...divaAnswers.criterionC,
              [area]: newExamples,
            },
          });
        };

        return (
          <div>
            <div className="section-header">
              <h2 className="text-2xl font-bold text-gray-900">
                DIVA 5.0 - Diagnostic Interview for ADHD in Adults
              </h2>
              <p className="text-gray-600 mt-2">
                For each symptom question, first indicate if you experience it, then provide examples.
              </p>
            </div>

            {/* Part 1: Attention Deficit Symptoms */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-primary-600">
                Part 1: Symptoms of Attention-Deficit (DSM-5 Criterion A1)
              </h3>
              {divaAttentionQuestions.map((q, idx) => {
                const currentAnswer = (divaAnswers.attention as any)?.[q.id] || { symptomPresent: false, examples: [], otherText: '', childhoodPresent: false };
                const symptomPresent = currentAnswer.symptomPresent || false;
                const selectedExamples = currentAnswer.examples || [];
                const otherText = currentAnswer.otherText || '';
                const childhoodPresent = currentAnswer.childhoodPresent || false;

                return (
                  <div key={q.id} className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      {idx + 1}. {q.text}
                    </h4>

                    {/* Symptom Present Yes/No */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">Do you experience this symptom?</p>
                      <div className="flex gap-4">
                        <label className={`radio-card flex-1 ${symptomPresent === true ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                          <input
                            type="radio"
                            name={`${q.id}-present`}
                            checked={symptomPresent === true}
                            onChange={() => handleSymptomPresentToggle('attention', q.id, true)}
                            className="sr-only"
                          />
                          <div className="radio-indicator mr-3" />
                          <span className="flex-1 text-sm font-medium text-gray-900">Yes</span>
                        </label>
                        <label className={`radio-card flex-1 ${symptomPresent === false ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                          <input
                            type="radio"
                            name={`${q.id}-present`}
                            checked={symptomPresent === false}
                            onChange={() => handleSymptomPresentToggle('attention', q.id, false)}
                            className="sr-only"
                          />
                          <div className="radio-indicator mr-3" />
                          <span className="flex-1 text-sm font-medium text-gray-900">No</span>
                        </label>
                      </div>
                    </div>

                    {/* Examples checkboxes - only show if symptom present */}
                    {symptomPresent && (
                      <div className="mb-4 pl-4 border-l-2 border-blue-200">
                        <p className="text-sm font-medium text-gray-700 mb-3">Check all examples that apply:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.examples.map((example) => (
                            <label key={example.id} className="flex items-start p-2 hover:bg-gray-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedExamples.includes(example.id)}
                                onChange={() => handleExampleToggle('attention', q.id, example.id)}
                                className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{example.text}</span>
                            </label>
                          ))}
                        </div>

                        {/* Other field */}
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Other (please specify):</label>
                          <input
                            type="text"
                            value={otherText}
                            onChange={(e) => handleOtherTextChange('attention', q.id, e.target.value)}
                            placeholder="Describe other examples..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {/* Childhood follow-up - always show */}
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-3">
                        And did you experience similar symptoms as a child? (Aged 7-12)
                      </p>
                      <div className="flex gap-4">
                        <label className={`radio-card flex-1 ${childhoodPresent === true ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                          <input
                            type="radio"
                            name={`attention-${q.id}-childhood`}
                            checked={childhoodPresent === true}
                            onChange={() => handleChildhoodToggle('attention', q.id, true)}
                            className="sr-only"
                          />
                          <div className="radio-indicator mr-3" />
                          <span className="flex-1 text-sm font-medium text-gray-900">Yes</span>
                        </label>
                        <label className={`radio-card flex-1 ${childhoodPresent === false ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                          <input
                            type="radio"
                            name={`attention-${q.id}-childhood`}
                            checked={childhoodPresent === false}
                            onChange={() => handleChildhoodToggle('attention', q.id, false)}
                            className="sr-only"
                          />
                          <div className="radio-indicator mr-3" />
                          <span className="flex-1 text-sm font-medium text-gray-900">No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Part 2: Hyperactivity-Impulsivity Symptoms */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-primary-600">
                Part 2: Symptoms of Hyperactivity-Impulsivity (DSM-5 Criterion A2)
              </h3>
              {divaHyperactivityImpulsivityQuestions.map((q, idx) => {
                const currentAnswer = (divaAnswers.hyperactivityImpulsivity as any)?.[q.id] || { symptomPresent: false, examples: [], otherText: '', childhoodPresent: false };
                const symptomPresent = currentAnswer.symptomPresent || false;
                const selectedExamples = currentAnswer.examples || [];
                const otherText = currentAnswer.otherText || '';
                const childhoodPresent = currentAnswer.childhoodPresent || false;

                return (
                  <div key={q.id} className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      {idx + 1}. {q.text}
                    </h4>

                    {/* Symptom Present Yes/No */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">Do you experience this symptom?</p>
                      <div className="flex gap-4">
                        <label className={`radio-card flex-1 ${symptomPresent === true ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                          <input
                            type="radio"
                            name={`${q.id}-present`}
                            checked={symptomPresent === true}
                            onChange={() => handleSymptomPresentToggle('hyperactivityImpulsivity', q.id, true)}
                            className="sr-only"
                          />
                          <div className="radio-indicator mr-3" />
                          <span className="flex-1 text-sm font-medium text-gray-900">Yes</span>
                        </label>
                        <label className={`radio-card flex-1 ${symptomPresent === false ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                          <input
                            type="radio"
                            name={`${q.id}-present`}
                            checked={symptomPresent === false}
                            onChange={() => handleSymptomPresentToggle('hyperactivityImpulsivity', q.id, false)}
                            className="sr-only"
                          />
                          <div className="radio-indicator mr-3" />
                          <span className="flex-1 text-sm font-medium text-gray-900">No</span>
                        </label>
                      </div>
                    </div>

                    {/* Examples checkboxes - only show if symptom present */}
                    {symptomPresent && (
                      <div className="mb-4 pl-4 border-l-2 border-blue-200">
                        <p className="text-sm font-medium text-gray-700 mb-3">Check all examples that apply:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.examples.map((example) => (
                            <label key={example.id} className="flex items-start p-2 hover:bg-gray-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedExamples.includes(example.id)}
                                onChange={() => handleExampleToggle('hyperactivityImpulsivity', q.id, example.id)}
                                className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{example.text}</span>
                            </label>
                          ))}
                        </div>

                        {/* Other field */}
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Other (please specify):</label>
                          <input
                            type="text"
                            value={otherText}
                            onChange={(e) => handleOtherTextChange('hyperactivityImpulsivity', q.id, e.target.value)}
                            placeholder="Describe other examples..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {/* Childhood follow-up - always show */}
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-3">
                        And did you experience similar symptoms as a child? (Aged 7-12)
                      </p>
                      <div className="flex gap-4">
                        <label className={`radio-card flex-1 ${childhoodPresent === true ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                          <input
                            type="radio"
                            name={`hyperactivityImpulsivity-${q.id}-childhood`}
                            checked={childhoodPresent === true}
                            onChange={() => handleChildhoodToggle('hyperactivityImpulsivity', q.id, true)}
                            className="sr-only"
                          />
                          <div className="radio-indicator mr-3" />
                          <span className="flex-1 text-sm font-medium text-gray-900">Yes</span>
                        </label>
                        <label className={`radio-card flex-1 ${childhoodPresent === false ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                          <input
                            type="radio"
                            name={`hyperactivityImpulsivity-${q.id}-childhood`}
                            checked={childhoodPresent === false}
                            onChange={() => handleChildhoodToggle('hyperactivityImpulsivity', q.id, false)}
                            className="sr-only"
                          />
                          <div className="radio-indicator mr-3" />
                          <span className="flex-1 text-sm font-medium text-gray-900">No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Supplement - Criterion A */}
            <div className="mb-12 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Supplement Questions (Criterion A)</h3>

              <div className="mb-6">
                <p className="text-base font-medium text-gray-900 mb-3">{divaSupplementQuestions.adult}</p>
                <div className="flex gap-4">
                  <label className={`radio-card flex-1 ${divaAnswers.supplement?.adultMoreThanOthers === true ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                    <input
                      type="radio"
                      name="supplement-adult"
                      checked={divaAnswers.supplement?.adultMoreThanOthers === true}
                      onChange={() => setDivaAnswers({
                        ...divaAnswers,
                        supplement: { ...divaAnswers.supplement, adultMoreThanOthers: true },
                      })}
                      className="sr-only"
                    />
                    <div className="radio-indicator mr-3" />
                    <span className="flex-1 text-sm font-medium text-gray-900">Yes</span>
                  </label>
                  <label className={`radio-card flex-1 ${divaAnswers.supplement?.adultMoreThanOthers === false ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                    <input
                      type="radio"
                      name="supplement-adult"
                      checked={divaAnswers.supplement?.adultMoreThanOthers === false}
                      onChange={() => setDivaAnswers({
                        ...divaAnswers,
                        supplement: { ...divaAnswers.supplement, adultMoreThanOthers: false },
                      })}
                      className="sr-only"
                    />
                    <div className="radio-indicator mr-3" />
                    <span className="flex-1 text-sm font-medium text-gray-900">No</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="text-base font-medium text-gray-900 mb-3">{divaSupplementQuestions.childhood}</p>
                <div className="flex gap-4">
                  <label className={`radio-card flex-1 ${divaAnswers.supplement?.childhoodMoreThanOthers === true ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                    <input
                      type="radio"
                      name="supplement-childhood"
                      checked={divaAnswers.supplement?.childhoodMoreThanOthers === true}
                      onChange={() => setDivaAnswers({
                        ...divaAnswers,
                        supplement: { ...divaAnswers.supplement, childhoodMoreThanOthers: true },
                      })}
                      className="sr-only"
                    />
                    <div className="radio-indicator mr-3" />
                    <span className="flex-1 text-sm font-medium text-gray-900">Yes</span>
                  </label>
                  <label className={`radio-card flex-1 ${divaAnswers.supplement?.childhoodMoreThanOthers === false ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                    <input
                      type="radio"
                      name="supplement-childhood"
                      checked={divaAnswers.supplement?.childhoodMoreThanOthers === false}
                      onChange={() => setDivaAnswers({
                        ...divaAnswers,
                        supplement: { ...divaAnswers.supplement, childhoodMoreThanOthers: false },
                      })}
                      className="sr-only"
                    />
                    <div className="radio-indicator mr-3" />
                    <span className="flex-1 text-sm font-medium text-gray-900">No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Criterion B */}
            <div className="mb-12 p-6 bg-amber-50 rounded-lg border-2 border-amber-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Criterion B - Age of Onset</h3>

              <div className="mb-4">
                <p className="text-base font-medium text-gray-900 mb-3">{divaCriterionB.question}</p>
                <div className="flex gap-4">
                  <label className={`radio-card flex-1 ${divaAnswers.criterionB?.alwaysHadSymptoms === true ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                    <input
                      type="radio"
                      name="criterion-b"
                      checked={divaAnswers.criterionB?.alwaysHadSymptoms === true}
                      onChange={() => setDivaAnswers({
                        ...divaAnswers,
                        criterionB: { alwaysHadSymptoms: true, ageOfOnset: undefined },
                      })}
                      className="sr-only"
                    />
                    <div className="radio-indicator mr-3" />
                    <span className="flex-1 text-sm font-medium text-gray-900">Yes</span>
                  </label>
                  <label className={`radio-card flex-1 ${divaAnswers.criterionB?.alwaysHadSymptoms === false ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                    <input
                      type="radio"
                      name="criterion-b"
                      checked={divaAnswers.criterionB?.alwaysHadSymptoms === false}
                      onChange={() => setDivaAnswers({
                        ...divaAnswers,
                        criterionB: { ...divaAnswers.criterionB, alwaysHadSymptoms: false },
                      })}
                      className="sr-only"
                    />
                    <div className="radio-indicator mr-3" />
                    <span className="flex-1 text-sm font-medium text-gray-900">No</span>
                  </label>
                </div>
              </div>

              {divaAnswers.criterionB?.alwaysHadSymptoms === false && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {divaCriterionB.followUp}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={divaAnswers.criterionB?.ageOfOnset || ''}
                    onChange={(e) => setDivaAnswers({
                      ...divaAnswers,
                      criterionB: { ...divaAnswers.criterionB, ageOfOnset: parseInt(e.target.value) || undefined },
                    })}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Age"
                  />
                </div>
              )}
            </div>

            {/* Criterion C - Impairment */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-primary-600">
                Criterion C - Functional Impairment
              </h3>
              <p className="text-gray-600 mb-6">
                In which areas do you have / have you had problems with these symptoms? Check all that apply in each category.
              </p>

              {/* Work/Education */}
              <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">{divaCriterionC.workEducation.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {divaCriterionC.workEducation.examples.map((example) => (
                    <label key={example.id} className="flex items-start p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={divaAnswers.criterionC?.workEducation?.includes(example.id)}
                        onChange={() => handleCriterionCToggle('workEducation', example.id)}
                        className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{example.text}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other (please specify):</label>
                  <input
                    type="text"
                    value={divaAnswers.criterionC?.workEducationOther || ''}
                    onChange={(e) => setDivaAnswers({
                      ...divaAnswers,
                      criterionC: { ...divaAnswers.criterionC, workEducationOther: e.target.value },
                    })}
                    placeholder="Describe other work/education problems..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Relationship/Family */}
              <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">{divaCriterionC.relationship.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {divaCriterionC.relationship.examples.map((example) => (
                    <label key={example.id} className="flex items-start p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={divaAnswers.criterionC?.relationship?.includes(example.id)}
                        onChange={() => handleCriterionCToggle('relationship', example.id)}
                        className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{example.text}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other (please specify):</label>
                  <input
                    type="text"
                    value={divaAnswers.criterionC?.relationshipOther || ''}
                    onChange={(e) => setDivaAnswers({
                      ...divaAnswers,
                      criterionC: { ...divaAnswers.criterionC, relationshipOther: e.target.value },
                    })}
                    placeholder="Describe other relationship problems..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Social Contacts */}
              <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">{divaCriterionC.socialContacts.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {divaCriterionC.socialContacts.examples.map((example) => (
                    <label key={example.id} className="flex items-start p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={divaAnswers.criterionC?.socialContacts?.includes(example.id)}
                        onChange={() => handleCriterionCToggle('socialContacts', example.id)}
                        className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{example.text}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other (please specify):</label>
                  <input
                    type="text"
                    value={divaAnswers.criterionC?.socialContactsOther || ''}
                    onChange={(e) => setDivaAnswers({
                      ...divaAnswers,
                      criterionC: { ...divaAnswers.criterionC, socialContactsOther: e.target.value },
                    })}
                    placeholder="Describe other social contact problems..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Self-Confidence */}
              <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">{divaCriterionC.selfConfidence.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {divaCriterionC.selfConfidence.examples.map((example) => (
                    <label key={example.id} className="flex items-start p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={divaAnswers.criterionC?.selfConfidence?.includes(example.id)}
                        onChange={() => handleCriterionCToggle('selfConfidence', example.id)}
                        className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{example.text}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other (please specify):</label>
                  <input
                    type="text"
                    value={divaAnswers.criterionC?.selfConfidenceOther || ''}
                    onChange={(e) => setDivaAnswers({
                      ...divaAnswers,
                      criterionC: { ...divaAnswers.criterionC, selfConfidenceOther: e.target.value },
                    })}
                    placeholder="Describe other self-confidence problems..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'Review':
        return (
          <div>
            <div className="section-header">
              <h2 className="text-2xl font-bold text-gray-900">Review Your Assessment</h2>
              <p className="text-gray-600 mt-2">
                Please review the information below before submitting
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-900">
                      Assessment Complete
                    </h3>
                    <p className="mt-2 text-sm text-green-800">
                      You have completed all sections of the assessment. Click Submit to
                      generate your comprehensive report.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Completion Status</h3>
                <ul className="space-y-2">
                  {steps.slice(0, -1).map((step, idx) => {
                    const stepNum = idx + 1;
                    const completed = stepNum < currentStep || isStepComplete(stepNum);
                    return (
                      <li key={idx} className="flex items-center">
                        {completed ? (
                          <svg
                            className="h-5 w-5 text-green-500 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5 text-yellow-500 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <span className="text-gray-700">{step}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  What happens next?
                </h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Your responses will be scored using validated clinical algorithms</li>
                  <li>A comprehensive report will be generated for your GP</li>
                  <li>
                    You can download and print the report to take to your GP appointment
                  </li>
                  <li>The report includes recommendations for specialist referral if appropriate</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Adult ADHD Assessment</h1>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            currentStep={currentStep}
            totalSteps={steps.length}
            steps={steps}
          />

          {/* Form Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="btn-secondary"
            >
              Back
            </button>

            {currentStep < steps.length ? (
              steps[currentStep - 1] !== 'Decision' && (
                <button
                  onClick={handleNext}
                  disabled={!isStepComplete(currentStep)}
                  className="btn-primary"
                >
                  Next
                </button>
              )
            ) : (
              <button
                onClick={handleSubmit}
                className="btn-primary"
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
