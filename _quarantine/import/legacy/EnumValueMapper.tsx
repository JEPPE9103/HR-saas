"use client";

import { useState, useEffect } from 'react';
import { FieldConfig } from '@/lib/importSchema';

interface EnumValueMapperProps {
  field: string;
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

    const autoMapping: Record<string, string> = {};
    
    discoveredValues.forEach(value => {
      const lowerValue = value.toLowerCase().trim();
      
      // Auto-heuristik för olika enum-fält
      if (field === 'gender') {
        if (/^f(emale)?|kvinna|k|f|kvinnlig|woman|w$/i.test(lowerValue)) {
          autoMapping[value] = 'female';
        } else if (/^m(ale)?|man|m|manlig|man|m$/i.test(lowerValue)) {
          autoMapping[value] = 'male';
        } else if (lowerValue === '' || lowerValue === 'null' || lowerValue === 'undefined' || 
                   lowerValue === 'n/a' || lowerValue === 'na' || lowerValue === '0' ||
                   /^o(ther)?|annan|annat|diverse|d|3$/i.test(lowerValue)) {
          autoMapping[value] = 'other';
        } else {
          autoMapping[value] = 'other';
        }
      } else if (field === 'level') {
        // Auto-mappning för nivå
        if (/^junior|j|1|entry|nybörjare|ny/i.test(lowerValue)) {
          autoMapping[value] = 'Junior';
        } else if (/^medior|m|2|mid|medel/i.test(lowerValue)) {
          autoMapping[value] = 'Medior';
        } else if (/^senior|s|3|sen|erfaren/i.test(lowerValue)) {
          autoMapping[value] = 'Senior';
        } else if (/^lead|l|4|team lead/i.test(lowerValue)) {
          autoMapping[value] = 'Lead';
        } else if (/^manager|mgr|5|chef/i.test(lowerValue)) {
          autoMapping[value] = 'Manager';
        } else if (/^director|dir|6|direktör/i.test(lowerValue)) {
          autoMapping[value] = 'Director';
        } else if (/^vp|vice president|7|vice VD/i.test(lowerValue)) {
          autoMapping[value] = 'VP';
        } else if (/^c-level|ceo|cto|cfo|8|VD|teknisk VD|ekonomisk VD/i.test(lowerValue)) {
          autoMapping[value] = 'C-Level';
        } else {
          autoMapping[value] = 'Other';
        }
      } else if (field === 'department') {
        // Auto-mappning för avdelning
        if (/^it|tech|technology|teknisk/i.test(lowerValue)) {
          autoMapping[value] = 'IT';
        } else if (/^hr|human resources|personal|rekrytering/i.test(lowerValue)) {
          autoMapping[value] = 'HR';
        } else if (/^finance|finans|ekonomi|accounting/i.test(lowerValue)) {
          autoMapping[value] = 'Finance';
        } else if (/^sales|försäljning|sälj/i.test(lowerValue)) {
          autoMapping[value] = 'Sales';
        } else if (/^marketing|marknadsföring|reklam/i.test(lowerValue)) {
          autoMapping[value] = 'Marketing';
        } else if (/^engineering|ingenjör|utveckling/i.test(lowerValue)) {
          autoMapping[value] = 'Engineering';
        } else if (/^operations|drift|produktion/i.test(lowerValue)) {
          autoMapping[value] = 'Operations';
        } else if (/^legal|juridik|rättslig/i.test(lowerValue)) {
          autoMapping[value] = 'Legal';
        } else if (/^customer support|kundtjänst|support/i.test(lowerValue)) {
          autoMapping[value] = 'Customer Support';
        } else if (/^product|produkt|produktutveckling/i.test(lowerValue)) {
          autoMapping[value] = 'Product';
        } else if (/^design|formgivning|ux|ui/i.test(lowerValue)) {
          autoMapping[value] = 'Design';
        } else if (/^research|forskning|r&d/i.test(lowerValue)) {
          autoMapping[value] = 'Research';
        } else {
          autoMapping[value] = 'Other';
        }
      } else if (field === 'job_family') {
        // Auto-mappning för jobbfamilj
        if (/^engineering|ingenjör|utvecklare|developer/i.test(lowerValue)) {
          autoMapping[value] = 'Engineering';
        } else if (/^sales|försäljning|säljare|account manager/i.test(lowerValue)) {
          autoMapping[value] = 'Sales';
        } else if (/^marketing|marknadsföring|marknadschef/i.test(lowerValue)) {
          autoMapping[value] = 'Marketing';
        } else if (/^finance|finans|ekonom|controller/i.test(lowerValue)) {
          autoMapping[value] = 'Finance';
        } else if (/^hr|human resources|personal|rekryterare/i.test(lowerValue)) {
          autoMapping[value] = 'HR';
        } else if (/^operations|drift|operativ/i.test(lowerValue)) {
          autoMapping[value] = 'Operations';
        } else if (/^legal|juridik|advokat/i.test(lowerValue)) {
          autoMapping[value] = 'Legal';
        } else if (/^customer support|kundtjänst|support/i.test(lowerValue)) {
          autoMapping[value] = 'Customer Support';
        } else if (/^product|produkt|produktchef/i.test(lowerValue)) {
          autoMapping[value] = 'Product';
        } else if (/^design|formgivare|designer/i.test(lowerValue)) {
          autoMapping[value] = 'Design';
        } else if (/^research|forskning|forskare/i.test(lowerValue)) {
          autoMapping[value] = 'Research';
        } else if (/^administration|admin|administrativ/i.test(lowerValue)) {
          autoMapping[value] = 'Administration';
        } else {
          autoMapping[value] = 'Other';
        }
      } else if (field === 'currency') {
        // Auto-mappning för valuta
        if (/^sek|kr|kronor|swedish/i.test(lowerValue)) {
          autoMapping[value] = 'SEK';
        } else if (/^eur|euro|€/i.test(lowerValue)) {
          autoMapping[value] = 'EUR';
        } else if (/^usd|dollar|\$/i.test(lowerValue)) {
          autoMapping[value] = 'USD';
        } else if (/^gbp|pound|£/i.test(lowerValue)) {
          autoMapping[value] = 'GBP';
        } else if (/^dkk|danska kronor/i.test(lowerValue)) {
          autoMapping[value] = 'DKK';
        } else if (/^nok|norska kronor/i.test(lowerValue)) {
          autoMapping[value] = 'NOK';
        } else {
          autoMapping[value] = 'Other';
        }
      } else {
        // För andra enum-fält, använd första alternativet som default
        autoMapping[value] = config.options?.[0] || '';
      }
    });

    setMapping(autoMapping);
    onMappingChange(autoMapping);
  }, [field, config, discoveredValues, onMappingChange]);

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
