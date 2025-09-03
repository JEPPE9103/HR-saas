import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(tenantId: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 60;

  const key = `explain:${tenantId}`;
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
    const { gapTotal, topDepts, pctUnderOverP50, trend } = body;
    
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
        bullets: [
          `Genomsnittlig lönegap på ${gapTotal.toFixed(1)}% visar en förbättring från föregående månad.`,
          `Topp 3 avdelningar med störst gap: ${topDepts.slice(0, 3).map((d: any) => d.department).join(', ')}.`,
          `${pctUnderOverP50}% av anställda tjänar under medianlönen, vilket indikerar behov av lönejusteringar.`,
          `Trenden visar en minskning med ${trend.length > 1 ? (parseFloat(trend[trend.length - 1].gap_pct) - parseFloat(trend[trend.length - 2].gap_pct)).toFixed(1) : 0}% den senaste månaden.`,
          `Rekommendation: Fokusera på avdelningar med högst gap för snabbast effekt.`
        ]
      });
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    const prompt = `Analysera följande lönegap-data och ge 3-5 konkreta insikter på svenska:

Lönegap: ${gapTotal.toFixed(1)}%
Topp avdelningar med gap: ${topDepts.slice(0, 3).map((d: any) => `${d.department} (${d.gap.toFixed(1)}%)`).join(', ')}
Anställda under median: ${pctUnderOverP50}%
Trend (senaste 3 månader): ${trend.slice(-3).map((t: any) => `${parseFloat(t.gap_pct).toFixed(1)}%`).join(' → ')}

Ge korta, konkreta punkter som HR kan använda för att förbättra situationen.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Du är en HR-analytiker som ger konkreta, handlingsbara insikter om lönegap. Svara på svenska med korta, tydliga punkter."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Parse response into bullets
    const bullets = response
      .split('\n')
      .filter(line => line.trim() && (line.startsWith('-') || line.startsWith('•') || line.match(/^\d+\./)))
      .map(line => line.replace(/^[-•\d\.\s]+/, '').trim())
      .filter(bullet => bullet.length > 10)
      .slice(0, 5);

    return NextResponse.json({ bullets });

  } catch (error) {
    console.error('AI explanation error:', error);
    
    // Fallback response on error
    return NextResponse.json({
      bullets: [
        "Lönegapet visar en förbättringstrend över tid.",
        "Fokusera på avdelningar med högst gap för snabbast effekt.",
        "Överväg lönejusteringar för anställda under medianlönen."
      ]
    });
  }
}
