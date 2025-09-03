"use client";

import { useState } from 'react';
import { NormalizedRow, validateNormalizedData } from '@/lib/normalizeData';
import { FieldKey, getFieldConfig } from '@/lib/importSchema';

interface DataPreviewProps {
  data: NormalizedRow[];
  onImport: () => void;
  onBack: () => void;
}

export default function DataPreview({ data, onImport, onBack }: DataPreviewProps) {
  const [showAllRows, setShowAllRows] = useState(false);
  
  const validation = validateNormalizedData(data);
  const previewRows = showAllRows ? data : data.slice(0, 10);
  
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (value instanceof Date) return value.toLocaleDateString('sv-SE');
    if (typeof value === 'number') return value.toLocaleString('sv-SE');
    return String(value);
  };
  
  const getFieldLabel = (field: string): string => {
    const config = getFieldConfig(field as FieldKey);
    return config ? config.label : field;
  };
  
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Ingen data att förhandsgranska</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-slate-800">Förhandsgranska data</h3>
          <p className="text-sm text-[var(--text-muted)]">
            Granska normaliserade data innan import
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm border border-[var(--ring)] rounded-md text-[var(--text)] hover:bg-[var(--muted)]"
          >
            Tillbaka
          </button>
          
          <button
            onClick={onImport}
            disabled={!validation.isValid}
            className={`px-4 py-2 text-sm rounded-md text-white ${
              validation.isValid
                ? 'bg-[var(--accent)] hover:bg-[var(--accent-strong)]'
                : 'bg-[var(--muted)] text-[var(--text-muted)] cursor-not-allowed'
            }`}
          >
            Importera
          </button>
        </div>
      </div>
      
      {/* Valideringssammanfattning */}
      {!validation.isValid && (
        <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-lg">
          <h4 className="font-medium text-red-400 mb-2">Valideringsfel hittades</h4>
          <div className="space-y-1">
            {validation.errors.slice(0, 5).map((error, index) => (
              <p key={index} className="text-sm text-red-400">
                Rad {error.row}: {error.message}
              </p>
            ))}
            {validation.errors.length > 5 && (
              <p className="text-sm text-red-400">
                ...och {validation.errors.length - 5} fler fel
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Data preview */}
      <div className="border border-[var(--ring)] rounded-lg overflow-hidden">
        <div className="bg-[var(--muted)] px-4 py-3 border-b border-[var(--ring)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text)]">
              Visar {previewRows.length} av {data.length} rader
            </span>
            
            {data.length > 10 && (
              <button
                onClick={() => setShowAllRows(!showAllRows)}
                className="text-sm text-[var(--accent)] hover:text-[var(--accent-strong)]"
              >
                {showAllRows ? 'Visa endast 10 rader' : 'Visa alla rader'}
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--muted)]">
              <tr>
                {Object.keys(data[0] || {}).map(field => (
                  <th key={field} className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    {getFieldLabel(field)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--ring)]">
              {previewRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-[var(--muted)]">
                  {Object.entries(row).map(([field, value]) => (
                    <td key={field} className="px-4 py-3 text-sm text-[var(--text)]">
                      {formatValue(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Sammanfattning */}
      <div className="bg-[var(--muted)] p-4 rounded-lg">
        <h4 className="font-medium text-[var(--text)] mb-2">Importsammanfattning</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-[var(--text-muted)]">Totalt antal rader:</span>
            <div className="font-medium text-[var(--text)]">{data.length}</div>
          </div>
          <div>
            <span className="text-[var(--text-muted)]">Mappade fält:</span>
            <div className="font-medium text-[var(--text)]">
              {Object.keys(data[0] || {}).length}
            </div>
          </div>
          <div>
            <span className="text-[var(--text-muted)]">Validering:</span>
            <div className={`font-medium ${validation.isValid ? 'text-emerald-400' : 'text-red-400'}`}>
              {validation.isValid ? 'OK' : `${validation.errors.length} fel`}
            </div>
          </div>
          <div>
            <span className="text-[var(--text-muted)]">Status:</span>
            <div className={`font-medium ${validation.isValid ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {validation.isValid ? 'Redo att importera' : 'Kräver åtgärd'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
