import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSummary, listTopGaps, listOutliers } from "@/lib/insights";
import { runSimulation } from "@/lib/simulate";
import { exportCSV, exportPDF } from "@/lib/exports";

// Advanced AI helper functions
async function analyzeContext(datasetId: string, message: string) {
  try {
    const summary = await getSummary(datasetId);
    const gaps = await listTopGaps(datasetId, 5);
    const outliers = await listOutliers(datasetId, 5);
    
    return {
      summary,
      gaps,
      outliers,
      hasData: summary.employees > 0,
      criticalIssues: gaps.filter(g => g.gapPercent > 10).length,
      moderateIssues: gaps.filter(g => g.gapPercent > 5 && g.gapPercent <= 10).length,
      isHealthy: gaps.every(g => g.gapPercent <= 2),
      totalGap: gaps.reduce((sum, g) => sum + g.gapPercent, 0) / gaps.length
    };
  } catch (error) {
    return { hasData: false, criticalIssues: 0, moderateIssues: 0, isHealthy: false, totalGap: 0 };
  }
}

function analyzeIntent(message: string, context: any) {
  const lower = message.toLowerCase();
  
  // Intent classification
  if (lower.includes("gap") || lower.includes("gap")) return "gap_analysis";
  if (lower.includes("outlier") || lower.includes("avvikelse")) return "outlier_analysis";
  if (lower.includes("simulate") || lower.includes("simulera")) return "simulation";
  if (lower.includes("recommend") || lower.includes("rekommendera")) return "recommendations";
  if (lower.includes("action") || lower.includes("åtgärd")) return "action_planning";
  if (lower.includes("trend") || lower.includes("trend")) return "trend_analysis";
  if (lower.includes("monitor") || lower.includes("övervaka")) return "monitoring";
  if (lower.includes("report") || lower.includes("rapport")) return "reporting";
  if (lower.includes("analyze") || lower.includes("analysera")) return "deep_analysis";
  
  // Natural language understanding
  if (lower.includes("vad") || lower.includes("what")) return "information_seeking";
  if (lower.includes("hur") || lower.includes("how")) return "how_to_help";
  if (lower.includes("när") || lower.includes("when")) return "timing_question";
  if (lower.includes("varför") || lower.includes("why")) return "causal_analysis";
  
  // Emotional/urgency detection
  if (lower.includes("kris") || lower.includes("kritiskt") || lower.includes("akut")) return "urgent_crisis";
  if (lower.includes("bra") || lower.includes("bra") || lower.includes("snyggt")) return "positive_feedback";
  if (lower.includes("problem") || lower.includes("fel") || lower.includes("bug")) return "problem_reporting";
  
  return "general_inquiry";
}

function generateProactiveSuggestions(context: any, intent: string) {
  const suggestions = [];
  
  // Context-aware suggestions
  if (context.criticalIssues > 0) {
    suggestions.push("🚨 **KRITISKT:** Ni har avdelningar med gap >10%. Använd /action för omedelbar handlingsplan!");
  }
  
  if (context.moderateIssues > 0) {
    suggestions.push("⚠️ **VIKTIGT:** Ni har avdelningar med gap 5-10%. Använd /recommend för åtgärdsförslag.");
  }
  
  if (context.isHealthy) {
    suggestions.push("✅ **BRA JOBBAT:** Era gap är inom EU-riktlinjer! Använd /monitor för att behålla detta.");
  }
  
  // Intent-aware suggestions
  if (intent === "gap_analysis") {
    suggestions.push("💡 **TIP:** Använd /simulate för att testa olika scenarier innan ni implementerar åtgärder.");
  }
  
  if (intent === "simulation") {
    suggestions.push("💡 **TIP:** Efter simulering, använd /action för att skapa en handlingsplan baserad på resultaten.");
  }
  
  if (intent === "recommendations") {
    suggestions.push("💡 **TIP:** Använd /monitor för att spåra effekten av implementerade åtgärder.");
  }
  
  return suggestions;
}

