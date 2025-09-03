"use client";

import { useState, useEffect } from 'react';
import { FieldKey, FieldConfig, getFieldConfig, getRequiredFields, REQUIRED_FIELDS } from '@/lib/importSchema';
import { ColumnMeta as ColumnInfo } from '@/lib/csvSniffer';
import EnumValueMapper from './EnumValueMapper';

interface MappingFormProps {
  columns: ColumnInfo[];
  onMappingChange: (mapping: Partial<Record<FieldKey, string>>) => void;
  onEnumMappingChange: (field: FieldKey, mapping: Record<string, string>) => void;
}

export default function MappingForm({ 
  columns, 
  onMappingChange, 
  onEnumMappingChange 
}: MappingFormProps) {
  const [fieldMapping, setFieldMapping] = useState<Partial<Record<FieldKey, string>>>({});
  const [enumMappings, setEnumMappings] = useState<Partial<Record<FieldKey, Record<string, string>>>>({});

  // Auto-suggest field mappings baserat på kolumnnamn - FLEXIBELT för alla bolag
  useEffect(() => {
    const suggestions: Partial<Record<FieldKey, string>> = {};
    
    columns.forEach(column => {
      const columnLower = column.name.toLowerCase();
      const columnWords = columnLower.split(/[\s\-_]+/); // Dela på mellanslag, bindestreck, understreck
      
      // FLEXIBEL mappning för alla möjliga kolumnnamn
      
      // Anställnings-ID - många olika format
      if (columnLower.includes('id') || 
          columnLower.includes('anställnings') || 
          columnLower.includes('personnummer') ||
          columnLower.includes('personnr') ||
          columnLower.includes('emp') ||
          columnLower.includes('medarbetare') ||
          columnLower.includes('employee') ||
          columnWords.some(word => ['id', 'nummer', 'nr', 'code', 'kod'].includes(word))) {
        suggestions.employee_id = column.name;
      }
      
      // Namn - alla möjliga varianter
      else if (columnLower.includes('namn') || 
               columnLower.includes('name') ||
               columnLower.includes('förnamn') ||
               columnLower.includes('efternamn') ||
               columnLower.includes('first') ||
               columnLower.includes('last') ||
               columnLower.includes('full') ||
               columnWords.some(word => ['namn', 'name', 'förnamn', 'efternamn', 'first', 'last', 'full'].includes(word))) {
        suggestions.name = column.name;
      }
      
      // Kön - internationella varianter
      else if (columnLower.includes('kön') || 
               columnLower.includes('gender') || 
               columnLower.includes('sex') ||
               columnLower.includes('genus') ||
               columnLower.includes('kön') ||
               columnLower.includes('m/f') ||
               columnLower.includes('m/k') ||
               columnWords.some(word => ['kön', 'gender', 'sex', 'genus', 'm', 'f', 'k', 'man', 'kvinna'].includes(word))) {
        suggestions.gender = column.name;
      }
      
      // Avdelning - alla möjliga varianter
      else if (columnLower.includes('avdelning') || 
               columnLower.includes('department') || 
               columnLower.includes('dept') ||
               columnLower.includes('sektion') ||
               columnLower.includes('team') ||
               columnLower.includes('grupp') ||
               columnLower.includes('division') ||
               columnLower.includes('enhet') ||
               columnWords.some(word => ['avdelning', 'department', 'dept', 'sektion', 'team', 'grupp', 'division', 'enhet'].includes(word))) {
        suggestions.department = column.name;
      }
      

      
      // Lön - alla möjliga varianter
      else if (columnLower.includes('lön') || 
               columnLower.includes('salary') || 
               columnLower.includes('grundlön') ||
               columnLower.includes('månadslön') ||
               columnLower.includes('årslön') ||
               columnLower.includes('compensation') ||
               columnLower.includes('pay') ||
               columnLower.includes('wage') ||
               columnLower.includes('inkomst') ||
               columnWords.some(word => ['lön', 'salary', 'grundlön', 'månadslön', 'årslön', 'compensation', 'pay', 'wage', 'inkomst'].includes(word))) {
        suggestions.base_salary_sek = column.name;
      }
      
      // Valuta - internationella varianter
      else if (columnLower.includes('valuta') || 
               columnLower.includes('currency') ||
               columnLower.includes('moneta') ||
               columnLower.includes('kr') ||
               columnLower.includes('sek') ||
               columnLower.includes('eur') ||
               columnLower.includes('usd') ||
               columnWords.some(word => ['valuta', 'currency', 'moneta', 'kr', 'sek', 'eur', 'usd'].includes(word))) {
        suggestions.currency = column.name;
      }
      
      // Datum - alla möjliga format
      else if (columnLower.includes('datum') || 
               columnLower.includes('date') || 
               columnLower.includes('anställningsdatum') ||
               columnLower.includes('startdatum') ||
               columnLower.includes('start') ||
               columnLower.includes('hired') ||
               columnLower.includes('employment') ||
               columnLower.includes('started') ||
               columnWords.some(word => ['datum', 'date', 'start', 'hired', 'employment', 'started'].includes(word))) {
        suggestions.hire_date = column.name;
      }
    });

    setFieldMapping(suggestions);
    onMappingChange(suggestions);
  }, [columns, onMappingChange]);

  const handleFieldMappingChange = (field: FieldKey, columnName: string) => {
    const newMapping = { ...fieldMapping, [field]: columnName };
    setFieldMapping(newMapping);
    onMappingChange(newMapping);
  };

  const handleEnumMappingChange = (field: FieldKey, mapping: Record<string, string>) => {
    const newEnumMappings = { ...enumMappings, [field]: mapping };
    setEnumMappings(newEnumMappings);
    onEnumMappingChange(field, mapping);
  };

  const getCompatibleColumns = (field: FieldKey): ColumnInfo[] => {
    const config = getFieldConfig(field);
    if (!config) return [];
    
    return columns.filter(column => {
      switch (config.type) {
        case 'number':
          // Visa både numeriska kolumner OCH kolumner som kan konverteras
          return column.type === 'number' || 
                 column.name.toLowerCase().includes('lön') ||
                 column.name.toLowerCase().includes('salary') ||
                 column.name.toLowerCase().includes('pay') ||
                 column.name.toLowerCase().includes('procent') ||
                 column.name.toLowerCase().includes('percentage');
        case 'date':
          // Visa både datum-kolumner OCH kolumner som kan vara datum
          return column.type === 'date' ||
                 column.name.toLowerCase().includes('datum') ||
                 column.name.toLowerCase().includes('date') ||
                 column.name.toLowerCase().includes('start') ||
                 column.name.toLowerCase().includes('hired');
        case 'enum':
          // Visa kolumner med rimligt antal unika värden
          return column.type === 'string' && column.distinct.length <= 20;
        default:
          // För string, visa alla kolumner som inte är uppenbart fel
          return true;
      }
    });
  };

  const getMappingStatus = (field: FieldKey): 'valid' | 'warning' | 'error' => {
    const config = getFieldConfig(field);
    if (!config) return 'error';
    
    const mappedColumn = fieldMapping[field];
    
    if (!mappedColumn) {
      return config.required ? 'error' : 'warning';
    }
    
    const column = columns.find(c => c.name === mappedColumn);
    if (!column) return 'error';
    
    // Kontrollera typkompatibilitet med flexibilitet
    if (config.type === 'number') {
      if (column.type === 'number') {
        return 'valid';
      } else {
        // Kolla om kolumnen kan konverteras till nummer
        const columnName = column.name.toLowerCase();
        if (columnName.includes('lön') || columnName.includes('salary') || 
            columnName.includes('pay') || columnName.includes('procent')) {
          return 'warning'; // Kan troligen konverteras
        }
        return 'warning';
      }
    }
    
    if (config.type === 'date') {
      if (column.type === 'date') {
        return 'valid';
      } else {
        // Kolla om kolumnen kan vara datum
        const columnName = column.name.toLowerCase();
        if (columnName.includes('datum') || columnName.includes('date') || 
            columnName.includes('start') || columnName.includes('hired')) {
          return 'warning'; // Kan troligen konverteras
        }
        return 'warning';
      }
    }
    
    return 'valid';
  };

  const getStatusIcon = (status: 'valid' | 'warning' | 'error') => {
    switch (status) {
      case 'valid':
        return <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>;
      case 'warning':
        return <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>;
      case 'error':
        return <div className="w-2 h-2 bg-red-400 rounded-full"></div>;
    }
  };

  const requiredFields = getRequiredFields();
  const allFields = Object.keys(REQUIRED_FIELDS) as FieldKey[];

  return (
    <div className="space-y-6">
      {/* Hjälptext för flexibel mappning */}
      <div className="p-4 bg-[var(--muted)] border border-[var(--ring)] rounded-lg">
        <h4 className="font-medium text-[var(--text)] mb-2">💡 Smart mappning för alla bolag</h4>
        <p className="text-sm text-[var(--text-muted)]">
          Systemet försöker automatiskt mappa dina kolumner baserat på namn. Det fungerar med svenska, engelska och många andra språk. 
          Om mappningen inte fungerar automatiskt kan du alltid manuellt välja rätt kolumn för varje fält.
        </p>
        <div className="mt-3 text-xs text-[var(--text-muted)]">
          <strong>Exempel på kolumnnamn som fungerar:</strong><br/>
          • ID: "employee_id", "personnummer", "medarbetare_nr", "emp_code"<br/>
          • Namn: "name", "namn", "förnamn_efternamn", "full_name"<br/>
          • Lön: "salary", "lön", "månadslön", "compensation", "pay"
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vänster kolumn - Obligatoriska fält */}
        <div>
                     <h3 className="text-lg font-medium text-[var(--text)] mb-4">Obligatoriska fält</h3>
          <div className="space-y-4">
            {requiredFields.map(field => {
              const config = getFieldConfig(field);
              if (!config) return null; // Skip if config is undefined
              
              const status = getMappingStatus(field);
              const compatibleColumns = getCompatibleColumns(field);
              const mappedColumn = fieldMapping[field];
              const column = columns.find(c => c.name === mappedColumn);
              
              return (
                <div key={field} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(status)}
                                         <label className="text-sm font-medium text-[var(--text)]">
                       {config.label} *
                     </label>
                  </div>
                  
                                     <select
                     value={mappedColumn || ''}
                     onChange={(e) => handleFieldMappingChange(field, e.target.value)}
                     className={`w-full text-sm border rounded-md px-3 py-2 bg-slate-800 text-white border-[var(--ring)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] ${
                       status === 'valid' 
                         ? 'border-emerald-400/40 bg-emerald-400/10' 
                         : status === 'warning'
                         ? 'border-yellow-400/40 bg-yellow-400/10'
                         : 'border-[var(--ring)] bg-slate-800'
                     }`}
                   >
                    <option value="">Välj kolumn</option>
                    {compatibleColumns.map(col => (
                      <option key={col.name} value={col.name}>
                        {col.name} ({col.type})
                      </option>
                    ))}
                  </select>
                  
                  {/* Sample values */}
                  {column && (
                    <div className="text-xs text-[var(--text-muted)]">
                      <span className="font-medium">Exempelvärden:</span>{' '}
                      {column.samples.slice(0, 3).join(', ')}
                      {column.samples.length > 3 && '...'}
                    </div>
                  )}
                  
                  {/* Enum mapping för alla enum-fält */}
                  {config.type === 'enum' && column && (
                    <EnumValueMapper
                      field={field}
                      config={config}
                      discoveredValues={column.distinct}
                      onMappingChange={(mapping) => handleEnumMappingChange(field, mapping)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Höger kolumn - Valfria fält */}
        <div>
                     <h3 className="text-lg font-medium text-[var(--text)] mb-4">Valfria fält</h3>
          <div className="space-y-4">
            {allFields.filter(field => !requiredFields.includes(field)).map(field => {
              const config = getFieldConfig(field);
              if (!config) return null; // Skip if config is undefined
              
              const status = getMappingStatus(field);
              const compatibleColumns = getCompatibleColumns(field);
              const mappedColumn = fieldMapping[field];
              const column = columns.find(c => c.name === mappedColumn);
              
              return (
                <div key={field} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(status)}
                                         <label className="text-sm font-medium text-[var(--text)]">
                       {config.label}
                     </label>
                    {config.default && (
                                             <span className="text-xs text-[var(--text-muted)]">
                         (standard: {config.default})
                       </span>
                    )}
                  </div>
                  
                                     <select
                     value={mappedColumn || ''}
                     onChange={(e) => handleFieldMappingChange(field, e.target.value)}
                     className={`w-full text-sm border rounded-md px-3 py-2 bg-slate-800 text-white border-[var(--ring)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] ${
                       status === 'valid' 
                         ? 'border-emerald-400/40 bg-emerald-400/10' 
                         : 'border-[var(--ring)] bg-slate-800'
                     }`}
                   >
                    <option value="">Välj kolumn (valfritt)</option>
                    {compatibleColumns.map(col => (
                      <option key={col.name} value={col.name}>
                        {col.name} ({col.type})
                      </option>
                    ))}
                  </select>
                  
                  {/* Sample values */}
                  {column && (
                    <div className="text-xs text-[var(--text-muted)]">
                      <span className="font-medium">Exempelvärden:</span>{' '}
                      {column.samples.slice(0, 3).join(', ')}
                      {column.samples.length > 3 && '...'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Valideringssammanfattning */}
      <div className="border-t border-[var(--ring)] pt-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-[var(--text-muted)]">
            {requiredFields.filter(field => getMappingStatus(field) === 'valid').length} av {requiredFields.length} obligatoriska fält mappade
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-xs text-[var(--text-muted)]">Klar</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-xs text-[var(--text-muted)]">Varning</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-xs text-[var(--text-muted)]">Fel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
