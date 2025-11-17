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
  divaChildhoodInattentionQuestions,
  divaChildhoodHyperactivityQuestions,
  divaAdultInattentionQuestions,
  divaAdultHyperactivityQuestions,
  divaResponseOptions,
} from '@/data/diva-questions';

const steps = [
  'Personal Info',
  'History',
  'ASRS',
  'GAD-7',
  'PHQ-9',
  'DIVA',
  'Review',
];

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

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

  const [asrsAnswers, setAsrsAnswers] = useState<Partial<ASRSAnswers>>({});
  const [gad7Answers, setGad7Answers] = useState<Partial<GAD7Answers>>({});
  const [phq9Answers, setPhq9Answers] = useState<Partial<PHQ9Answers>>({});
  const [divaAnswers, setDivaAnswers] = useState<Partial<DIVAAnswers>>({
    childhoodInattention: {},
    childhoodHyperactivity: {},
    adultInattention: {},
    adultHyperactivity: {},
  });

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

    // Store in localStorage temporarily (in production, this would go to a backend)
    localStorage.setItem('assessment', JSON.stringify(assessment));

    // Navigate to results page
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
        return Object.keys(asrsAnswers).length === 18;
      case 4:
        return Object.keys(gad7Answers).length === 7;
      case 5:
        return Object.keys(phq9Answers).length === 9;
      case 6:
        return (
          Object.keys(divaAnswers.childhoodInattention || {}).length === 9 &&
          Object.keys(divaAnswers.childhoodHyperactivity || {}).length === 9 &&
          Object.keys(divaAnswers.adultInattention || {}).length === 9 &&
          Object.keys(divaAnswers.adultHyperactivity || {}).length === 9
        );
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm
            data={personalInfo}
            onChange={setPersonalInfo}
          />
        );

      case 2:
        return (
          <HistoryForm
            mentalHealth={mentalHealthHistory}
            familyHistory={familyHistory}
            onMentalHealthChange={setMentalHealthHistory}
            onFamilyHistoryChange={setFamilyHistory}
          />
        );

      case 3:
        return (
          <div>
            <div className="section-header">
              <h2 className="text-2xl font-bold text-gray-900">
                ASRS - Adult ADHD Self-Report Scale
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

      case 4:
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

      case 5:
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

      case 6:
        return (
          <div>
            <div className="section-header">
              <h2 className="text-2xl font-bold text-gray-900">
                DIVA 2.0 - Diagnostic Interview for ADHD
              </h2>
              <p className="text-gray-600 mt-2">
                This structured interview assesses ADHD symptoms in childhood and adulthood
                according to DSM-5 criteria.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-primary-600">
                Part A: Childhood Symptoms (Before Age 12)
              </h3>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Inattention</h4>
              {divaChildhoodInattentionQuestions.map((q) => (
                <RadioGroup
                  key={q.id}
                  question={q.text}
                  examples={q.examples}
                  options={divaResponseOptions}
                  value={(divaAnswers.childhoodInattention as any)?.[q.id]}
                  onChange={(value) =>
                    setDivaAnswers({
                      ...divaAnswers,
                      childhoodInattention: {
                        ...divaAnswers.childhoodInattention,
                        [q.id]: value,
                      },
                    })
                  }
                  name={`childhood-inattention-${q.id}`}
                />
              ))}

              <h4 className="text-lg font-semibold text-gray-800 mb-4 mt-8">
                Hyperactivity & Impulsivity
              </h4>
              {divaChildhoodHyperactivityQuestions.map((q) => (
                <RadioGroup
                  key={q.id}
                  question={q.text}
                  examples={q.examples}
                  options={divaResponseOptions}
                  value={(divaAnswers.childhoodHyperactivity as any)?.[q.id]}
                  onChange={(value) =>
                    setDivaAnswers({
                      ...divaAnswers,
                      childhoodHyperactivity: {
                        ...divaAnswers.childhoodHyperactivity,
                        [q.id]: value,
                      },
                    })
                  }
                  name={`childhood-hyperactivity-${q.id}`}
                />
              ))}
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-primary-600">
                Part B: Current Adult Symptoms
              </h3>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Inattention</h4>
              {divaAdultInattentionQuestions.map((q) => (
                <RadioGroup
                  key={q.id}
                  question={q.text}
                  examples={q.examples}
                  options={divaResponseOptions}
                  value={(divaAnswers.adultInattention as any)?.[q.id]}
                  onChange={(value) =>
                    setDivaAnswers({
                      ...divaAnswers,
                      adultInattention: {
                        ...divaAnswers.adultInattention,
                        [q.id]: value,
                      },
                    })
                  }
                  name={`adult-inattention-${q.id}`}
                />
              ))}

              <h4 className="text-lg font-semibold text-gray-800 mb-4 mt-8">
                Hyperactivity & Impulsivity
              </h4>
              {divaAdultHyperactivityQuestions.map((q) => (
                <RadioGroup
                  key={q.id}
                  question={q.text}
                  examples={q.examples}
                  options={divaResponseOptions}
                  value={(divaAnswers.adultHyperactivity as any)?.[q.id]}
                  onChange={(value) =>
                    setDivaAnswers({
                      ...divaAnswers,
                      adultHyperactivity: {
                        ...divaAnswers.adultHyperactivity,
                        [q.id]: value,
                      },
                    })
                  }
                  name={`adult-hyperactivity-${q.id}`}
                />
              ))}
            </div>
          </div>
        );

      case 7:
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
                  {steps.slice(0, -1).map((step, idx) => (
                    <li key={idx} className="flex items-center">
                      {isStepComplete(idx + 1) ? (
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
                  ))}
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
              <button
                onClick={handleNext}
                disabled={!isStepComplete(currentStep)}
                className="btn-primary"
              >
                Next
              </button>
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
