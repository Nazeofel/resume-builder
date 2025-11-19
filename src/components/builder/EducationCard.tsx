'use client';

import { Education } from '@/stores/builder';
import { AIAssistButton } from '@/components/builder';

interface EducationCardProps {
  education: Education;
  onUpdate: (field: keyof Education, value: string) => void;
  onDelete: () => void;
  index: number;
}

export function EducationCard({ education, onUpdate, onDelete, index }: EducationCardProps) {
  return (
    <div className="p-6 bg-white/50 rounded-lg border border-border-color/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-text-main">Education {index + 1}</h3>
        <button
          onClick={onDelete}
          className="text-text-subtle hover:text-primary transition-colors"
          aria-label={`Delete education ${index + 1}`}
        >
          <span className="material-symbols-rounded">delete</span>
        </button>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-6">
        {/* Row 1: Degree & Field of Study */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="min-w-40 flex-1">
            <label className="block text-sm font-medium text-text-main mb-2">
              Degree
            </label>
            <input
              type="text"
              value={education.degree}
              onChange={(e) => onUpdate('degree', e.target.value)}
              placeholder="e.g., Master of Business Administration (MBA)"
              className="w-full form-input"
            />
          </div>
          <div className="min-w-40 flex-1">
            <label className="block text-sm font-medium text-text-main mb-2">
              Field of Study
            </label>
            <input
              type="text"
              value={education.fieldOfStudy || ''}
              onChange={(e) => onUpdate('fieldOfStudy', e.target.value)}
              placeholder="e.g., Business Administration"
              className="w-full form-input"
            />
          </div>
        </div>

        {/* Row 2: School/University */}
        <div className="relative">
          <label className="block text-sm font-medium text-text-main mb-2">
            School/University
          </label>
          <input
            type="text"
            value={education.school}
            onChange={(e) => onUpdate('school', e.target.value)}
            placeholder="e.g., Stanford University"
            className="w-full form-input"
          />
          <AIAssistButton
            onClick={() => {}}
            className="absolute top-2 right-2"
          />
        </div>

        {/* Row 3: Start Date, End Date, and GPA */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-main mb-2">
              Start Date
            </label>
            <input
              type="text"
              value={education.startDate}
              onChange={(e) => onUpdate('startDate', e.target.value)}
              placeholder="e.g., 2014"
              className="w-full form-input"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-main mb-2">
              End Date
            </label>
            <input
              type="text"
              value={education.endDate}
              onChange={(e) => onUpdate('endDate', e.target.value)}
              placeholder="e.g., 2016 or Present"
              className="w-full form-input"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-main mb-2">
              GPA (Optional)
            </label>
            <input
              type="text"
              value={education.gpa || ''}
              onChange={(e) => onUpdate('gpa', e.target.value)}
              placeholder="e.g., 3.8"
              className="w-full form-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
