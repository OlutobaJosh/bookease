import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { goal, fitnessLevel, daysPerWeek, injuries, age } = await req.json();

    if (!goal || !fitnessLevel || !daysPerWeek) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }

    const prompt = `You are Alex Carter, an elite personal trainer with 8+ years of experience. 
Create a detailed, personalised weekly training plan for a client with the following profile:

- Primary Goal: ${goal}
- Current Fitness Level: ${fitnessLevel}
- Available Training Days Per Week: ${daysPerWeek}
- Age: ${age || 'Not specified'}
- Injuries or Limitations: ${injuries || 'None'}

Generate a complete weekly training plan with the following structure:

1. WEEKLY OVERVIEW — brief summary of the approach
2. DAY-BY-DAY PLAN — for each training day include:
   - Day name and focus (e.g. Day 1: Upper Body Strength)
   - 4-6 exercises with sets, reps, and rest periods
   - A coaching tip for that day
3. NUTRITION TIPS — 3 key nutrition recommendations aligned with their goal
4. RECOVERY ADVICE — 2-3 recovery recommendations
5. PROGRESS MILESTONE — what they should aim to achieve in 4 weeks

Keep the tone motivating, professional, and specific. Format clearly with headers and bullet points.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are Alex Carter, an elite certified personal trainer. You create detailed, science-backed, motivating training plans.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Groq error:', err);
      return NextResponse.json({ error: 'AI service unavailable. Please try again.' }, { status: 500 });
    }

    const data = await response.json();
    const plan = data.choices?.[0]?.message?.content;

    if (!plan) {
      return NextResponse.json({ error: 'Could not generate plan. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ plan });
  } catch (err) {
    console.error('Training plan error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
