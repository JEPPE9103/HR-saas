"use client";

import { useMemo } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface DataPreviewTableProps {
  data: Record<string, any>[];
  columns: Array<{
    name: string;
    type: 'string' | 'number' | 'date' | 'enum';
    isNumeric?: boolean;
    isDate?: boolean;
  }>;
  maxRows?: number;
}

export default function DataPreviewTable({ 
  data, 
  columns, 
  maxRows = 10 
}: DataPreviewTableProps) {
  const previewData = useMemo(() => {
    return data.slice(0, maxRows);
  }, [data, maxRows]);

  const getValueDisplay = (value: any, type: string): string => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    switch (type) {
      case 'number':
        return typeof value === 'number' ? value.toLocaleString('sv-SE') : String(value);
      case 'date':
        if (value instanceof Date) {
          return value.toLocaleDateString('sv-SE');
        }
        // Try to parse as date string
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('sv-SE');
        }
        return String(value);
      default:
        return String(value);
    }
  };

  const getColumnStatus = (column: any): 'valid' | 'warning' | 'error' => {
    if (column.type === 'number' && !column.isNumeric) {
      return 'warning';
    }
    if (column.type === 'date' && !column.isDate) {
      return 'warning';
    }
    return 'valid';
  };

           const getStatusIcon = (status: 'valid' | 'warning' | 'error') => {
        switch (status) {
          case 'valid':
            return <CheckCircle className="h-4 w-4 text-emerald-400" />;
          case 'warning':
            return <AlertCircle className="h-4 w-4 text-yellow-400" />;
          case 'error':
            return <AlertCircle className="h-4 w-4 text-red-400" />;
        }
      };

           if (!data || data.length === 0) {
        return (
          <div className="text-center py-8 text-white/60">
            <Info className="h-12 w-12 mx-auto mb-4 text-white/60" />
            <p>Ingen data att visa</p>
          </div>
        );
      }

           return (
        <div className="border rounded-lg overflow-hidden border-white/10">
          {/* Table Header */}
          <div className="bg-white/5 border-b border-white/10 sticky top-0 z-10">
            <div className="grid grid-cols-12 gap-4 px-4 py-3">
              <div className="col-span-1 text-xs font-medium text-white/60 uppercase tracking-wider">
                Rad
              </div>
              {columns.map((column, index) => {
                const status = getColumnStatus(column);
                return (
                  <div key={column.name} className="col-span-1 text-xs font-medium text-white/60 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(status)}
                      <span className="truncate" title={column.name}>
                        {column.name}
                      </span>
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      {column.type}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table Body */}
          <div className="bg-transparent">
            {previewData.map((row, rowIndex) => (
              <div 
                key={rowIndex} 
                className={`grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/10 last:border-b-0 ${
                  rowIndex % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'
                }`}
              >
                <div className="col-span-1 text-sm text-white/60 font-mono">
                  {rowIndex + 1}
                </div>
                {columns.map((column) => (
                  <div key={column.name} className="col-span-1">
                    <div className="text-sm text-white truncate" title={getValueDisplay(row[column.name], column.type)}>
                      {getValueDisplay(row[column.name], column.type)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white/5 px-4 py-3 border-t border-white/10">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>
                Visar {previewData.length} av {data.length} rader
              </span>
              <span>
                {columns.length} kolumner
              </span>
            </div>
          </div>
        </div>
      );
}
