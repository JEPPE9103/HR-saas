// import { sniffCsvData, suggestFieldMappings } from "@/lib/csvSniffer";
import { FieldKey, REQUIRED_FIELDS } from "@/lib/importSchema";

export interface DemoData {
  employees: Record<string, any>[];
  gapTrend: Record<string, any>[];
  compBands: Record<string, any>[];
}

export interface NormalizedEmployee {
  employee_id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  department: string;
  job_family?: string;
  level?: string;
  country: string;
  fte?: number;
  base_salary_sek: number;
  currency: string;
  hire_date?: string;
}

// Load demo data from CSV files
export async function loadDemoData(): Promise<DemoData> {
  try {
    const [employeesResponse, gapTrendResponse, compBandsResponse] = await Promise.all([
      fetch('/demo/employees.csv'),
      fetch('/demo/gap_trend_demo.csv'),
      fetch('/demo/comp_bands.csv')
    ]);

    const employeesText = await employeesResponse.text();
    const gapTrendText = await gapTrendResponse.text();
    const compBandsText = await compBandsResponse.text();

    const employees = parseCSV(employeesText);
    const gapTrend = parseCSV(gapTrendText);
    const compBands = parseCSV(compBandsText);

    return { employees, gapTrend, compBands };
  } catch (error) {
    console.error('Failed to load demo data from CSV, using fallback data:', error);
    // Fallback till realistisk demo-data med rimliga lönegap
    return generateFallbackDemoData();
  }
}

// Generate realistic fallback demo data with reasonable pay gaps
export function generateFallbackDemoData(): DemoData {
  const employees = [
    // IT-avdelning - balanserade löner
    { employee_id: 'EMP001', name: 'Anna Andersson', gender: 'female', department: 'IT', country: 'Sweden', base_salary_sek: 52000, currency: 'SEK', hire_date: '2022-01-15' },
    { employee_id: 'EMP002', name: 'Erik Eriksson', gender: 'male', department: 'IT', country: 'Sweden', base_salary_sek: 54000, currency: 'SEK', hire_date: '2022-03-01' },
    { employee_id: 'EMP003', name: 'Maria Svensson', gender: 'female', department: 'IT', country: 'Sweden', base_salary_sek: 58000, currency: 'SEK', hire_date: '2022-06-10' },
    { employee_id: 'EMP004', name: 'Johan Johansson', gender: 'male', department: 'IT', country: 'Sweden', base_salary_sek: 60000, currency: 'SEK', hire_date: '2022-08-15' },
    
    // Marketing - liten skillnad
    { employee_id: 'EMP005', name: 'Sofia Karlsson', gender: 'female', department: 'Marketing', country: 'Sweden', base_salary_sek: 48000, currency: 'SEK', hire_date: '2022-02-20' },
    { employee_id: 'EMP006', name: 'Anders Nilsson', gender: 'male', department: 'Marketing', country: 'Sweden', base_salary_sek: 50000, currency: 'SEK', hire_date: '2022-04-10' },
    { employee_id: 'EMP007', name: 'Eva Lindberg', gender: 'female', department: 'Marketing', country: 'Sweden', base_salary_sek: 52000, currency: 'SEK', hire_date: '2022-07-05' },
    
    // Sales - balanserade
    { employee_id: 'EMP008', name: 'Peter Berg', gender: 'male', department: 'Sales', country: 'Sweden', base_salary_sek: 46000, currency: 'SEK', hire_date: '2022-01-20' },
    { employee_id: 'EMP009', name: 'Karin Holm', gender: 'female', department: 'Sales', country: 'Sweden', base_salary_sek: 47000, currency: 'SEK', hire_date: '2022-03-15' },
    { employee_id: 'EMP010', name: 'Mikael Sjöberg', gender: 'male', department: 'Sales', country: 'Sweden', base_salary_sek: 48000, currency: 'SEK', hire_date: '2022-05-10' },
    
    // Finance - högre löner, liten skillnad
    { employee_id: 'EMP011', name: 'Lisa Ekström', gender: 'female', department: 'Finance', country: 'Sweden', base_salary_sek: 55000, currency: 'SEK', hire_date: '2022-02-01' },
    { employee_id: 'EMP012', name: 'Daniel Bergström', gender: 'male', department: 'Finance', country: 'Sweden', base_salary_sek: 57000, currency: 'SEK', hire_date: '2022-04-20' },
    
    // Operations - lägre löner, balanserade
    { employee_id: 'EMP013', name: 'Emma Forsberg', gender: 'female', department: 'Operations', country: 'Sweden', base_salary_sek: 42000, currency: 'SEK', hire_date: '2022-01-10' },
    { employee_id: 'EMP014', name: 'Marcus Lindholm', gender: 'male', department: 'Operations', country: 'Sweden', base_salary_sek: 43000, currency: 'SEK', hire_date: '2022-03-25' },
    { employee_id: 'EMP015', name: 'Nina Sandberg', gender: 'female', department: 'Product', country: 'Sweden', base_salary_sek: 53000, currency: 'SEK', hire_date: '2022-06-01' }
  ];

  // Generera realistisk gap trend data över tid (gap mellan 2-8%)
  const gapTrend = [
    { month: '2022-01', gap_pct: 4.2, male_median: 52000, female_median: 49800, eu_target: 2.0 },
    { month: '2022-02', gap_pct: 3.8, male_median: 52500, female_median: 50500, eu_target: 2.0 },
    { month: '2022-03', gap_pct: 4.5, male_median: 53000, female_median: 50700, eu_target: 2.0 },
    { month: '2022-04', gap_pct: 4.1, male_median: 53500, female_median: 51300, eu_target: 2.0 },
    { month: '2022-05', gap_pct: 3.9, male_median: 54000, female_median: 51900, eu_target: 2.0 },
    { month: '2022-06', gap_pct: 4.3, male_median: 54500, female_median: 52200, eu_target: 2.0 },
    { month: '2022-07', gap_pct: 4.0, male_median: 55000, female_median: 52800, eu_target: 2.0 },
    { month: '2022-08', gap_pct: 3.7, male_median: 55500, female_median: 53500, eu_target: 2.0 },
    { month: '2022-09', gap_pct: 4.1, male_median: 56000, female_median: 53700, eu_target: 2.0 },
    { month: '2022-10', gap_pct: 3.9, male_median: 56500, female_median: 54300, eu_target: 2.0 },
    { month: '2022-11', gap_pct: 4.2, male_median: 57000, female_median: 54600, eu_target: 2.0 },
    { month: '2022-12', gap_pct: 3.8, male_median: 57500, female_median: 55300, eu_target: 2.0 }
  ];

  const compBands = [
    { level: 'Junior', min_salary: 40000, max_salary: 50000, median: 45000 },
    { level: 'Mid-level', min_salary: 50000, max_salary: 65000, median: 57500 },
    { level: 'Senior', min_salary: 65000, max_salary: 80000, median: 72500 },
    { level: 'Lead', min_salary: 80000, max_salary: 100000, median: 90000 }
  ];

  return { employees, gapTrend, compBands };
}

