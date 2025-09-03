"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Brain, Loader2, X, Send, Sparkles } from "lucide-react";

interface Message { 
  role: "user" | "assistant"; 
  content: string;
  timestamp: Date;
}

export function OpenCopilotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [datasetId] = useState("demo-se"); // In production, get from context
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [isOpen, messages]);

  // Add welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: `👋 **Hej! Jag är din AI-assistent för lönetransparens!**

🚀 **Vad kan jag hjälpa dig med?**

**🔍 Analys & Insikter:**
• /analyze - Djup AI-analys av era data
• /recommend - Konkreta åtgärdsförslag  
• /trend - Prediktiv trendanalys
• /learn - Se vad AI har lärt sig

**🎯 Planering & Åtgärder:**
• /action - Handlingsplan med milstolpar
• /simulate - Testa olika scenarier
• /monitor - Sätt upp AI-övervakning
• /dashboard - Live översikt

**📊 Övervakning & Varningar:**
• /alerts - Konfigurera varningar
• /report - Generera rapporter

**💡 Prova att skriva:**
"Vilka avdelningar har störst lönegap?"
"Skapa en handlingsplan för att minska gapet"
"Vad händer om vi ökar löner med 5%?"

🎯 **AI-tip:** Jag blir smartare ju mer ni använder mig och kan identifiera mönster i era data!`,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sessionId: "local", 
          datasetId, 
          message: userMessage 
        }),
      });
      
      const data = await response.json();
      
      // Add AI response
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.text || "Tyvärr kunde jag inte svara just nu. Försök igen!",
        timestamp: new Date()
      }]);
      
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "❌ Ett fel uppstod. Kontrollera din internetanslutning och försök igen.",
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
                    <p className="text-blue-100 text-sm">Lönetransparens-assistent</p>
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
                        {message.content}
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
                  Snabbkommandon
                </p>
                <div className="flex flex-wrap gap-2">
                  <QuickCommand label="Analysera" value="/analyze" emoji="🔍" />
                  <QuickCommand label="Rekommendera" value="/recommend" emoji="🎯" />
                  <QuickCommand label="Trend" value="/trend" emoji="📈" />
                  <QuickCommand label="Handlingsplan" value="/action" emoji="📋" />
                  <QuickCommand label="Övervaka" value="/monitor" emoji="📊" />
                  <QuickCommand label="Lära" value="/learn" emoji="🧠" />
                </div>
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ställ en fråga eller använd kommandon..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
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


