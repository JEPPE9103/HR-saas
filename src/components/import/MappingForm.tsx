"use client";

import { useState, useEffect } from 'react';
import { FieldKey, FieldConfig, getFieldConfig, getRequiredFields, REQUIRED_FIELDS } from '@/lib/importSchema';
import { ColumnMeta } from '@/lib/csvSniffer';
import { buildAutoMap, AutoMap } from '@/lib/autoMap';
import EnumValueMapper from './EnumValueMapper';

interface MappingFormProps {
  columns: ColumnMeta[];
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
  const [autoMap, setAutoMap] = useState<AutoMap>({} as AutoMap);

  // Build auto-map when columns change
  useEffect(() => {
    if (columns.length > 0) {
      const autoMapping = buildAutoMap(columns);
      setAutoMap(autoMapping);
      
      // Apply auto-mapping to field mapping
      const newFieldMapping: Partial<Record<FieldKey, string>> = {};
      Object.entries(autoMapping).forEach(([field, column]) => {
        if (column) {
          newFieldMapping[field as FieldKey] = column;
        }
      });
      
      setFieldMapping(newFieldMapping);
      onMappingChange(newFieldMapping);
    }
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

  const getMappingStatus = (field: FieldKey): 'valid' | 'warning' | 'error' => {
    const config = getFieldConfig(field);
    if (!config) return 'error';
    
    const mappedColumn = fieldMapping[field];
    
    if (!mappedColumn) {
      return config.required ? 'error' : 'warning';
    }
    
    const column = columns.find(c => c.name === mappedColumn);
    if (!column) return 'error';
    
    // Check type compatibility
    if (config.type === 'number') {
      return column.type === 'number' ? 'valid' : 'warning';
    }
    
    if (config.type === 'date') {
      return column.type === 'date' ? 'valid' : 'warning';
    }
    
    if (config.type === 'enum') {
      return column.type === 'string' && column.distinct.length <= 20 ? 'valid' : 'warning';
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
  const validation = {
    isValid: requiredFields.every(field => fieldMapping[field]),
    missingFields: requiredFields.filter(field => !fieldMapping[field])
  };

  return (
    <div className="space-y-6">
      {/* Hjälptext för smart mappning */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
        <h4 className="font-medium text-slate-800 mb-2">💡 Smart mappning för alla bolag</h4>
        <p className="text-sm text-slate-600">
          Systemet försöker automatiskt mappa dina kolumner baserat på namn och innehåll. 
          Det fungerar med svenska, engelska och många andra språk. 
          Om mappningen inte fungerar automatiskt kan du alltid manuellt välja rätt kolumn för varje fält.
        </p>
        <div className="mt-3 text-xs text-slate-500">
          <strong>Exempel på kolumnnamn som fungerar:</strong><br/>
          • ID: "employee_id", "personnummer", "medarbetare_nr", "emp_code"<br/>
          • Namn: "name", "namn", "förnamn_efternamn", "full_name"<br/>
          • Lön: "salary", "lön", "månadslön", "compensation", "pay"
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vänster kolumn - Obligatoriska fält */}
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-4">Obligatoriska fält</h3>
          <div className="space-y-4">
            {requiredFields.map(field => {
              const config = getFieldConfig(field);
              if (!config) return null;
              
              const status = getMappingStatus(field);
              const compatibleColumns = columns.filter(column => {
                // Filtrera bort systemfält
                if (column.name.toLowerCase().includes('tenant_id') || 
                    column.name.toLowerCase().includes('created_at') ||
                    column.name.toLowerCase().includes('updated_at')) {
                  return false;
                }
                
                // Filtrera baserat på fälttyp
                switch (config.type) {
                  case "number":
                    return column.type === "number";
                  case "date":
                    return column.type === "date";
                  case "enum":
                    return column.type === "string" && column.distinct.length <= 20;
                  case "string":
                    return column.type === "string";
                  default:
                    return true;
                }
              });
              const mappedColumn = fieldMapping[field];
              const column = columns.find(c => c.name === mappedColumn);
              
              return (
                <div key={field} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(status)}
                    <label className="text-sm font-medium text-slate-800">
                      {config.label} *
                    </label>
                  </div>
                  
                  <select
                    value={mappedColumn || ''}
                    onChange={(e) => handleFieldMappingChange(field, e.target.value)}
                    className={`w-full text-sm border rounded-xl px-3 py-2 bg-white text-slate-800 border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-colors duration-200 ${
                      status === 'valid' 
                        ? 'border-emerald-400 bg-emerald-50' 
                        : status === 'warning'
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-slate-200 bg-white'
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
                    <div className="text-xs text-slate-500">
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
              if (!config) return null;
              
              const status = getMappingStatus(field);
              const compatibleColumns = columns.filter(column => {
                // Filtrera bort systemfält
                if (column.name.toLowerCase().includes('tenant_id') || 
                    column.name.toLowerCase().includes('created_at') ||
                    column.name.toLowerCase().includes('updated_at')) {
                  return false;
                }
                
                // Filtrera baserat på fälttyp
                switch (config.type) {
                  case "number":
                    return column.type === "number";
                  case "date":
                    return column.type === "date";
                  case "enum":
                    return column.type === "string" && column.distinct.length <= 20;
                  case "string":
                    return column.type === "string";
                  default:
                    return true;
                }
              });
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
                  
                  {/* Enum mapping för valfria enum-fält */}
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
        
        {!validation.isValid && (
          <div className="mt-3 p-3 bg-red-400/10 border border-red-400/20 rounded-md">
            <p className="text-sm text-red-400">
              <strong>Fyll i alla obligatoriska fält:</strong> {validation.missingFields.map(field => 
                getFieldConfig(field).label
              ).join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