// Generate company comparison data for benchmarking
export function generateCompanyComparisonData(): Record<string, any>[] {
  return [
    {
      company: 'Ditt bolag',
      overallGap: 4.1,
      itGap: 3.8,
      marketingGap: 4.2,
      salesGap: 2.1,
      financeGap: 3.5,
      operationsGap: 2.4,
      employeeCount: 15,
      industry: 'Tech'
    },
    {
      company: 'Konkurrent A',
      overallGap: 6.2,
      itGap: 5.8,
      marketingGap: 7.1,
      salesGap: 4.9,
      financeGap: 6.5,
      operationsGap: 5.2,
      employeeCount: 23,
      industry: 'Tech'
    },
    {
      company: 'Konkurrent B',
      overallGap: 3.1,
      itGap: 2.8,
      marketingGap: 3.5,
      salesGap: 2.9,
      financeGap: 3.2,
      operationsGap: 2.1,
      employeeCount: 18,
      industry: 'Tech'
    },
    {
      company: 'Branschgenomsnitt',
      overallGap: 5.8,
      itGap: 5.2,
      marketingGap: 6.8,
      salesGap: 5.1,
      financeGap: 6.2,
      operationsGap: 4.9,
      employeeCount: 0,
      industry: 'Tech'
    },
    {
      company: 'EU-mål',
      overallGap: 2.0,
      itGap: 2.0,
      marketingGap: 2.0,
      salesGap: 2.0,
      financeGap: 2.0,
      operationsGap: 2.0,
      employeeCount: 0,
      industry: 'Standard'
    }
  ];
}

// Parse CSV text to array of objects
function parseCSV(csvText: string): Record<string, any>[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      const trimmedValue = value.trim();
      
      // Convert numeric fields to numbers
      if (header === 'gap_pct' || header === 'base_salary_sek' || header === 'fte') {
        row[header.trim()] = parseFloat(trimmedValue) || 0;
      } else {
        row[header.trim()] = trimmedValue;
      }
    });
    
    return row;
  });
}

// Get suggested mappings for demo data
export function getDemoMappings(): Record<FieldKey, string> {
  return {
    employee_id: 'employee_id',
    name: 'name',
    gender: 'gender',
    department: 'department',
    country: 'country',
    base_salary_sek: 'base_salary_sek',
    currency: 'currency',
    hire_date: 'hire_date'
  };
}

