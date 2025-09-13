"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useI18n } from "@/providers/I18nProvider";
import { Brain, Loader2, X, Send, Sparkles } from "lucide-react";

interface Message { 
  role: "user" | "assistant"; 
  content: string;
  timestamp: Date;
}

export function OpenCopilotButton() {
  const { t, locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [datasetId] = useState("demo-se"); // In production, get from context
  const panelRef = useRef<HTMLDivElement | null>(null);
  function sanitizeMarkdown(input: string): string {
    let s = input || "";
    // remove bold/italic/code markers
    s = s.replace(/\*\*(.*?)\*\*/g, "$1");
    s = s.replace(/\*(.*?)\*/g, "$1");
    s = s.replace(/__(.*?)__/g, "$1");
    s = s.replace(/`{1,3}([^`]+)`{1,3}/g, "$1");
    // convert headings to plain text
    s = s.replace(/^#{1,6}\s*/gm, "");
    // links [text](url) -> text
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
    // lists: keep bullets
    s = s.replace(/^\s*[-*]\s+/gm, "• ");
    // blockquotes
    s = s.replace(/^>\s?/gm, "");
    return s.trim();
  }

  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [isOpen, messages]);

  // Welcome and restore history when panel opens
  useEffect(() => {
    if (!isOpen) return;
    const key = `copilot_${datasetId}_${locale}`;
    try {
      const saved = sessionStorage.getItem(key);
      if (saved) {
        setMessages(JSON.parse(saved));
        return;
      }
    } catch {}
    if (messages.length === 0) {
      const welcome = locale === 'sv'
        ? `👋 **Hej! Jag är din AI‑copilot för lönetransparens.**

🔍 Analys: /analyze • /recommend • /trend • /learn
🎯 Åtgärder: /action • /simulate • /monitor • /dashboard
📄 Export: /report • /alerts

💡 Exempel: "Vilka avdelningar har störst lönegap?"`
        : `👋 **Hi! I’m your pay equity copilot.**

🔍 Analyze: /analyze • /recommend • /trend • /learn
🎯 Actions: /action • /simulate • /monitor • /dashboard
📄 Exports: /report • /alerts

💡 Try: "Which departments have the largest gap?"`;
      setMessages([{ role: "assistant", content: welcome, timestamp: new Date() }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, locale]);

  // Persist session messages per dataset/locale
  useEffect(() => {
    if (!isOpen) return;
    const key = `copilot_${datasetId}_${locale}`;
    try { sessionStorage.setItem(key, JSON.stringify(messages.slice(-50))); } catch {}
  }, [messages, datasetId, locale, isOpen]);

  async function sendMessage() {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    
    // Add user message
    setMessages(prev => [...prev, {
      role: "user",
      content: userMessage,
      timestamp: new Date()
    }]);

    try {
      const response = await fetch("/api/copilot/ask", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-locale": locale,
          "x-tenant-id": datasetId,
        },
        body: JSON.stringify({ 
          sessionId: "local", 
          datasetId, 
          message: userMessage 
        }),
      });
      const data = await response.json();
      const fallback = locale === 'sv' ? "Tyvärr kunde jag inte svara just nu. Försök igen!" : "Sorry, I couldn’t answer now. Please try again.";
      const rateMsg = locale === 'sv' ? "För många förfrågningar. Försök igen om en minut." : "Too many requests. Try again in a minute.";
      // Add AI response
      setMessages(prev => [...prev.slice(-49), {
        role: "assistant",
        content: data?.text || data?.error || (response.status === 429 ? rateMsg : fallback),
        timestamp: new Date()
      }]);

    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: locale === 'sv' ? "❌ Ett fel uppstod. Kontrollera din internetanslutning och försök igen." : "❌ An error occurred. Check your connection and try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  function QuickCommand({ label, value, emoji }: { label: string; value: string; emoji: string }) {
    return (
      <button
        onClick={() => setInput(value)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 font-medium"
      >
        <span>{emoji}</span>
        {label}
      </button>
    );
  }

  function formatTimestamp(date: Date): string {
    return date.toLocaleTimeString('sv-SE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  return (
    <>
      {/* Floating Copilot Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-6 bottom-6 z-50 group"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            
            {/* Main button */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full p-4 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110">
              <Brain className="h-6 w-6" />
            </div>
            
            {/* Pulse animation */}
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
          </div>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-slate-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              AI Copilot
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-slate-900"></div>
            </div>
          </div>
        </button>
      )}

      {/* Copilot Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-6 bottom-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Brain className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold text-lg">AI Copilot</h3>
                    <p className="text-blue-100 text-sm">{locale==='sv' ? 'Lönetransparens‑assistent' : 'Pay equity assistant'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={panelRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
            >
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === "user" 
                        ? "bg-blue-600 text-white" 
                        : "bg-white border border-slate-200 text-slate-800"
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {sanitizeMarkdown(message.content)}
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.role === "user" ? "text-blue-100" : "text-slate-500"
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    message.role === "user" 
                      ? "bg-blue-600 text-white order-1 ml-2" 
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white order-2 mr-2"
                  }`}>
                    {message.role === "user" ? "U" : <Brain className="h-4 w-4" />}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center mr-2">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI tänker...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Commands */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="mb-3">
                <p className="text-xs text-slate-600 mb-2 font-medium flex items-center gap-2">
                  <Sparkles className="h-3 w-3" />
                  {locale === 'sv' ? 'Snabbkommandon' : 'Quick commands'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <QuickCommand label={locale==='sv'?'Analysera':'Analyze'} value="/analyze" emoji="🔍" />
                  <QuickCommand label={locale==='sv'?'Rekommendera':'Recommend'} value="/recommend" emoji="🎯" />
                  <QuickCommand label={locale==='sv'?'Trend':'Trend'} value="/trend" emoji="📈" />
                  <QuickCommand label={locale==='sv'?'Handlingsplan':'Action plan'} value="/action" emoji="📋" />
                  <QuickCommand label={locale==='sv'?'Övervaka':'Monitor'} value="/monitor" emoji="📊" />
                  <QuickCommand label={locale==='sv'?'Lära':'Learn'} value="/learn" emoji="🧠" />
                </div>
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={locale==='sv' ? 'Ställ en fråga eller använd kommandon...' : 'Ask a question or use a command...'}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-xs text-slate-500 mt-2 text-center">
                💡 Prova: "Vilka avdelningar har störst lönegap?"
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


