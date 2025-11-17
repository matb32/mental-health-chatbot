'use client';

import { MentalHealthHistory, FamilyHistory } from '@/types/assessment';

interface HistoryFormProps {
  mentalHealth: MentalHealthHistory;
  familyHistory: FamilyHistory;
  onMentalHealthChange: (data: MentalHealthHistory) => void;
  onFamilyHistoryChange: (data: FamilyHistory) => void;
}

export default function HistoryForm({
  mentalHealth,
  familyHistory,
  onMentalHealthChange,
  onFamilyHistoryChange,
}: HistoryFormProps) {
  const handleMHChange = (field: keyof MentalHealthHistory, value: any) => {
    onMentalHealthChange({ ...mentalHealth, [field]: value });
  };

  const handleFHChange = (field: keyof FamilyHistory, value: any) => {
    onFamilyHistoryChange({ ...familyHistory, [field]: value });
  };

  const handleDiagnosisToggle = (diagnosis: string) => {
    const current = mentalHealth.previousDiagnoses || [];
    if (current.includes(diagnosis)) {
      handleMHChange('previousDiagnoses', current.filter(d => d !== diagnosis));
    } else {
      handleMHChange('previousDiagnoses', [...current, diagnosis]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Mental Health History */}
      <div>
        <div className="section-header">
          <h2 className="text-2xl font-bold text-gray-900">Mental Health History</h2>
          <p className="text-gray-600 mt-2">
            Please provide information about your mental health background
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="label-text mb-3 block">
              Have you previously been diagnosed with any of the following? (Select all that apply)
            </label>
            <div className="space-y-2">
              {['ADHD', 'Anxiety Disorder', 'Depression', 'Bipolar Disorder', 'OCD', 'PTSD', 'Autism Spectrum Disorder', 'Other'].map(
                (diagnosis) => (
                  <label key={diagnosis} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(mentalHealth.previousDiagnoses || []).includes(diagnosis)}
                      onChange={() => handleDiagnosisToggle(diagnosis)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{diagnosis}</span>
                  </label>
                )
              )}
            </div>
          </div>

          <div>
            <label htmlFor="currentMedications" className="label-text">
              Current Medications (including psychiatric and other medications)
            </label>
            <textarea
              id="currentMedications"
              value={mentalHealth.currentMedications}
              onChange={(e) => handleMHChange('currentMedications', e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Please list all current medications with dosages, or write 'None'"
            />
          </div>

          <div>
            <label htmlFor="previousTreatments" className="label-text">
              Previous Mental Health Treatments (therapy, counseling, previous medications)
            </label>
            <textarea
              id="previousTreatments"
              value={mentalHealth.previousTreatments}
              onChange={(e) => handleMHChange('previousTreatments', e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Please describe any previous mental health treatments"
            />
          </div>

          <div>
            <label className="label-text mb-3 block">Substance Use</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="alcohol" className="text-sm text-gray-700">
                  Alcohol
                </label>
                <select
                  id="alcohol"
                  value={mentalHealth.substanceUse.alcohol}
                  onChange={(e) =>
                    handleMHChange('substanceUse', {
                      ...mentalHealth.substanceUse,
                      alcohol: e.target.value as any,
                    })
                  }
                  className="input-field"
                >
                  <option value="none">None</option>
                  <option value="occasional">Occasional</option>
                  <option value="regular">Regular</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>

              <div>
                <label htmlFor="tobacco" className="text-sm text-gray-700">
                  Tobacco
                </label>
                <select
                  id="tobacco"
                  value={mentalHealth.substanceUse.tobacco}
                  onChange={(e) =>
                    handleMHChange('substanceUse', {
                      ...mentalHealth.substanceUse,
                      tobacco: e.target.value as any,
                    })
                  }
                  className="input-field"
                >
                  <option value="none">None</option>
                  <option value="occasional">Occasional</option>
                  <option value="regular">Regular</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>

              <div>
                <label htmlFor="cannabis" className="text-sm text-gray-700">
                  Cannabis
                </label>
                <select
                  id="cannabis"
                  value={mentalHealth.substanceUse.cannabis}
                  onChange={(e) =>
                    handleMHChange('substanceUse', {
                      ...mentalHealth.substanceUse,
                      cannabis: e.target.value as any,
                    })
                  }
                  className="input-field"
                >
                  <option value="none">None</option>
                  <option value="occasional">Occasional</option>
                  <option value="regular">Regular</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>

              <div>
                <label htmlFor="substanceOther" className="text-sm text-gray-700">
                  Other substances
                </label>
                <input
                  type="text"
                  id="substanceOther"
                  value={mentalHealth.substanceUse.other}
                  onChange={(e) =>
                    handleMHChange('substanceUse', {
                      ...mentalHealth.substanceUse,
                      other: e.target.value,
                    })
                  }
                  className="input-field"
                  placeholder="None or specify"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="sleepPatterns" className="label-text">
              Sleep Patterns (quality, duration, difficulties)
            </label>
            <textarea
              id="sleepPatterns"
              value={mentalHealth.sleepPatterns}
              onChange={(e) => handleMHChange('sleepPatterns', e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Describe your typical sleep patterns and any difficulties"
            />
          </div>

          <div>
            <label htmlFor="significantLifeEvents" className="label-text">
              Significant Life Events or Trauma
            </label>
            <textarea
              id="significantLifeEvents"
              value={mentalHealth.significantLifeEvents}
              onChange={(e) => handleMHChange('significantLifeEvents', e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Any significant life events, trauma, or major stressors (optional)"
            />
          </div>
        </div>
      </div>

      {/* Family History */}
      <div>
        <div className="section-header">
          <h2 className="text-2xl font-bold text-gray-900">Family History</h2>
          <p className="text-gray-600 mt-2">
            Information about mental health conditions in your family
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="label-text mb-3 block">
              Has anyone in your family been diagnosed with ADHD?
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={familyHistory.adhdInFamily === true}
                  onChange={() => handleFHChange('adhdInFamily', true)}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={familyHistory.adhdInFamily === false}
                  onChange={() => handleFHChange('adhdInFamily', false)}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>

          {familyHistory.adhdInFamily && (
            <div>
              <label htmlFor="adhdRelatives" className="label-text">
                Which family members? (e.g., parent, sibling, grandparent)
              </label>
              <input
                type="text"
                id="adhdRelatives"
                value={familyHistory.adhdRelatives}
                onChange={(e) => handleFHChange('adhdRelatives', e.target.value)}
                className="input-field"
                placeholder="Relationship to you"
              />
            </div>
          )}

          <div>
            <label className="label-text mb-3 block">
              Has anyone in your family been diagnosed with anxiety disorders?
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={familyHistory.anxietyInFamily === true}
                  onChange={() => handleFHChange('anxietyInFamily', true)}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={familyHistory.anxietyInFamily === false}
                  onChange={() => handleFHChange('anxietyInFamily', false)}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>

          <div>
            <label className="label-text mb-3 block">
              Has anyone in your family been diagnosed with depression?
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={familyHistory.depressionInFamily === true}
                  onChange={() => handleFHChange('depressionInFamily', true)}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={familyHistory.depressionInFamily === false}
                  onChange={() => handleFHChange('depressionInFamily', false)}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="otherMentalHealthConditions" className="label-text">
              Other mental health conditions in the family
            </label>
            <textarea
              id="otherMentalHealthConditions"
              value={familyHistory.otherMentalHealthConditions}
              onChange={(e) => handleFHChange('otherMentalHealthConditions', e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Any other mental health conditions in your family (optional)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
