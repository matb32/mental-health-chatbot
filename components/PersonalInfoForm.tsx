'use client';

import { PersonalInformation } from '@/types/assessment';

interface PersonalInfoFormProps {
  data: PersonalInformation;
  onChange: (data: PersonalInformation) => void;
}

export default function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const handleChange = (field: keyof PersonalInformation, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="section-header">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-gray-600 mt-2">
          This information will be included in your report to your GP
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="label-text">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="label-text">
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            value={data.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="gender" className="label-text">
            Gender *
          </label>
          <select
            id="gender"
            value={data.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="email" className="label-text">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="label-text">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="nhsNumber" className="label-text">
            NHS Number (optional)
          </label>
          <input
            type="text"
            id="nhsNumber"
            value={data.nhsNumber || ''}
            onChange={(e) => handleChange('nhsNumber', e.target.value)}
            className="input-field"
            placeholder="e.g., 123 456 7890"
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="label-text">
          Full Address *
        </label>
        <textarea
          id="address"
          value={data.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className="input-field"
          rows={3}
          required
        />
      </div>

      <div className="section-header mt-8">
        <h3 className="text-xl font-bold text-gray-900">GP Information</h3>
        <p className="text-gray-600 mt-2">
          The report will be addressed to your GP
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="gpName" className="label-text">
            GP Name *
          </label>
          <input
            type="text"
            id="gpName"
            value={data.gpName}
            onChange={(e) => handleChange('gpName', e.target.value)}
            className="input-field"
            placeholder="Dr John Smith"
            required
          />
        </div>

        <div>
          <label htmlFor="gpPractice" className="label-text">
            GP Practice Name *
          </label>
          <input
            type="text"
            id="gpPractice"
            value={data.gpPractice}
            onChange={(e) => handleChange('gpPractice', e.target.value)}
            className="input-field"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="gpAddress" className="label-text">
          GP Practice Address *
        </label>
        <textarea
          id="gpAddress"
          value={data.gpAddress}
          onChange={(e) => handleChange('gpAddress', e.target.value)}
          className="input-field"
          rows={3}
          required
        />
      </div>
    </div>
  );
}
