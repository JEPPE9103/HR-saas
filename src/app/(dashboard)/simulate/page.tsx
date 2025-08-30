"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useI18n } from "@/providers/I18nProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart,
} from "recharts";
import { 
  TrendingDown, Euro, ShieldAlert, Play, ArrowRight, Percent, Users, 
  AlertTriangle, TrendingUp, CheckCircle, Info, Loader2 
} from "lucide-react";

type DimKey = 'role' | 'department' | 'site' | 'country';

interface SimulationResult {
  newGap: number;
  currentGap: number;
  costImpact: number;
  complianceRisk: "Low" | "Medium" | "High";
  impactedEmployees: number;
  gapReduction: number;
}

export default function SimulatePage() {
  const { t } = useI18n();
  const [dimensionKey, setDimensionKey] = useState<DimKey>('role');
  const [role, setRole] = useState("Engineer");
  const [percent, setPercent] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [isOutdated, setIsOutdated] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  // Default result for always-visible results panel
  const defaultResult: SimulationResult = {
    newGap: 4.4,
    currentGap: 5.6,
    costImpact: 240000,
    complianceRisk: "Medium",
    impactedEmployees: 126,
    gapReduction: 1.2
  };

  // Generate chart data
  const chartData = useMemo(() => {
    const currentGap = result?.currentGap || defaultResult.currentGap;
    const newGap = result?.newGap || defaultResult.newGap;
    
    return Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      current: currentGap + (Math.random() - 0.5) * 0.4,
      simulated: i < 6 ? currentGap + (Math.random() - 0.5) * 0.4 : newGap + (Math.random() - 0.5) * 0.2
    }));
  }, [result]);

  // Animated values for KPI cards
  const [animatedValues, setAnimatedValues] = useState({
    newGap: 0,
    costImpact: 0,
    gapReduction: 0
  });

  useEffect(() => {
    if (result) {
      // Animate KPI values
      const duration = 1000;
      const steps = 60;
      
      const animateValue = (start: number, end: number, setter: (value: number) => void) => {
        const increment = (end - start) / steps;
        let current = start;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= end) {
            setter(end);
            clearInterval(timer);
          } else {
            setter(current);
          }
        }, duration / steps);

        return () => clearInterval(timer);
      };

      animateValue(0, result.newGap, (value) => setAnimatedValues(prev => ({ ...prev, newGap: value })));
      animateValue(0, result.costImpact, (value) => setAnimatedValues(prev => ({ ...prev, costImpact: value })));
      animateValue(0, result.gapReduction, (value) => setAnimatedValues(prev => ({ ...prev, gapReduction: value })));
    }
  }, [result]);

  async function runSimulation() {
    setIsRunning(true);
    setIsOutdated(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    const res = await fetch("/api/copilot/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: "local", datasetId: "demo-se", message: `/simulate role:"${role}" +${percent}%` }),
    });
    const data = await res.json();
      
    setResult({
        newGap: 2.1,
        currentGap: 5.6,
        costImpact: 240000,
        complianceRisk: "Low" as const,
        impactedEmployees: 126,
        gapReduction: 3.5
      });
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsRunning(false);
    }
  }

  // Mark results as outdated when inputs change
  useEffect(() => {
    if (result) {
      setIsOutdated(true);
    }
  }, [dimensionKey, role, percent]);

  const currentResult = result || defaultResult;
  const isOutdatedOrLoading = isOutdated || isRunning;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] mb-2">Pay Equity Simulator</h1>
        <p className="text-lg text-[var(--text-muted)]">
          Adjust compensation levels and instantly see the impact on pay gap, budget, and compliance risk
        </p>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Parameters */}
        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm border-[var(--ring)] bg-[var(--card)]">
            <CardHeader className="pb-4">
                              <CardTitle className="text-xl font-semibold text-[var(--text)] flex items-center gap-2">
                  <Play className="h-5 w-5 text-[var(--accent)]" />
                  Adjust Parameters
                  <div className="group relative">
                    <Info className="h-4 w-4 text-[var(--text-muted)] cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs bg-[var(--card)] border border-[var(--ring)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      Adjust roles and percentages to see the impact instantly
                    </div>
                  </div>
                </CardTitle>
        </CardHeader>
            <CardContent className="space-y-6">
              {/* Dimension */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text)] flex items-center gap-2">
                  Dimension
                  <div className="group relative">
                    <Info className="h-4 w-4 text-[var(--text-muted)] cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs bg-[var(--card)] border border-[var(--ring)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      Select the dimension to adjust
                    </div>
                  </div>
                </label>
                <select 
                  value={dimensionKey} 
                  onChange={(e) => setDimensionKey(e.target.value as DimKey)} 
                  className="w-full rounded-xl border px-4 py-3 text-sm border-[var(--ring)] bg-[var(--card)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  <option value="role">Role</option>
                  <option value="department">Department</option>
                  <option value="site">Site</option>
                  <option value="country">Country</option>
            </select>
                <p className="text-xs text-[var(--text-muted)]">Select the dimension to adjust</p>
              </div>

              {/* Role/Department/Site/Country */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text)] flex items-center gap-2">
                  {dimensionKey.charAt(0).toUpperCase() + dimensionKey.slice(1)}
                  <div className="group relative">
                    <Info className="h-4 w-4 text-[var(--text-muted)] cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs bg-[var(--card)] border border-[var(--ring)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      Select the {dimensionKey} to adjust
                    </div>
                  </div>
          </label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  className="w-full rounded-xl border px-4 py-3 text-sm border-[var(--ring)] bg-[var(--card)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  <option value="Engineer">Engineer</option>
                  <option value="Marketing">Marketing</option>
                  <option value="ProjectManager">Project Manager</option>
                  <option value="SalesExecutive">Sales Executive</option>
            </select>
                <p className="text-xs text-[var(--text-muted)]">Select the {dimensionKey} to adjust</p>
              </div>

              {/* Percentage */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text)] flex items-center gap-2">
                  Percentage Increase
                  <div className="group relative">
                    <Info className="h-4 w-4 text-[var(--text-muted)] cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs bg-[var(--card)] border border-[var(--ring)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      Adjust the % increase to simulate targeted raises
                    </div>
                  </div>
          </label>
                <div className="flex items-center gap-3">
                  <input 
                    aria-label="percentage" 
                    type="range" 
                    min={0} 
                    max={20} 
                    value={percent} 
                    onChange={(e) => setPercent(Number(e.target.value))} 
                    className="flex-1 h-2 bg-[var(--ring)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--accent)] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                  />
                  <Input 
                    type="number" 
                    min={0} 
                    max={20} 
                    value={percent} 
                    onChange={(e) => setPercent(Number(e.target.value))} 
                    className="w-20 text-center"
                  />
            </div>
                <p className="text-xs text-[var(--text-muted)]">Adjust the percentage increase for the selected {dimensionKey}</p>
          </div>

              {/* Run Simulation Button */}
              <div className="pt-4">
                <Button 
                  onClick={runSimulation} 
                  disabled={isRunning}
                  className="w-full bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Running Simulation...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Simulation
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
                {isOutdated && (
                  <p className="text-xs text-[var(--warning)] mt-2 text-center">
                    Results are outdated. Run simulation to update.
                  </p>
                )}
          </div>
        </CardContent>
      </Card>
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl shadow-sm border-[var(--ring)] bg-[var(--card)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-[var(--text)]">
                Simulation Results
              </CardTitle>
              </CardHeader>
            <CardContent className="space-y-6">
              {/* KPI Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-4 rounded-xl border border-[var(--ring)] bg-[var(--card)]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 rounded-full bg-[var(--accent-soft-bg)] text-[var(--accent)]">
                      <Percent className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-[var(--text-muted)]">New Gap</span>
                  </div>
                  <div className="text-xl font-bold text-[var(--text)]">
                    {isOutdatedOrLoading ? (
                      <div className="h-6 bg-[var(--ring)] rounded animate-pulse"></div>
                    ) : (
                      `${animatedValues.newGap.toFixed(1)}%`
                    )}
                  </div>
                  <div className="text-xs text-[var(--success)]">
                    {isOutdatedOrLoading ? (
                      <div className="h-3 bg-[var(--ring)] rounded animate-pulse mt-1"></div>
                    ) : (
                      `-${animatedValues.gapReduction.toFixed(1)}pp vs current`
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[var(--ring)] bg-[var(--card)]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 rounded-full bg-[var(--warning-soft-bg)] text-[var(--warning)]">
                      <Euro className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-[var(--text-muted)]">Cost Impact</span>
                  </div>
                  <div className="text-xl font-bold text-[var(--text)]">
                    {isOutdatedOrLoading ? (
                      <div className="h-6 bg-[var(--ring)] rounded animate-pulse"></div>
                    ) : (
                      `€${(animatedValues.costImpact / 1000).toFixed(0)}k`
                    )}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">Annual budget increase</div>
                </div>

                <div className="p-4 rounded-xl border border-[var(--ring)] bg-[var(--card)]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1 rounded-full ${
                      currentResult.complianceRisk === "High" ? "bg-[var(--danger-soft-bg)] text-[var(--danger)]" :
                      currentResult.complianceRisk === "Medium" ? "bg-[var(--warning-soft-bg)] text-[var(--warning)]" :
                      "bg-[var(--success-soft-bg)] text-[var(--success)]"
                    }`}>
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-[var(--text-muted)]">Compliance Risk</span>
                  </div>
                  <div className="text-xl font-bold text-[var(--text)]">
                    {isOutdatedOrLoading ? (
                      <div className="h-6 bg-[var(--ring)] rounded animate-pulse"></div>
                    ) : (
                      currentResult.complianceRisk
                    )}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">{currentResult.impactedEmployees} employees affected</div>
                </div>
                </div>

              {/* Chart */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-[var(--text)]">Pay Gap Trend (12 months)</h4>
                  <div className="group relative">
                    <Info className="h-3 w-3 text-[var(--text-muted)] cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs bg-[var(--card)] border border-[var(--ring)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      Shows current vs simulated pay gap over time
                    </div>
                  </div>
                </div>
                <div className="h-64 w-full rounded-xl border border-[var(--ring)] p-4">
                  {isOutdatedOrLoading ? (
                    <div className="h-full bg-[var(--ring)] rounded animate-pulse"></div>
                  ) : (
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--text-muted)" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="var(--text-muted)" stopOpacity={0.05}/>
                          </linearGradient>
                          <linearGradient id="colorSimulated" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--ring)" strokeOpacity={0.2} />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                          axisLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                          axisLine={{ stroke: 'var(--ring)', strokeOpacity: 0.3 }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'var(--card)',
                            border: '1px solid var(--ring)',
                            borderRadius: '12px',
                            color: 'var(--text)',
                            fontSize: '12px'
                          }}
                          formatter={(value: any, name: string) => [
                            `${value}%`, 
                            name === 'current' ? 'Current Gap' : 'Simulated Gap'
                          ]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="current" 
                          stroke="var(--text-muted)" 
                          fill="url(#colorCurrent)"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="current" 
                          stroke="var(--text-muted)" 
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          dot={{ fill: 'var(--text-muted)', strokeWidth: 2, r: 3 }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="simulated" 
                          stroke="var(--accent)" 
                          fill="url(#colorSimulated)"
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="simulated" 
                          stroke="var(--accent)" 
                          strokeWidth={2}
                          dot={{ fill: 'var(--accent)', strokeWidth: 2, r: 3 }}
                        />
                      </AreaChart>
                  </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Explanatory Text */}
              <div className="rounded-xl border border-[var(--ring)] p-4 bg-[var(--neutral-soft-bg)]">
                <p className="text-sm text-[var(--text)] leading-relaxed">
                  {isOutdatedOrLoading ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-[var(--ring)] rounded animate-pulse"></div>
                      <div className="h-4 bg-[var(--ring)] rounded animate-pulse w-3/4"></div>
                    </div>
                  ) : (
                    `Your adjustment is projected to reduce the gap by ${animatedValues.gapReduction.toFixed(1)}pp at an estimated cost of €${(animatedValues.costImpact / 1000).toFixed(0)}k, lowering compliance risk to ${currentResult.complianceRisk}.`
                  )}
                </p>
                </div>

              {/* Scenario Summary */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-[var(--text-muted)]">Scenario:</span>
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--accent-soft-bg)] text-[var(--accent)] text-xs">
                  <Users className="h-3 w-3" />
                  {dimensionKey}
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--warning-soft-bg)] text-[var(--warning)] text-xs">
                  {role}
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--success-soft-bg)] text-[var(--success)] text-xs">
                  <TrendingUp className="h-3 w-3" />
                  +{percent}%
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}


