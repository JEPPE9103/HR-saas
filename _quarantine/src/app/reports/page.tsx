"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/providers/I18nProvider";
import { useReportStore } from "@/store/report";
import { exportPdf, exportCsv } from "@/services/mockApi";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileDown, 
  PlusCircle, 
  FileText, 
  BarChart3, 
  Lightbulb, 
  TrendingUp, 
  BookOpen,
  Eye,
  Download,
  Trash2,
  Bot,
  Sparkles,
  Save,
  Play
} from "lucide-react";
import { firebaseDb as dbFactory } from "@/lib/firebase/client";
import { reportsRef } from "@/lib/models";
import { addDoc, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { useAuth } from "@/providers/AuthProvider";

type Block = { id: string; type: string; title: string };

const blockLibrary = [
  {
    type: "summary",
    title: "Executive Summary",
    description: "High-level overview of pay equity status and key trends",
    icon: BarChart3,
    color: "text-blue-500"
  },
  {
    type: "kpi",
    title: "KPI Dashboard",
    description: "Core metrics and performance indicators at a glance",
    icon: TrendingUp,
    color: "text-green-500"
  },
  {
    type: "insights",
    title: "AI Insights",
    description: "Intelligent recommendations and findings from your data",
    icon: Lightbulb,
    color: "text-purple-500"
  },
  {
    type: "scenario",
    title: "Scenario Analysis",
    description: "What-if simulations and projected outcomes",
    icon: TrendingUp,
    color: "text-orange-500"
  },
  {
    type: "appendix",
    title: "Data Appendix",
    description: "Detailed methodology and supporting data tables",
    icon: BookOpen,
    color: "text-gray-500"
  }
];

export default function ReportsPage() {
  const { t } = useI18n();
  const blocks = useReportStore((s) => s.blocks);
  const addBlock = useReportStore((s) => s.addBlock);
  const removeBlock = useReportStore((s) => s.removeBlock);
  const { user } = useAuth();
  const db = dbFactory();
  const [saved, setSaved] = useState<{ id:string; title:string; date:string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const hasBlocks = blocks.length > 0;

  // AI Copilot suggestions
  const copilotSuggestions = useMemo(() => [
    {
      text: "Engineering pay gap is 8.2%. Consider adding KPI Dashboard + AI Insights blocks for comprehensive analysis.",
      action: () => {
        addBlock({ type: "kpi", title: "KPI Dashboard" });
        addBlock({ type: "insights", title: "AI Insights" });
      }
    },
    {
      text: "H&M department has compensation outliers. Adding Scenario Analysis block would help visualize impact.",
      action: () => {
        addBlock({ type: "scenario", title: "Outlier Analysis" });
      }
    },
    {
      text: "Female leadership representation trending down. Executive Summary + AI Insights would provide strategic overview.",
      action: () => {
        addBlock({ type: "summary", title: "Leadership Overview" });
        addBlock({ type: "insights", title: "Diversity Insights" });
      }
    },
    {
      text: "Sales team pay gap within acceptable range. KPI Dashboard would highlight performance metrics.",
      action: () => {
        addBlock({ type: "kpi", title: "Sales Performance" });
      }
    }
  ], []);

  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

  function add(type: string, title: string) { 
    addBlock({ type, title }); 
  }

  async function loadReports(){
    if(!user) return setSaved([]);
    const q = query(reportsRef(db), where("uid","==", user.uid), orderBy("createdAt","desc"));
    const snap = await getDocs(q);
    setSaved(snap.docs.map(d=>({ id:d.id, title:(d.data() as any).title || "Untitled", date:new Date((d.data() as any).createdAt||Date.now()).toLocaleDateString() })));
  }
  
  useEffect(()=>{ loadReports(); }, [user]);

  async function saveCurrent(){
    if(!user) return;
    await addDoc(reportsRef(db), { uid:user.uid, title:"Report", blocks, createdAt: Date.now() });
    await loadReports();
  }
  
  async function removeReport(id:string){ 
    await deleteDoc(doc(db, "reports", id)); 
    await loadReports(); 
  }

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData('blockType', blockType);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    setDragOver(true);
    if (index !== undefined) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOver(false);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex?: number) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData('blockType');
    const block = blockLibrary.find(b => b.type === blockType);
    if (block) {
      add(block.type, block.title);
    }
    setIsDragging(false);
    setDragOver(false);
    setDragOverIndex(null);
  };

  const applySuggestion = () => {
    copilotSuggestions[currentSuggestionIndex].action();
    // Rotate to next suggestion
    setCurrentSuggestionIndex((prev) => (prev + 1) % copilotSuggestions.length);
  };

  const nextSuggestion = () => {
    setCurrentSuggestionIndex((prev) => (prev + 1) % copilotSuggestions.length);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">{t("reports.title")}</h1>
          <p className="text-[var(--text-muted)] mt-1">Create executive-ready reports with AI assistance and drag-and-drop blocks</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
        {/* Saved Reports */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("reports.savedReports")}
              </CardTitle>
            </CardHeader>
          <CardContent>
            {saved.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-[var(--ring)] p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--neutral-soft-bg)] flex items-center justify-center">
                    <FileText className="h-8 w-8 text-[var(--text-muted)]" />
                  </div>
                  <h3 className="text-lg font-medium text-[var(--text)] mb-2">No saved reports yet</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-4">
                    Build your first report with the AI Copilot below
                  </p>
                  <Button 
                    onClick={() => add("summary", "Summary")}
                    className="bg-[var(--accent)] hover:bg-[var(--accent-strong)]"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Report
                  </Button>
              </div>
            ) : (
                <div className="space-y-3">
                {saved.map(r => (
                    <motion.div 
                      key={r.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group rounded-xl border border-[var(--ring)] p-4 bg-[var(--panel)] hover:bg-[var(--neutral-soft-bg)] transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-[var(--text)] text-sm">{r.title}</h4>
                          <p className="text-xs text-[var(--text-muted)]">{r.date}</p>
                    </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-[var(--danger)] hover:text-[var(--danger-strong)]"
                            onClick={() => removeReport(r.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                    </div>
                  </div>
                    </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Block Library */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Block Library
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {blockLibrary.map((block) => {
                const IconComponent = block.icon;
                return (
                  <div
                    key={block.type}
                    className={`group cursor-grab active:cursor-grabbing rounded-xl border border-[var(--ring)] p-4 bg-[var(--panel)] hover:bg-[var(--neutral-soft-bg)] hover:shadow-md transition-all duration-200 ${
                      isDragging ? 'opacity-50' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, block.type)}
                    onClick={() => add(block.type, block.title)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-[var(--neutral-soft-bg)] ${block.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-[var(--text)] text-sm">{block.title}</h4>
                        <p className="text-xs text-[var(--text-muted)] mt-1">{block.description}</p>
                      </div>
                      <PlusCircle className="h-4 w-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
                );
              })}
          </CardContent>
        </Card>
      </div>

        {/* Main Workspace */}
        <div className="lg:col-span-3 space-y-6">
          {/* Builder Workspace */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[var(--text)]">
                  Report Builder
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="secondary" 
                    onClick={saveCurrent}
                    className="border-[var(--ring)] text-[var(--text)] hover:bg-[var(--neutral-soft-bg)]"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {t("common.save")}
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="border-[var(--ring)] text-[var(--text)] hover:bg-[var(--neutral-soft-bg)]"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t("common.view")}
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={async()=>{ 
                      const url = await exportCsv("demo-se"); 
                      const a=document.createElement("a"); 
                      a.href=url; 
                      a.download="report.csv"; 
                      a.click(); 
                    }}
                    className="border-[var(--ring)] text-[var(--text)] hover:bg-[var(--neutral-soft-bg)]"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t("common.exportCsv")}
                  </Button>
                  <Button 
                    onClick={async()=>{ 
                      const url = await exportPdf("demo-se"); 
                      const a=document.createElement("a"); 
                      a.href=url; 
                      a.download="report.pdf"; 
                      a.click(); 
                    }}
                    className="bg-[var(--accent)] hover:bg-[var(--accent-strong)]"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    {t("common.exportPdf")}
                  </Button>
                </div>
              </div>
            </CardHeader>
          <CardContent>
              <div
                className={`min-h-[400px] rounded-xl border-2 border-dashed transition-all duration-200 ${
                  dragOver 
                    ? 'border-[var(--accent)] bg-[var(--accent-soft-bg)]' 
                    : 'border-[var(--ring)] bg-[var(--panel)]'
                } ${!hasBlocks ? 'p-12' : 'p-6'}`}
                onDragOver={(e) => handleDragOver(e)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e)}
              >
                {!hasBlocks ? (
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-[var(--neutral-soft-bg)] flex items-center justify-center mb-4">
                      <Sparkles className="h-8 w-8 text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-lg font-medium text-[var(--text)] mb-2">
                      Start Building Your Report
                    </h3>
                    <p className="text-[var(--text-muted)] mb-6">
                      Drag blocks from the library to get started →
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)]"></div>
                      <span>Drop zone ready</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
            <AnimatePresence>
                      {blocks.map((b, index) => (
                        <motion.div 
                          key={b.id} 
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className={`group rounded-xl border border-[var(--ring)] p-4 bg-[var(--card)] hover:shadow-md transition-all duration-200 ${
                            dragOverIndex === index ? 'ring-2 ring-[var(--accent)] bg-[var(--accent-soft-bg)]' : ''
                          }`}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-[var(--neutral-soft-bg)]">
                                {blockLibrary.find(bl => bl.type === b.type)?.icon && 
                                  React.createElement(blockLibrary.find(bl => bl.type === b.type)!.icon, { className: "h-4 w-4" })
                                }
                              </div>
                              <h4 className="font-medium text-[var(--text)]">{b.title}</h4>
                            </div>
                            <Button 
                              variant="ghost" 
                              onClick={() => removeBlock(b.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--danger)] hover:text-[var(--danger-strong)]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                  </div>
                          
                          {/* Block previews */}
                  {b.type === "kpi" && (
                            <div className="grid grid-cols-3 gap-3 text-sm">
                              <div className="rounded-lg border border-[var(--ring)] p-3 text-center bg-[var(--panel)]">
                                <div className="font-semibold text-[var(--text)]">5.6%</div>
                                <div className="text-xs text-[var(--text-muted)]">Pay Gap</div>
                              </div>
                              <div className="rounded-lg border border-[var(--ring)] p-3 text-center bg-[var(--panel)]">
                                <div className="font-semibold text-[var(--text)]">4</div>
                                <div className="text-xs text-[var(--text-muted)]">High Risk Roles</div>
                              </div>
                              <div className="rounded-lg border border-[var(--ring)] p-3 text-center bg-[var(--panel)]">
                                <div className="font-semibold text-[var(--text)]">2</div>
                                <div className="text-xs text-[var(--text-muted)]">Risk Sites</div>
                              </div>
                    </div>
                  )}
                  {b.type === "insights" && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--danger-soft-bg)]">
                                <div className="w-2 h-2 rounded-full bg-[var(--danger)]"></div>
                                <span className="text-sm text-[var(--text)]">Engineering gap 8.2% (High)</span>
                              </div>
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--warning-soft-bg)]">
                                <div className="w-2 h-2 rounded-full bg-[var(--warning)]"></div>
                                <span className="text-sm text-[var(--text)]">H&M has 2 outliers &gt;40% above median</span>
                              </div>
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--caution-soft-bg)]">
                                <div className="w-2 h-2 rounded-full bg-[var(--caution)]"></div>
                                <span className="text-sm text-[var(--text)]">Female leadership % trending down</span>
                              </div>
                            </div>
                  )}
                  {b.type === "scenario" && (
                            <div className="p-3 rounded-lg bg-[var(--accent-soft-bg)] border border-[var(--accent-soft-ring)]">
                              <div className="text-sm text-[var(--text)] font-medium mb-1">Scenario: +5% Engineers</div>
                              <div className="text-xs text-[var(--text-muted)]">
                                New gap: 2.1% • Budget impact: +€240k
                              </div>
                            </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
                  </div>
                )}
              </div>
          </CardContent>
        </Card>

          {/* AI Copilot */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[var(--accent-soft-bg)]">
                  <Bot className="h-6 w-6 text-[var(--accent)]" />
          </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
                    {t("reports.copilot")}
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--accent-soft-bg)] text-[var(--accent-soft-fg)]">
                      AI Assistant
                    </span>
                  </h3>
                  <p className="text-[var(--text-muted)] mb-4 leading-relaxed">
                    {copilotSuggestions[currentSuggestionIndex].text}
                  </p>
                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={applySuggestion}
                      className="bg-[var(--accent)] hover:bg-[var(--accent-strong)]"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Apply Suggestion
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={nextSuggestion}
                      className="border-[var(--ring)] text-[var(--text)] hover:bg-[var(--neutral-soft-bg)]"
                    >
                      Next Suggestion
                    </Button>
              </div>
            </div>
          </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


