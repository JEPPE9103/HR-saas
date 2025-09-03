"use client";

import React from "react";
import { useI18n } from "@/providers/I18nProvider";
import { getFieldConfig, FieldKey } from "@/lib/importSchema";

interface EnumMappingProps {
  fieldKey: FieldKey;
  sourceValues: string[];
  mapping: Record<string, string>;
  onMappingChange: (mapping: Record<string, string>) => void;
}

export default function EnumMapping({ 
  fieldKey, 
  sourceValues, 
  mapping, 
  onMappingChange 
}: EnumMappingProps) {
  const { t } = useI18n();
  const targetOptions = getFieldConfig(fieldKey).options || [];
  
  // Heuristic mapping for gender
  function getSuggestedMapping(value: string): string {
    const lowerValue = value.toLowerCase().trim();
    
    if (fieldKey === 'gender') {
      if (/^f(emale)?|kvinna$/i.test(lowerValue)) return 'female';
      if (/^m(ale)?|man$/i.test(lowerValue)) return 'male';
      return 'other';
    }
    
    return targetOptions[0] || '';
  }
  
  function handleMappingChange(sourceValue: string, targetValue: string) {
    const newMapping = { ...mapping };
    if (targetValue === 'ignore') {
      delete newMapping[sourceValue];
    } else {
      newMapping[sourceValue] = targetValue;
    }
    onMappingChange(newMapping);
  }
  
  // Auto-suggest mappings for unmapped values
  React.useEffect(() => {
    const newMapping = { ...mapping };
    let hasChanges = false;
    
    sourceValues.forEach(value => {
      if (!(value in newMapping)) {
        const suggested = getSuggestedMapping(value);
        if (suggested) {
          newMapping[value] = suggested;
          hasChanges = true;
        }
      }
    });
    
    if (hasChanges) {
      onMappingChange(newMapping);
    }
  }, [sourceValues, mapping, onMappingChange]);
  
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-[var(--text)]">
        {t('upload.enumMapping.title')}
      </h4>
      <div className="text-xs text-[var(--text-muted)] mb-3">
        {t('upload.enumMapping.description')}
      </div>
      
      <div className="space-y-2">
        {sourceValues.map(sourceValue => (
          <div key={sourceValue} className="flex items-center gap-3">
            <div className="flex-1 text-sm text-[var(--text)]">
              {sourceValue || '(tomt)'}
            </div>
            <div className="text-sm text-[var(--text-muted)]">→</div>
            <select
              value={mapping[sourceValue] || ''}
              onChange={(e) => handleMappingChange(sourceValue, e.target.value)}
              className="flex-1 rounded border px-2 py-1 text-sm border-[var(--ring)] bg-[var(--panel)] text-[var(--text)]"
            >
              <option value="">{t('upload.enumMapping.select')}</option>
              {targetOptions.map(option => (
                <option key={option} value={option}>
                  {t(`upload.enumMapping.${fieldKey}.${option}`) || option}
                </option>
              ))}
              <option value="ignore">{t('upload.enumMapping.ignore')}</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
