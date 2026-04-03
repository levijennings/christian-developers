import React, { useState } from 'react';
import Input from '../ui/Input';
import { ChevronDown } from 'lucide-react';

export interface JobFiltersProps {
  onFilterChange: (filters: {
    jobTypes: string[];
    experienceLevel: string[];
    locationTypes: string[];
    techStack: string[];
    salaryRange: [number, number];
  }) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ onFilterChange }) => {
  const [expanded, setExpanded] = useState<string | null>('job-type');
  const [filters, setFilters] = useState({
    jobTypes: [] as string[],
    experienceLevel: [] as string[],
    locationTypes: [] as string[],
    techStack: [] as string[],
    salaryRange: [0, 200000] as [number, number],
  });

  const handleJobTypeChange = (type: string) => {
    const updated = filters.jobTypes.includes(type)
      ? filters.jobTypes.filter((t) => t !== type)
      : [...filters.jobTypes, type];
    const newFilters = { ...filters, jobTypes: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleExperienceChange = (level: string) => {
    const updated = filters.experienceLevel.includes(level)
      ? filters.experienceLevel.filter((l) => l !== level)
      : [...filters.experienceLevel, level];
    const newFilters = { ...filters, experienceLevel: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLocationChange = (type: string) => {
    const updated = filters.locationTypes.includes(type)
      ? filters.locationTypes.filter((t) => t !== type)
      : [...filters.locationTypes, type];
    const newFilters = { ...filters, locationTypes: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSalaryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    position: 'min' | 'max'
  ) => {
    const value = parseInt(e.target.value);
    const newRange: [number, number] =
      position === 'min'
        ? [value, filters.salaryRange[1]]
        : [filters.salaryRange[0], value];
    const newFilters = { ...filters, salaryRange: newRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const FilterSection = ({
    title,
    id,
    children,
  }: {
    title: string;
    id: string;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setExpanded(expanded === id ? null : id)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            expanded === id ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expanded === id && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );

  const CheckboxGroup = ({
    options,
    values,
    onChange,
  }: {
    options: { label: string; value: string }[];
    values: string[];
    onChange: (value: string) => void;
  }) => (
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={values.includes(option.value)}
            onChange={() => onChange(option.value)}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <FilterSection title="Job Type" id="job-type">
        <CheckboxGroup
          options={[
            { label: 'Full-time', value: 'full-time' },
            { label: 'Contract', value: 'contract' },
            { label: 'Freelance', value: 'freelance' },
          ]}
          values={filters.jobTypes}
          onChange={handleJobTypeChange}
        />
      </FilterSection>

      <FilterSection title="Experience Level" id="experience">
        <CheckboxGroup
          options={[
            { label: 'Junior', value: 'junior' },
            { label: 'Mid-level', value: 'mid' },
            { label: 'Senior', value: 'senior' },
            { label: 'Lead', value: 'lead' },
          ]}
          values={filters.experienceLevel}
          onChange={handleExperienceChange}
        />
      </FilterSection>

      <FilterSection title="Location Type" id="location">
        <CheckboxGroup
          options={[
            { label: 'Remote', value: 'remote' },
            { label: 'On-site', value: 'onsite' },
            { label: 'Hybrid', value: 'hybrid' },
          ]}
          values={filters.locationTypes}
          onChange={handleLocationChange}
        />
      </FilterSection>

      <FilterSection title="Salary Range" id="salary">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Min: ${(filters.salaryRange[0] / 1000).toFixed(0)}k
            </label>
            <input
              type="range"
              min="0"
              max="200000"
              step="10000"
              value={filters.salaryRange[0]}
              onChange={(e) => handleSalaryChange(e, 'min')}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Max: ${(filters.salaryRange[1] / 1000).toFixed(0)}k
            </label>
            <input
              type="range"
              min="0"
              max="200000"
              step="10000"
              value={filters.salaryRange[1]}
              onChange={(e) => handleSalaryChange(e, 'max')}
              className="w-full"
            />
          </div>
        </div>
      </FilterSection>
    </div>
  );
};

export default JobFilters;
