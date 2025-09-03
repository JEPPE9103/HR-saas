import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(tenantId: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 60;

  const key = `scenario:${tenantId}`;
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
  let body: any;
  
  try {
    body = await request.json();
    const { currentGap, scenario, employees, budget } = body;
    
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
      const estimatedGap = Math.max(0, currentGap - 2); // Simple estimation
      const estimatedCost = employees * 5000; // Rough estimate
      
      return NextResponse.json({
        newGapPct: estimatedGap,
        costEstimate: estimatedCost,
        bullets: [
          `Scenario: ${scenario}`,
          `Beräknad minskning av lönegap: ${(currentGap - estimatedGap).toFixed(1)}%`,
          `Uppskattad kostnad: ${estimatedCost.toLocaleString('sv-SE')} SEK`,
          "Detta är en grov uppskattning baserad på generell data."
        ]
      });
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    const prompt = `Analysera följande scenario för lönegap-förbättring och ge en realistisk uppskattning:

Nuvarande lönegap: ${currentGap.toFixed(1)}%
Antal anställda: ${employees}
Scenario: ${scenario}
Budget: ${budget ? `${budget.toLocaleString('sv-SE')} SEK` : 'Ingen budget angiven'}

Ge en JSON-svar med:
- newGapPct: nytt beräknat lönegap (nummer)
- costEstimate: uppskattad kostnad i SEK (nummer)
- bullets: array med 3-4 konkreta punkter på svenska

Var realistisk i uppskattningarna baserat på typiska HR-interventioner.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Du är en HR-analytiker som ger realistiska uppskattningar för lönegap-scenarier. Svara endast med giltig JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 400,
      temperature: 0.2,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    try {
      // Try to parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
    }

    // Fallback if JSON parsing fails
    const estimatedGap = Math.max(0, currentGap - 1.5);
    const estimatedCost = employees * 3000;
    
    return NextResponse.json({
      newGapPct: estimatedGap,
      costEstimate: estimatedCost,
      bullets: [
        `Scenario: ${scenario}`,
        `Beräknad minskning: ${(currentGap - estimatedGap).toFixed(1)}%`,
        `Uppskattad kostnad: ${estimatedCost.toLocaleString('sv-SE')} SEK`,
        "AI-analys kunde inte slutföras, detta är en konservativ uppskattning."
      ]
    });

  } catch (error) {
    console.error('Scenario analysis error:', error);
    
    // Fallback response on error
    return NextResponse.json({
      newGapPct: Math.max(0, (body as any)?.currentGap - 1),
      costEstimate: ((body as any)?.employees || 100) * 2000,
      bullets: [
        "Ett fel uppstod vid AI-analys.",
        "Kontakta support för mer detaljerad analys.",
        "Använd generella HR-riktlinjer som utgångspunkt."
      ]
    });
  }
}