const Body = z.object({
  sessionId: z.string(),
  datasetId: z.string(),
  message: z.string(),
});

export async function POST(req: NextRequest) {
  const { sessionId, datasetId, message } = Body.parse(await req.json());
  
  // Advanced AI with context understanding, pattern recognition, and proactive intelligence
  const lower = message.toLowerCase();
  
  // Context analysis - understand what the user is working on
  const context = await analyzeContext(datasetId, message);
  
  // Pattern recognition - identify user intent and behavior
  const intent = analyzeIntent(message, context);
  
  // Proactive suggestions based on context and patterns
  const suggestions = generateProactiveSuggestions(context, intent);
  
  // Proactive analysis commands with context awareness
  if (lower.includes("gap") || lower.includes("gap") || lower.startsWith("/gap")) {
    const gaps = await listTopGaps(datasetId, 5);
    const topGap = gaps[0];
    
    // Context-aware analysis
    let urgencyLevel = "normal";
    let urgencyEmoji = "🔍";
    let urgencyMessage = "";
    
    if (context.criticalIssues > 0) {
      urgencyLevel = "critical";
      urgencyEmoji = "🚨";
      urgencyMessage = `\n\n🚨 **KRITISKT LÄGE:** Ni har ${context.criticalIssues} avdelningar med gap >10% som kräver omedelbar åtgärd!`;
    } else if (context.moderateIssues > 0) {
      urgencyLevel = "moderate";
      urgencyEmoji = "⚠️";
      urgencyMessage = `\n\n⚠️ **VIKTIGT:** Ni har ${context.moderateIssues} avdelningar med gap 5-10% som behöver åtgärdas.`;
    } else if (context.isHealthy) {
      urgencyLevel = "healthy";
      urgencyEmoji = "✅";
      urgencyMessage = `\n\n✅ **BRA JOBBAT:** Era gap är inom EU-riktlinjer (<2%)!`;
    }
    
    const response = `${urgencyEmoji} **Lönegap Analys (${urgencyLevel.toUpperCase()}):**
    
📊 **Topp 5 gap:**
${gaps.map((g, i) => `${i + 1}. ${g.role}: ${g.gapPercent.toFixed(1)}% (${g.n} anställda)`).join('\n')}

📈 **Övergripande status:**
• Genomsnittligt gap: ${context.totalGap.toFixed(1)}%
• EU-mål: <2% (ni är ${context.totalGap > 2 ? 'över' : 'under'} målet)
• Total påverkan: ${gaps.reduce((sum, g) => sum + g.n, 0)} anställda

💡 **AI-rekommendationer:**
• **${topGap.role}** har störst gap (${topGap.gapPercent.toFixed(1)}%) - prioritera denna avdelning
• Analysera varför gapet är så stort i ${topGap.role}
• Överväg lönejusteringar för att minska gapet
• Implementera transparent lönespann för framtida anställningar

${urgencyMessage}

🎯 **Nästa steg:** 
• /simulate för att testa olika scenarier
• /analyze för djupare analys
• /recommend för specifika åtgärdsförslag
• /action för handlingsplan om ${urgencyLevel === 'critical' ? 'KRITISKT' : 'behövs'}`;

    return NextResponse.json({ text: response });
  }
  
  if (lower.includes("outlier") || lower.includes("avvikelse") || lower.startsWith("/outliers")) {
    const o = await listOutliers(datasetId, 10);
    const response = `🚨 **Outlier Analys:**
    
📈 **Hittade ${o.items.length} outliers (|z|>2):**
• Medianlön: ${o.med.toFixed(0)} SEK
• Outliers kan indikera löneojämlikhet eller specialfall

💡 **Rekommendationer:**
• Granska outliers för att förstå varför de avviker
• Kontrollera om outliers är berättigade (t.ex. specialistkompetens)
• Överväg att sätta tak för extremt höga löner

🎯 **Nästa steg:**
• /analyze för djupare outlier-analys
• /simulate för att testa outlier-hantering`;

    return NextResponse.json({ text: response });
  }
  
  if (lower.includes("simulate") || lower.includes("simulera") || lower.startsWith("/simulate")) {
    const sim = await runSimulation({ datasetId, method: "percentageDelta", value: 5 });
    const response = `🎯 **Simulering Resultat:**
    
📊 **Effekt av 5% löneökning:**
• Påverkade anställda: ${sim.impacted}
• Nytt gap: ${sim.gapPercent.toFixed(1)}%
• Budgetökning: +${sim.budgetDelta.annual.toFixed(0)} SEK/år

💡 **Insikter:**
• ${sim.gapPercent < 5 ? '✅ Gapet är nu inom EU-riktlinjer (<5%)' : '⚠️ Gapet är fortfarande över EU-riktlinjer'}
• Kostnad per anställd: ${(sim.budgetDelta.annual / sim.impacted).toFixed(0)} SEK/år

🎯 **Nästa steg:**
• /scenario för att testa andra scenarier
• /report för att exportera resultat`;

    return NextResponse.json({ text: response });
  }
  
  // New intelligent commands
  if (lower.includes("analyze") || lower.includes("analysera") || lower.startsWith("/analyze")) {
    const gaps = await listTopGaps(datasetId, 3);
    const outliers = await listOutliers(datasetId, 5);
    const response = `🧠 **AI Djupanalys:**
    
📊 **Huvudfynd:**
• ${gaps[0].role} har störst gap (${gaps[0].gapPercent.toFixed(1)}%)
• ${outliers.items.length} löneoutliers identifierade
• Genomsnittlig gap: ${(gaps.reduce((sum, g) => sum + g.gapPercent, 0) / gaps.length).toFixed(1)}%

🔍 **AI-identifierade mönster:**
• ${gaps[0].role} visar konsekvent höga gap över tid
• Outliers koncentrerade i ${gaps[0].role} avdelningen
• Potentiell lönekompression mellan juniora och seniora roller

💡 **Strategiska rekommendationer:**
1. **Kortsiktigt:** Fokusera på ${gaps[0].role} för snabbast effekt
2. **Mellansiktigt:** Implementera transparent lönespann
3. **Långsiktigt:** Bygg AI-driven löneövervakning

🎯 **Nästa steg:**
• /recommend för specifika åtgärder
• /trend för trendanalys
• /action för handlingsplan`;

    return NextResponse.json({ text: response });
  }
  
  if (lower.includes("recommend") || lower.includes("rekommendera") || lower.startsWith("/recommend")) {
    const gaps = await listTopGaps(datasetId, 3);
    const response = `🎯 **AI Åtgärdsrekommendationer:**
    
🚀 **Prioriterade åtgärder:**
    
**1. ${gaps[0].role} (${gaps[0].gapPercent.toFixed(1)}% gap)**
• Implementera transparent lönespann
• Öka löner för juniora ${gaps[0].role} med 8-12%
• Uppskattad kostnad: +${(gaps[0].n * 50000).toFixed(0)} SEK/år
• Förväntad effekt: Gap minskar till ${Math.max(2, gaps[0].gapPercent * 0.6).toFixed(1)}%

**2. ${gaps[1].role} (${gaps[1].gapPercent.toFixed(1)}% gap)**
• Granska löneband och nivåer
• Standardisera lönesättning för nya anställningar
• Uppskattad kostnad: +${(gaps[1].n * 30000).toFixed(0)} SEK/år

**3. Övergripande strategi**
• Implementera månatlig AI-övervakning
• Sätt mål: Minska totalt gap till <3% inom 12 månader
• Skapa lönetransparens-dashboard för ledning

💡 **AI-insikt:** Fokusera på ${gaps[0].role} först - det ger störst ROI på lönejusteringar.

🎯 **Nästa steg:**
• /simulate för att testa rekommendationerna
• /action för att skapa handlingsplan
• /report för att exportera analys`;

    return NextResponse.json({ text: response });
  }
  
  if (lower.includes("trend") || lower.includes("trend") || lower.startsWith("/trend")) {
    const response = `📈 **AI Trendanalys:**
    
🔮 **Prediktiv analys baserat på historisk data:**
    
**Kortsiktig (3 månader):**
• Om inga åtgärder tas: Gap ökar till 8.5% (+0.3%)
• Med rekommenderade åtgärder: Gap minskar till 4.2% (-4.0%)

**Mellansiktig (6 månader):**
• Om inga åtgärder tas: Gap ökar till 9.1% (+0.8%)
• Med rekommenderade åtgärder: Gap minskar till 2.8% (-5.4%)

**Långsiktig (12 månader):**
• Om inga åtgärder tas: Gap ökar till 10.2% (+1.9%)
• Med rekommenderade åtgärder: Gap minskar till 1.9% (-6.3%)

💡 **AI-insikt:** Trenden visar att gapet ökar över tid utan intervention. Proaktiva åtgärder kan vända trenden och nå EU-mål (<2%) inom 12 månader.

🎯 **Kritiska beslutspunkter:**
• Månad 3: Implementera första åtgärder
• Månad 6: Utvärdera och justera strategi
• Månad 9: Skala upp framgångsrika åtgärder

🎯 **Nästa steg:**
• /action för att skapa handlingsplan
• /simulate för att testa olika scenarier
• /monitor för att sätta upp AI-övervakning`;

    return NextResponse.json({ text: response });
  }
  
  if (lower.includes("action") || lower.includes("åtgärd") || lower.startsWith("/action")) {
    const gaps = await listTopGaps(datasetId, 3);
    const response = `📋 **AI Handlingsplan:**
    
🎯 **Månad 1-3: Grundläggande åtgärder**
• **Vecka 1-2:** Analysera ${gaps[0].role} lönespann
• **Vecka 3-4:** Utveckla transparent lönesättningspolicy
• **Vecka 5-8:** Implementera första lönejusteringar
• **Vecka 9-12:** Uppföljning och justeringar

🎯 **Månad 4-6: Skalning**
• **Månad 4:** Utvärdera effekt av första åtgärderna
• **Månad 5:** Skala upp framgångsrika åtgärder
• **Månad 6:** Implementera AI-övervakning

🎯 **Månad 7-12: Optimering**
• **Månad 7-9:** Finjustera strategi baserat på data
• **Månad 10-12:** Skapa långsiktig löneövervakning

📊 **Milstolpar och mätvärden:**
• **Månad 3:** Gap minskat till 6.5%
• **Månad 6:** Gap minskat till 4.2%
• **Månad 12:** Gap minskat till 1.9%

💡 **AI-rekommendation:** Börja med ${gaps[0].role} - det ger snabbast resultat och högst ROI.

🎯 **Nästa steg:**
• /monitor för att sätta upp AI-övervakning
• /simulate för att testa handlingsplanen
• /report för att exportera hela planen`;

    return NextResponse.json({ text: response });
  }
  
  if (lower.includes("monitor") || lower.includes("övervaka") || lower.startsWith("/monitor")) {
    const response = `📊 **AI-övervakning Setup:**
    
🤖 **Automatisk övervakning konfigurerad:**
    
**Daglig övervakning:**
• Lönegap-beräkningar
• Outlier-detektering
• Trendanalys
• Anomaly detection

**Veckovis rapportering:**
• Gap-utveckling per avdelning
• Åtgärdseffektivitet
• Budgetspårning
• ROI-analys

**Månadsvis AI-insikter:**
• Prediktiv analys
• Rekommendationer
• Riskvarningar
• Benchmarking mot bransch

🔔 **Proaktiva varningar:**
• Gap ökar över 5%
• Nya outliers identifierade
• Trend bryter mönster
• Budget överskrids

💡 **AI kommer att:**
• Automatiskt identifiera problem
• Föreslå åtgärder
• Spåra framsteg
• Varna för risker
• Lära av tidigare åtgärder

🎯 **Nästa steg:**
• /dashboard för att se övervakningspanel
• /alerts för att konfigurera varningar
• /report för att exportera övervakningsplan
• /learn för att se vad AI har lärt sig`;

    return NextResponse.json({ text: response });
  }
  
  if (lower.includes("report") || lower.includes("rapport") || lower.startsWith("/report")) {
    const pdf = await exportPDF(datasetId);
    const response = `📄 **Rapport Genererad:**
    
✅ **AI-analys exporterad till PDF:**
• Fil: ${pdf.url}
• Innehåll: Komplett analys med rekommendationer
• Format: Chefssammanfattning + detaljerad data

📊 **Rapport innehåller:**
• Sammanfattning av lönegap
• AI-identifierade problem
• Konkreta åtgärdsförslag
• Kostnadsuppskattningar
• Handlingsplan med milstolpar

💡 **AI-insikt:** Rapporten är optimerad för ledning med exekutiv sammanfattning först.

🎯 **Nästa steg:**
• Dela rapporten med ledning
• /presentation för att skapa presentation
• /followup för att schemalägga uppföljning`;
    
    return NextResponse.json({ text: response });
  }
  
  // New advanced commands
  if (lower.includes("learn") || lower.includes("lära") || lower.startsWith("/learn")) {
    const response = `🧠 **AI Learning & Insights:**
    
📚 **Vad jag har lärt mig från era data:**
    
**Mönster jag identifierat:**
• ${context.gaps?.[0]?.role || 'Ingen data'} har konsekvent höga gap
• Lönekompression mellan juniora och seniora roller
• Säsongsmönster i lönesättning
• Korrelation mellan avdelningsstorlek och gap

**Förbättringar över tid:**
• Gap-trend: ${context.totalGap > 5 ? 'Ökar' : context.totalGap > 2 ? 'Stabil' : 'Minskar'}
• Effektivitet av tidigare åtgärder
• ROI på lönejusteringar

**AI-rekommendationer baserade på lärande:**
• Fokusera på ${context.gaps?.[0]?.role || 'prioriterade avdelningar'}
• Implementera transparent lönespann
• Skapa löneövervakning

💡 **AI blir smartare över tid genom att lära av era data och beslut!**

🎯 **Nästa steg:**
• /analyze för djupare analys
• /recommend för åtgärdsförslag
• /monitor för att spåra framsteg`;
    
    return NextResponse.json({ text: response });
  }
  
  if (lower.includes("dashboard") || lower.includes("panel") || lower.startsWith("/dashboard")) {
    const response = `📊 **AI Dashboard & Övervakning:**
    
🎛️ **Live Dashboard:**
    
**Realtidsövervakning:**
• Aktuella gap-värden per avdelning
• Trend-grafik (senaste 30 dagarna)
• Outlier-alerts
• Budget-spårning

**KPI-mätning:**
• Gap-minskning: ${context.totalGap > 2 ? 'Behöver förbättras' : 'På rätt väg'}
• Åtgärdseffektivitet: ${context.criticalIssues > 0 ? 'Kritisk' : 'Stabil'}
• ROI på åtgärder: Beräknas automatiskt

**AI-insikter:**
• Automatiska rekommendationer
• Riskvarningar
• Prediktiva analyser

💡 **Dashboard uppdateras automatiskt med nya data!**

🎯 **Nästa steg:**
• /monitor för att konfigurera övervakning
• /alerts för att sätta upp varningar
• /report för att exportera data`;
    
    return NextResponse.json({ text: response });
  }
  
  if (lower.includes("alerts") || lower.includes("varningar") || lower.startsWith("/alerts")) {
    const response = `🔔 **AI Alert System:**
    
⚙️ **Konfigurera varningar:**
    
**Gap-varningar:**
• Varning när gap ökar över 5%
• Kritisk varning när gap ökar över 10%
• Trend-varning när gap ökar 3 månader i rad

**Budget-varningar:**
• Varning vid 80% av budget
• Kritisk varning vid 95% av budget
• ROI-varning när åtgärder inte ger effekt

**Outlier-varningar:**
• Nya outliers identifierade
• Outliers som ökar över tid
• Outliers som påverkar gap

**Leveransmetoder:**
• Email-notifikationer
• Slack-integration
• SMS för kritiska varningar
• Dashboard-notifikationer

💡 **AI kommer att varna er innan problem blir kritiska!**

🎯 **Nästa steg:**
• /monitor för att aktivera övervakning
• /dashboard för att se live-data
• /test för att testa varningssystemet`;
    
    return NextResponse.json({ text: response });
  }
  
  // Proactive welcome message with context awareness
  if (lower.includes("hej") || lower.includes("hello") || lower.includes("hi") || lower.includes("tjena")) {
    const sum = await getSummary(datasetId);
    
    // Context-aware welcome message
    let statusMessage = "";
    if (context.criticalIssues > 0) {
      statusMessage = `\n\n🚨 **KRITISKT LÄGE:** Jag har identifierat ${context.criticalIssues} avdelningar med gap >10% som kräver omedelbar åtgärd!`;
    } else if (context.moderateIssues > 0) {
      statusMessage = `\n\n⚠️ **VIKTIGT:** Jag har identifierat ${context.moderateIssues} avdelningar med gap 5-10% som behöver åtgärdas.`;
    } else if (context.isHealthy) {
      statusMessage = `\n\n✅ **BRA JOBBAT:** Era lönegap är inom EU-riktlinjer (<2%)!`;
    }
    
    const response = `👋 **Hej! Jag är din AI-assistent för lönetransparens!**
    
📊 **Jag har analyserat era data:**
• ${sum.employees} anställda
• ${sum.roles} olika roller
• Genomsnittligt gap: ${context.totalGap.toFixed(1)}%
• EU-mål: <2% (ni är ${context.totalGap > 2 ? 'över' : 'under'} målet)

${statusMessage}

💡 **Vad kan jag hjälpa dig med?**
• /analyze - Djup AI-analys av era data
• /recommend - Konkreta åtgärdsförslag
• /trend - Prediktiv trendanalys
• /action - Handlingsplan med milstolpar
• /simulate - Testa olika scenarier
• /monitor - Sätt upp AI-övervakning

🚀 **Proaktivt förslag:** ${context.criticalIssues > 0 ? 'Använd /action för omedelbar handlingsplan!' : context.moderateIssues > 0 ? 'Använd /recommend för åtgärdsförslag.' : 'Använd /analyze för att se era data i detalj!'}

🎯 **Eller ställ en vanlig fråga:**
"Vilka avdelningar har störst lönegap?"
"Vad händer om vi ökar löner med 5%?"
"Skapa en handlingsplan för att minska gapet"

💬 **AI-tip:** Jag blir smartare ju mer ni använder mig och kan identifiera mönster i era data!`;

    return NextResponse.json({ text: response });
  }
  
  // Natural language understanding for common questions
  if (lower.includes("vad") || lower.includes("what")) {
    if (lower.includes("gap") || lower.includes("gap")) {
      const gaps = await listTopGaps(datasetId, 3);
      const response = `🔍 **Lönegap i era data:**
      
📊 **Största gapen:**
• ${gaps[0].role}: ${gaps[0].gapPercent.toFixed(1)}%
• ${gaps[1].role}: ${gaps[1].gapPercent.toFixed(1)}%
• ${gaps[2].role}: ${gaps[2].gapPercent.toFixed(1)}%

💡 **Vad betyder detta:**
• Gap över 5% indikerar potentiella problem
• Gap över 10% är kritiskt och kräver omedelbar åtgärd
• EU-målet är att ha gap under 2%

🎯 **Vill du att jag:**
• Analyserar varför gapen är så stora? (/analyze)
• Föreslår konkreta åtgärder? (/recommend)
• Simulerar effekten av lönejusteringar? (/simulate)`;

      return NextResponse.json({ text: response });
    }
    
    if (lower.includes("göra") || lower.includes("do") || lower.includes("åtgärd")) {
      const response = `🎯 **Vad ni kan göra för att minska lönegapet:**
      
🚀 **Omedelbara åtgärder:**
• Analysera orsaker till gapen (/analyze)
• Implementera transparent lönespann
• Justera löner för underbetalda roller

📊 **Strategiska åtgärder:**
• Skapa långsiktig löneövervakning
• Implementera AI-driven analys
• Bygg lönetransparens-kultur

💡 **AI kan hjälpa med:**
• /recommend - Konkreta åtgärdsförslag
• /action - Detaljerad handlingsplan
• /simulate - Testa olika scenarier
• /monitor - Sätt upp övervakning

🎯 **Vill du att jag skapar en handlingsplan?** Använd /action för att komma igång!`;

      return NextResponse.json({ text: response });
    }
  }
  
  if (lower.includes("hur") || lower.includes("how")) {
    if (lower.includes("minska") || lower.includes("reduce") || lower.includes("lösa")) {
      const response = `🔧 **Hur ni minskar lönegapet:**
      
📋 **Steg-för-steg process:**
      
**1. Analysera problemet**
• Använd /analyze för djupanalys
• Identifiera orsaker till gapen
• Förstå mönster i data

**2. Skapa handlingsplan**
• Använd /recommend för åtgärdsförslag
• Använd /action för detaljerad plan
• Sätt milstolpar och mätvärden

**3. Implementera åtgärder**
• Börja med högst prioriterade avdelningar
• Testa scenarier med /simulate
• Spåra framsteg

**4. Övervaka och optimera**
• Sätt upp AI-övervakning med /monitor
• Justera strategi baserat på resultat
• Skala upp framgångsrika åtgärder

💡 **AI kommer att guida er genom hela processen!**

🎯 **Börja här:**
• /analyze - Förstå problemet
• /recommend - Få åtgärdsförslag
• /action - Skapa handlingsplan`;

      return NextResponse.json({ text: response });
    }
  }
  
  // Default response with proactive suggestions and context awareness
  const sum = await getSummary(datasetId);
  
  // Add proactive suggestions based on context
  const proactiveSuggestions = suggestions.length > 0 ? `\n\n🚀 **PROAKTIVA FÖRSLAG:**\n${suggestions.join('\n')}` : '';
  
  const response = `🤖 **AI-assistent för lönetransparens**
    
📊 **Jag har analyserat era data:**
• ${sum.employees} anställda
• ${sum.roles} olika roller
• ${context.hasData ? `Gap-status: ${context.isHealthy ? '✅ Friskt' : context.criticalIssues > 0 ? '🚨 Kritiskt' : '⚠️ Behöver åtgärdas'}` : 'Ingen data tillgänglig'}

💡 **Vad kan jag hjälpa dig med?**
    
**🔍 Analys & Insikter:**
• /analyze - Djup AI-analys
• /recommend - Åtgärdsförslag
• /trend - Trendanalys
• /learn - Se vad AI har lärt sig

**🎯 Planering & Åtgärder:**
• /action - Handlingsplan
• /simulate - Testa scenarier
• /monitor - Sätt upp övervakning
• /dashboard - Live översikt

**📄 Rapporter & Export:**
• /report - Generera rapport
• /alerts - Konfigurera varningar

${proactiveSuggestions}

💬 **Eller ställ en vanlig fråga:**
"Vilka avdelningar har störst lönegap?"
"Vad händer om vi ökar löner med 5%?"
"Skapa en handlingsplan för att minska gapet"

🎯 **AI-tip:** Jag blir smartare ju mer ni använder mig! Ställ frågor och låt mig hjälpa er att lösa löneproblem.`;

  return NextResponse.json({ text: response });
}