// Normalize employee data according to schema
export function normalizeEmployeeData(
  rawData: Record<string, any>[], 
  fieldMappings: Record<FieldKey, string>,
  enumMappings: Partial<Record<FieldKey, Record<string, string>>> = {}
): NormalizedEmployee[] {
  return rawData.map(row => {
    const normalized: any = {};
    
    Object.entries(REQUIRED_FIELDS).forEach(([fieldKey, config]) => {
      const sourceColumn = fieldMappings[fieldKey as FieldKey];
      if (!sourceColumn) return;
      
      let value = row[sourceColumn];
      
      // Apply enum mapping if applicable
      if (config.type === 'enum' && enumMappings[fieldKey as FieldKey]) {
        const enumMapping = enumMappings[fieldKey as FieldKey];
        if (enumMapping) {
          value = enumMapping[value] || value;
        }
      }
      
      // Type conversion
      if (config.type === 'number') {
        value = parseFloat(value) || 0;
      }
      
      // Apply defaults
      if (value === undefined || value === '') {
        if ('default' in config && config.default !== undefined) {
          value = config.default;
        }
      }
      
      normalized[fieldKey] = value;
    });
    
    return normalized as NormalizedEmployee;
  });
}

// Calculate pay gap statistics
export function calculatePayGapStats(employees: NormalizedEmployee[]) {
  const maleSalaries = employees
    .filter(emp => emp.gender === 'male')
    .map(emp => emp.base_salary_sek);
  
  const femaleSalaries = employees
    .filter(emp => emp.gender === 'female')
    .map(emp => emp.base_salary_sek);
  
  const maleMedian = median(maleSalaries);
  const femaleMedian = median(femaleSalaries);
  
  const gapPct = maleMedian > 0 ? ((maleMedian - femaleMedian) / maleMedian) * 100 : 0;
  
  // Calculate gap by department
  const deptGaps = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = { male: [], female: [] };
    }
    // Only include male and female for gap calculation
    if (emp.gender === 'male' || emp.gender === 'female') {
      acc[emp.department][emp.gender].push(emp.base_salary_sek);
    }
    return acc;
  }, {} as Record<string, { male: number[], female: number[] }>);
  
  const deptGapStats = Object.entries(deptGaps)
    .map(([dept, salaries]) => {
      const maleMedian = median(salaries.male);
      const femaleMedian = median(salaries.female);
      const gap = maleMedian > 0 ? ((maleMedian - femaleMedian) / maleMedian) * 100 : 0;
      return { department: dept, gap, maleCount: salaries.male.length, femaleCount: salaries.female.length };
    })
    .filter(stat => stat.maleCount > 0 && stat.femaleCount > 0)
    .sort((a, b) => b.gap - a.gap);
  
  return {
    overallGap: gapPct,
    maleMedian,
    femaleMedian,
    totalEmployees: employees.length,
    maleCount: maleSalaries.length,
    femaleCount: femaleSalaries.length,
    topDepartments: deptGapStats.slice(0, 3)
  };
}

// Helper function to calculate median
function median(values: number[]): number {
  if (values.length === 0) return 0;
  
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// Generate gap trend data from employee data
export function generateGapTrendData(employees: NormalizedEmployee[]): Record<string, any>[] {
  if (employees.length === 0) return [];
  
  // Group employees by month (using hire_date or current month as fallback)
  const monthlyData: Record<string, { male: number[], female: number[] }> = {};
  
  employees.forEach(emp => {
    let monthKey: string;
    
    if (emp.hire_date) {
      try {
        const date = new Date(emp.hire_date);
        monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      } catch {
        monthKey = new Date().toISOString().slice(0, 7);
      }
    } else {
      monthKey = new Date().toISOString().slice(0, 7);
    }
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { male: [], female: [] };
    }
    
    if (emp.gender === 'male' || emp.gender === 'female') {
      monthlyData[monthKey][emp.gender].push(emp.base_salary_sek);
    }
  });
  
  // Calculate gap for each month
  const trendData = Object.entries(monthlyData)
    .map(([month, salaries]) => {
      const maleMedian = median(salaries.male);
      const femaleMedian = median(salaries.female);
      const gap_pct = maleMedian > 0 ? ((maleMedian - femaleMedian) / maleMedian) * 100 : 0;
      
      return {
        month,
        gap_pct: Math.round(gap_pct * 10) / 10, // Round to 1 decimal
        male_median: Math.round(maleMedian),
        female_median: Math.round(femaleMedian)
      };
    })
    .filter(data => data.gap_pct > 0) // Only include months with valid gap data
    .sort((a, b) => a.month.localeCompare(b.month)); // Sort by month
  
  // If no trend data, create a single data point with current gap
  if (trendData.length === 0) {
    const stats = calculatePayGapStats(employees);
    return [{
      month: new Date().toISOString().slice(0, 7),
      gap_pct: Math.round(stats.overallGap * 10) / 10,
      male_median: Math.round(stats.maleMedian),
      female_median: Math.round(stats.femaleMedian)
    }];
  }
  
  return trendData;
}
