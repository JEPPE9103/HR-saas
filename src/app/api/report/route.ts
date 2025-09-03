import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(tenantId: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 60;

  const key = `report:${tenantId}`;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gapTotal, topDepts, pctUnderOverP50, trend, employees } = body;
    
    // Get tenant ID from request (for rate limiting)
    const tenantId = request.headers.get('x-tenant-id') || 'default';
    
    // Check rate limit
    if (!checkRateLimit(tenantId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again in 10 minutes.' },
        { status: 429 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      // Fallback response when no API key
      return NextResponse.json({
        summary: [
          "Lönegap-analys baserad på tillgänglig data",
          `Genomsnittligt gap: ${gapTotal.toFixed(1)}%`,
          `Topp avdelningar: ${topDepts.slice(0, 3).map((d: any) => d.department).join(', ')}`,
          `${pctUnderOverP50}% av anställda tjänar under medianlönen`
        ],
        reportUrl: null,
        message: "PDF-generering kräver AI-nyckel. Använd 'Skriv ut' som alternativ."
      });
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    const prompt = `Skapa en professionell sammanfattning för en HR-rapport om lönegap på svenska:

Lönegap: ${gapTotal.toFixed(1)}%
Antal anställda: ${employees?.length || 0}
Topp avdelningar med gap: ${topDepts.slice(0, 3).map((d: any) => `${d.department} (${d.gap.toFixed(1)}%)`).join(', ')}
Anställda under median: ${pctUnderOverP50}%
Trend: ${trend.slice(-3).map((t: any) => `${parseFloat(t.gap_pct).toFixed(1)}%`).join(' → ')}

Ge en kort, professionell sammanfattning (2-3 meningar) som kan användas som introduktion i en HR-rapport.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Du är en HR-analytiker som skriver professionella sammanfattningar för rapporter. Var kortfattad och objektiv."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    const aiSummary = completion.choices[0]?.message?.content || 'AI-sammanfattning kunde inte genereras.';

    // In a real implementation, you would generate a PDF here
    // For now, we'll return the AI summary and a message
    return NextResponse.json({
      summary: aiSummary,
      reportUrl: null, // Would be a URL to the generated PDF
      message: "AI-sammanfattning genererad. PDF-generering kommer snart.",
      data: {
        gapTotal,
        topDepts: topDepts.slice(0, 3),
        pctUnderOverP50,
        trend: trend.slice(-6), // Last 6 months
        employeeCount: employees?.length || 0
      }
    });

  } catch (error) {
    console.error('Report generation error:', error);
    
    // Fallback response on error
    return NextResponse.json({
      summary: "Lönegap-analys baserad på tillgänglig data. Kontakta support för detaljerad rapport.",
      reportUrl: null,
      message: "Ett fel uppstod vid rapportgenerering. Använd 'Skriv ut' som alternativ.",
      error: "Report generation failed"
    });
  }
}
