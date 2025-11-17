'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CompleteAssessment, AssessmentResults } from '@/types/assessment';
import {
  calculateASRSScore,
  calculateGAD7Score,
  calculatePHQ9Score,
  calculateDIVAScore,
  calculateOverallAssessment,
} from '@/utils/scoring';
import { generateGPReport, generateHTMLReport } from '@/utils/report-generator';

export default function ResultsPage() {
  const router = useRouter();
  const [assessment, setAssessment] = useState<CompleteAssessment | null>(null);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [showFullReport, setShowFullReport] = useState(false);

  useEffect(() => {
    // Load assessment from localStorage
    const stored = localStorage.getItem('assessment');
    if (!stored) {
      router.push('/');
      return;
    }

    const assessmentData: CompleteAssessment = JSON.parse(stored);
    setAssessment(assessmentData);

    // Calculate scores
    const asrsScore = calculateASRSScore(assessmentData.asrs);
    const gad7Score = calculateGAD7Score(assessmentData.gad7);
    const phq9Score = calculatePHQ9Score(assessmentData.phq9);
    const divaScore = calculateDIVAScore(assessmentData.diva);
    const overallRecommendation = calculateOverallAssessment(
      asrsScore,
      gad7Score,
      phq9Score,
      divaScore
    );

    setResults({
      asrs: asrsScore,
      gad7: gad7Score,
      phq9: phq9Score,
      diva: divaScore,
      overallRecommendation,
    });
  }, [router]);

  const handleDownloadReport = () => {
    if (!assessment || !results) return;

    const report = generateGPReport(assessment, results);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ADHD-Assessment-${assessment.personalInfo.fullName.replace(/\s/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintReport = () => {
    if (!assessment || !results) return;

    const htmlReport = generateHTMLReport(assessment, results);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlReport);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  if (!assessment || !results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Assessment Complete
            </h1>
            <p className="text-lg text-gray-600">
              Your comprehensive ADHD assessment results
            </p>
          </div>

          {/* Urgent Alert */}
          {results.phq9.requiresUrgentAttention && (
            <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-bold text-red-900">
                    URGENT: Immediate Support Needed
                  </h3>
                  <p className="mt-2 text-sm text-red-800">
                    Your assessment indicates thoughts of self-harm. Please contact:
                  </p>
                  <ul className="mt-2 text-sm text-red-800 space-y-1">
                    <li><strong>Emergency Services:</strong> 999</li>
                    <li><strong>Samaritans:</strong> 116 123 (24/7)</li>
                    <li><strong>Crisis Text Line:</strong> Text SHOUT to 85258</li>
                  </ul>
                  <p className="mt-2 text-sm font-medium text-red-900">
                    Please seek immediate help from your GP or local mental health crisis team.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* ASRS Score */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                ASRS - ADHD Screening
              </h2>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Part A (Screening)</span>
                  <span className="text-lg font-semibold">
                    {results.asrs.partAScore}/24
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(results.asrs.partAScore / 24) * 100}%` }}
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Score</span>
                  <span className="text-lg font-semibold">
                    {results.asrs.totalScore}/72
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(results.asrs.totalScore / 72) * 100}%` }}
                  />
                </div>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  results.asrs.likelyADHD
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <p className="text-sm font-medium">
                  {results.asrs.likelyADHD
                    ? '⚠️ Positive screen for ADHD'
                    : 'ℹ️ Screen below threshold'}
                </p>
              </div>
            </div>

            {/* DIVA Score */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                DIVA - DSM-5 Criteria
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Childhood Inattention</span>
                    <span className="font-semibold">
                      {results.diva.childhoodInattentionCount}/9
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        results.diva.childhoodInattentionCount >= 5
                          ? 'bg-green-600'
                          : 'bg-gray-400'
                      }`}
                      style={{
                        width: `${(results.diva.childhoodInattentionCount / 9) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Current Inattention</span>
                    <span className="font-semibold">
                      {results.diva.adultInattentionCount}/9
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        results.diva.adultInattentionCount >= 5
                          ? 'bg-green-600'
                          : 'bg-gray-400'
                      }`}
                      style={{
                        width: `${(results.diva.adultInattentionCount / 9) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Childhood Hyperactivity</span>
                    <span className="font-semibold">
                      {results.diva.childhoodHyperactivityCount}/9
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        results.diva.childhoodHyperactivityCount >= 5
                          ? 'bg-green-600'
                          : 'bg-gray-400'
                      }`}
                      style={{
                        width: `${(results.diva.childhoodHyperactivityCount / 9) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Current Hyperactivity</span>
                    <span className="font-semibold">
                      {results.diva.adultHyperactivityCount}/9
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        results.diva.adultHyperactivityCount >= 5
                          ? 'bg-green-600'
                          : 'bg-gray-400'
                      }`}
                      style={{
                        width: `${(results.diva.adultHyperactivityCount / 9) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                className={`mt-4 p-3 rounded-lg ${
                  results.diva.meetsDSMCriteria
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <p className="text-sm font-medium">
                  {results.diva.meetsDSMCriteria
                    ? `✓ Meets DSM-5 criteria: ${results.diva.predominantType.toUpperCase()}`
                    : 'Does not meet full DSM-5 criteria'}
                </p>
              </div>
            </div>

            {/* GAD-7 Score */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                GAD-7 - Anxiety
              </h2>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Score</span>
                  <span className="text-lg font-semibold">
                    {results.gad7.totalScore}/21
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(results.gad7.totalScore / 21) * 100}%` }}
                  />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                <p className="text-sm font-medium mb-1">
                  Severity: {results.gad7.severity.toUpperCase()}
                </p>
                <p className="text-xs text-gray-600">
                  {results.gad7.interpretation}
                </p>
              </div>
            </div>

            {/* PHQ-9 Score */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                PHQ-9 - Depression
              </h2>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Score</span>
                  <span className="text-lg font-semibold">
                    {results.phq9.totalScore}/27
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(results.phq9.totalScore / 27) * 100}%` }}
                  />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                <p className="text-sm font-medium mb-1">
                  Severity: {results.phq9.severity.toUpperCase()}
                </p>
                <p className="text-xs text-gray-600">
                  {results.phq9.interpretation}
                </p>
              </div>
            </div>
          </div>

          {/* Interpretations */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Clinical Interpretation
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ASRS Screening Results
                </h3>
                <p className="text-gray-700">{results.asrs.interpretation}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  DIVA Diagnostic Assessment
                </h3>
                <p className="text-gray-700">{results.diva.interpretation}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Overall Recommendations
                </h3>
                <div className="prose max-w-none">
                  {results.overallRecommendation.split('\n\n').map((para, idx) => (
                    <p key={idx} className="text-gray-700 mb-3">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Next Steps
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold mr-4">
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Download or Print Your Report
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Generate your comprehensive medical report addressed to your GP
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold mr-4">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Book an Appointment with Your GP
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Contact your GP surgery to schedule an appointment to discuss these results
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold mr-4">
                  3
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Request a Specialist Referral
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Ask your GP to refer you to Adult Psychiatry services for comprehensive
                    ADHD assessment
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleDownloadReport}
                className="btn-primary flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Report (TXT)
              </button>

              <button
                onClick={handlePrintReport}
                className="btn-secondary flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Report
              </button>

              <button
                onClick={() => setShowFullReport(!showFullReport)}
                className="btn-secondary"
              >
                {showFullReport ? 'Hide' : 'View'} Full Report
              </button>
            </div>
          </div>

          {/* Full Report Preview */}
          {showFullReport && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Full Medical Report Preview
              </h2>
              <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-50 p-6 rounded-lg overflow-x-auto">
                {generateGPReport(assessment, results)}
              </pre>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            <p>
              This assessment is a screening tool and does not constitute a clinical diagnosis.
            </p>
            <p className="mt-2">
              Please consult with your GP or a qualified healthcare professional for proper
              evaluation and diagnosis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
