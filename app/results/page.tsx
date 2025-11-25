'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { CompleteAssessment, AssessmentResults } from '@/types/assessment';
import {
  calculateASRSScore,
  calculateGAD7Score,
  calculatePHQ9Score,
  calculateDIVAScore,
  calculateOverallAssessment,
} from '@/utils/scoring';
import { generateGPReport, generateHTMLReport } from '@/utils/report-generator';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [assessment, setAssessment] = useState<CompleteAssessment | null>(null);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

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

    // Check if payment was completed
    const paid = localStorage.getItem('reportPaid');
    if (paid === 'true') {
      setHasPaid(true);
    }
  }, [router]);

  const handlePayment = async () => {
    if (!assessment) return;

    setIsProcessing(true);

    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId: Date.now().toString(),
          email: assessment.personalInfo.email,
          fullName: assessment.personalInfo.fullName,
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe redirect error:', error);
          alert('Payment failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadReport = () => {
    if (!assessment || !results || !hasPaid) {
      setShowPaymentModal(true);
      return;
    }

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
    if (!assessment || !results || !hasPaid) {
      setShowPaymentModal(true);
      return;
    }

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

          {/* Payment Notice */}
          {!hasPaid && (
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-900">
                    Free Assessment Summary Available
                  </h3>
                  <div className="mt-2 text-sm text-blue-800">
                    <p>
                      You can view your assessment summary below for free. To download or print
                      the comprehensive GP referral report, a one-time payment of <strong>£1.00</strong> is required.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {hasPaid && (
            <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-900">
                    Payment Successful - Full Report Access Unlocked
                  </h3>
                  <p className="mt-2 text-sm text-green-800">
                    You can now download and print your comprehensive GP referral report.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Urgent Alert */}
          {results.phq9.requiresUrgentAttention && (
            <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
                </div>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* ASRS Score */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                ASRS - ADHD Screening (Part A)
              </h2>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Score</span>
                  <span className="text-lg font-semibold">
                    {results.asrs.score}/24
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(results.asrs.score / 24) * 100}%` }}
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">High Responses (Often/Very Often)</span>
                  <span className="text-lg font-semibold">
                    {results.asrs.highResponseCount}/6
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(results.asrs.highResponseCount / 6) * 100}%` }}
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
                    ? '⚠️ Positive screen for ADHD (4-6 high responses)'
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
                      {results.diva.attentionChildCount}/9
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        results.diva.attentionChildCount >= 5
                          ? 'bg-green-600'
                          : 'bg-gray-400'
                      }`}
                      style={{
                        width: `${(results.diva.attentionChildCount / 9) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Current Inattention</span>
                    <span className="font-semibold">
                      {results.diva.attentionAdultCount}/9
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        results.diva.attentionAdultCount >= 5
                          ? 'bg-green-600'
                          : 'bg-gray-400'
                      }`}
                      style={{
                        width: `${(results.diva.attentionAdultCount / 9) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Childhood Hyperactive-Impulsive</span>
                    <span className="font-semibold">
                      {results.diva.hyperactivityImpulsivityChildCount}/9
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        results.diva.hyperactivityImpulsivityChildCount >= 5
                          ? 'bg-green-600'
                          : 'bg-gray-400'
                      }`}
                      style={{
                        width: `${(results.diva.hyperactivityImpulsivityChildCount / 9) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Current Hyperactive-Impulsive</span>
                    <span className="font-semibold">
                      {results.diva.hyperactivityImpulsivityAdultCount}/9
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        results.diva.hyperactivityImpulsivityAdultCount >= 5
                          ? 'bg-green-600'
                          : 'bg-gray-400'
                      }`}
                      style={{
                        width: `${(results.diva.hyperactivityImpulsivityAdultCount / 9) * 100}%`,
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
              </div>
            </div>
          </div>

          {/* Summary Interpretation (Always Visible) */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Assessment Summary
            </h2>

            <div className="space-y-4">
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

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-6">
                <p className="text-sm text-amber-900">
                  <strong>Note:</strong> For the full comprehensive medical report with detailed
                  clinical interpretation, family history, and GP referral recommendations,
                  please purchase the complete report for £1.00.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Get Your Full GP Referral Report
            </h2>

            {!hasPaid ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    The full report includes:
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Comprehensive medical report formatted for UK GPs
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Detailed scoring and clinical interpretation
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Mental health and family history analysis
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Specific referral recommendations for Adult Psychiatry
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Evidence-based clinical references
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Download as text file or print-friendly version
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-lg border-2 border-primary-200 mb-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary-900 mb-2">£1.00</p>
                    <p className="text-sm text-gray-600">One-time payment • Secure checkout via Stripe</p>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="btn-primary w-full text-lg py-4 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Purchase Full Report - £1.00
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Secure payment processing by Stripe • Your data is safe and encrypted
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700 mb-4">
                  Thank you for your purchase! You now have full access to your comprehensive GP referral report.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleDownloadReport}
                    className="btn-primary flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Report (TXT)
                  </button>

                  <button
                    onClick={handlePrintReport}
                    className="btn-secondary flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Report
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Next Steps */}
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
                    {hasPaid ? 'Download Your Report' : 'Purchase Your Report'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {hasPaid
                      ? 'Save or print your comprehensive medical report'
                      : 'Get instant access to your complete GP referral report for £1.00'}
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
          </div>

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

      {/* Payment Modal (if needed for additional info) */}
      {showPaymentModal && !hasPaid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md">
            <h3 className="text-xl font-bold mb-4">Purchase Required</h3>
            <p className="text-gray-700 mb-6">
              To access the full GP referral report, please complete the £1.00 payment.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  handlePayment();
                }}
                className="btn-primary flex-1"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
