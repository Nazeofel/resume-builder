'use client';

import { Experience } from '@/stores/builder';
import { BuilderSelect, BuilderTextarea, AIAssistButton, SelectOption } from '@/components/builder';

interface ExperienceCardProps {
  experience: Experience;
  onUpdate: (field: keyof Experience, value: string) => void;
  onDelete: () => void;
  index: number;
}

const JOB_TITLE_OPTIONS: SelectOption[] = [
  { value: 'Lead Product Manager', label: 'Lead Product Manager' },
  { value: 'Senior Product Manager', label: 'Senior Product Manager' },
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'Software Engineer', label: 'Software Engineer' },
  { value: 'Senior Software Engineer', label: 'Senior Software Engineer' },
  { value: 'UX/UI Designer', label: 'UX/UI Designer' },
  { value: 'Data Scientist', label: 'Data Scientist' },
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'Marketing Manager', label: 'Marketing Manager' },
  { value: 'Sales Manager', label: 'Sales Manager' },
  { value: 'Other', label: 'Other' },
];

export function ExperienceCard({ experience, onUpdate, onDelete, index }: ExperienceCardProps) {
  return (
    <div className="p-6 bg-white/50 rounded-lg border border-border-color/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-text-main">Experience {index + 1}</h3>
        <button
          onClick={onDelete}
          className="text-text-subtle hover:text-primary transition-colors"
          aria-label={`Delete experience ${index + 1}`}
        >
          <span className="material-symbols-rounded">delete</span>
        </button>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-6">
        {/* Row 1: Job Title & Company */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="min-w-40 flex-1">
            <BuilderSelect
              label="Job Title"
              value={experience.jobTitle}
              onValueChange={(value) => onUpdate('jobTitle', value)}
              options={JOB_TITLE_OPTIONS}
              placeholder="Select job title"
            />
          </div>
          <div className="min-w-40 flex-1 relative">
            <label className="block text-sm font-medium text-text-main mb-2">
              Company
            </label>
            <input
              type="text"
              value={experience.company}
              onChange={(e) => onUpdate('company', e.target.value)}
              placeholder="e.g., Google"
              className="w-full form-input"
            />
            <AIAssistButton
              onClick={() => {}}
              className="absolute top-2 right-2"
            />
          </div>
        </div>

        {/* Row 2: Location & Dates */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="min-w-40 flex-1 relative">
            <label className="block text-sm font-medium text-text-main mb-2">
              Location
            </label>
            <input
              type="text"
              value={experience.location}
              onChange={(e) => onUpdate('location', e.target.value)}
              placeholder="e.g., San Francisco, CA"
              className="w-full form-input"
            />
            <AIAssistButton
              onClick={() => {}}
              className="absolute top-2 right-2"
            />
          </div>
          <div className="min-w-40 flex-1 flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-text-main mb-2">
                Start Date
              </label>
              <input
                type="text"
                value={experience.startDate}
                onChange={(e) => onUpdate('startDate', e.target.value)}
                placeholder="MM/YYYY"
                className="w-full form-input"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-text-main mb-2">
                End Date
              </label>
              <input
                type="text"
                value={experience.endDate}
                onChange={(e) => onUpdate('endDate', e.target.value)}
                placeholder="MM/YYYY or Present"
                className="w-full form-input"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Description */}
        <div>
          <BuilderTextarea
            id={`experience-description-${experience.id}`}
            label="Description"
            value={experience.description}
            onChange={(e) => onUpdate('description', e.target.value)}
            placeholder="Describe your responsibilities and achievements..."
            rows={4}
            showAIButton={true}
            onAIClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
