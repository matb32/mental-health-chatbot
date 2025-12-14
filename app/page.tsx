import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Addapt.ai
            </h1>
            <p className="text-xl text-gray-600">
              Adult ADHD Assessment Platform
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Comprehensive ADHD Assessment for Adults
            </h2>

            <div className="prose max-w-none mb-8">
              <p className="text-lg text-gray-700 mb-4">
                This assessment tool uses validated clinical screening instruments to help you
                and your GP understand whether you may have Adult ADHD. The assessment includes:
              </p>

              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>ASRS v1.1</strong> - Adult ADHD Self-Report Scale (WHO-endorsed screening tool)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>DIVA 2.0</strong> - Diagnostic Interview for ADHD in Adults (structured DSM-5 assessment)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>GAD-7</strong> - Generalized Anxiety Disorder assessment</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>PHQ-9</strong> - Patient Health Questionnaire for depression</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Mental Health & Family History</strong> - Comprehensive background assessment</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-primary-600 p-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-primary-900">What happens after completion?</h3>
                  <div className="mt-2 text-sm text-primary-800">
                    <p>
                      Upon completing this assessment, you will receive a comprehensive medical report
                      addressed to your GP. This report can be used to support a referral to Adult
                      Psychiatry services for formal ADHD diagnosis and treatment planning.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-900">Important Notice</h3>
                  <div className="mt-2 text-sm text-amber-800">
                    <p>
                      This assessment is a screening tool and does not constitute a clinical diagnosis.
                      Only a qualified healthcare professional can diagnose ADHD. This tool is designed
                      to facilitate the referral process and provide structured information to support
                      clinical decision-making.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  <strong>Time to complete:</strong> Approximately 30-45 minutes
                </p>
                <p className="text-gray-600 mb-6">
                  You can save your progress and return to complete the assessment later.
                </p>
              </div>

              <div className="flex justify-center">
                <Link
                  href="/assessment"
                  className="btn-primary inline-block text-center px-12 py-4 text-lg"
                >
                  Start Assessment
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-600">
            <p>
              All data is confidential and handled in accordance with UK GDPR regulations.
            </p>
            <p className="mt-2">
              If you are in crisis or experiencing thoughts of self-harm, please contact emergency
              services (999) or the Samaritans (116 123) immediately.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
