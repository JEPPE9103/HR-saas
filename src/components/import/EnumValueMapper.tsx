"use client";

import { useState, useEffect } from 'react';
import { FieldConfig, FieldKey } from '@/lib/importSchema';
import { suggestGenderMapping } from '@/lib/valueMap';

interface EnumValueMapperProps {
  field: FieldKey;
  config: FieldConfig;
  discoveredValues: string[];
  onMappingChange: (mapping: Record<string, string>) => void;
}

export default function EnumValueMapper({ 
  field, 
  config, 
  discoveredValues, 
  onMappingChange 
}: EnumValueMapperProps) {
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Auto-suggest mapping baserat på upptäckta värden
  useEffect(() => {
    if (!config.options || discoveredValues.length === 0) return;

    // Endast hantera gender för nu
    if (field === 'gender') {
      const autoMapping = suggestGenderMapping(discoveredValues);
      setMapping(autoMapping);
      onMappingChange(autoMapping);
    }
  }, [field, config.options, discoveredValues, onMappingChange]);

  const handleMappingChange = (discoveredValue: string, targetValue: string) => {
    const newMapping = { ...mapping, [discoveredValue]: targetValue };
    setMapping(newMapping);
    onMappingChange(newMapping);
  };

  const getMappingStatus = (discoveredValue: string): 'mapped' | 'unmapped' => {
    return mapping[discoveredValue] && mapping[discoveredValue] !== '' ? 'mapped' : 'unmapped';
  };

  if (!config.options || discoveredValues.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4 bg-[var(--muted)] border-[var(--ring)]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-[var(--text)]">
          Mappa upptäckta värden → standardvärden
        </h4>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-[var(--accent)] hover:text-[var(--accent-strong)]"
        >
          {showAdvanced ? 'Dölj' : 'Visa'} avancerat
        </button>
      </div>

      <div className="space-y-2">
        {discoveredValues.map((value) => (
          <div key={value} className="flex items-center space-x-3">
            <div className="flex-1">
              <span className="text-sm text-[var(--text-muted)]">
                "{value}" →
              </span>
            </div>
            
            <select
              value={mapping[value] || ''}
              onChange={(e) => handleMappingChange(value, e.target.value)}
              className={`text-sm border rounded px-2 py-1 bg-slate-800 text-white border-[var(--ring)] ${
                getMappingStatus(value) === 'mapped' 
                  ? 'border-emerald-400/40 bg-emerald-400/10' 
                  : 'border-[var(--ring)] bg-slate-800'
              }`}
            >
              <option value="">Välj mappning</option>
              {config.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="ignore">(Ignorera)</option>
            </select>
            
            <div className="w-4">
              {getMappingStatus(value) === 'mapped' && (
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAdvanced && (
        <div className="mt-4 pt-3 border-t border-[var(--ring)]">
          <div className="text-xs text-[var(--text-muted)] space-y-1">
            <p><strong>Auto-mappning:</strong> Systemet försöker automatiskt mappa vanliga värden.</p>
            <p><strong>Ignorera:</strong> Välj "(Ignorera)" för värden som inte ska importeras.</p>
            <p><strong>Standard:</strong> Värden som inte mappas kommer att sättas till standardvärdet.</p>
          </div>
        </div>
      )}
    </div>
  );
}
