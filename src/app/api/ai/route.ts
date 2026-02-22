import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/openai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Simple in-memory rate limiter (per user, 20 requests per minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 1000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check rate limit
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { action, ...params } = body;

    let result: any;

    switch (action) {
      case 'generateHaiku':
        if (!params.topic) {
          return NextResponse.json(
            { error: 'Topic is required' },
            { status: 400 }
          );
        }
        const haikuPrompt = `Write a haiku about ${params.topic}. Make it creative and engaging.`;
        try {
          result = await generateText(haikuPrompt);
        } catch (error) {
          console.error("OpenAI error:", error);
          result = `AI haiku about ${params.topic}:\nWhispers in the wind\nNature's gentle melody\nPeaceful harmony`;
        }
        break;

      case 'generateBusinessModelCanvas':
        if (!params.businessIdea) {
          return NextResponse.json(
            { error: 'Business idea is required' },
            { status: 400 }
          );
        }

        // Professional & Consistent BMC Generation Prompt
        const enhancedPrompt = `You are an award-winning startup strategist, business consultant, and venture capitalist with 20+ years of experience helping founders create successful business models.  
You are tasked with generating a **professional, high-quality, and standardized Business Model Canvas** for the given business idea.

**Business Description:**  
${params.businessIdea}

**Additional Details from User (Multiple Choice Answers):**  
${params.mcqAnswers ? JSON.stringify(params.mcqAnswers, null, 2) : 'None provided'}

**CRITICAL INSTRUCTIONS:**
- Use the user's answers to the refinement questions to guide your BMC generation
- The user's answers should heavily influence the content of each corresponding section
- Ensure strategic consistency between the user's answers and the generated BMC sections
- Make the output more specific and tailored based on the user's input

**Output Requirements (STRICT):**  
1. Use exactly the **9 official Business Model Canvas sections** in the correct order:  
   - Customer Segments  
   - Value Propositions  
   - Channels  
   - Customer Relationships  
   - Revenue Streams  
   - Key Activities  
   - Key Resources  
   - Key Partners  
   - Cost Structure  

2. Each section must have **exactly 4 bullet points**.  
   - Bullets must be **short, clear, and actionable** (max 15 words).  
   - No vague terms like "high quality" or "innovative" without context.  
   - Avoid repeating the same words across sections.  

3. Ensure **strategic consistency**:  
   - The Customer Segments must logically connect to the Value Propositions.  
   - The Channels must be realistic and match the business type.  
   - The Revenue Streams must be feasible and sustainable.  
   - The Key Partners must be relevant to the business model and industry.

4. Maintain **professional tone**:  
   - No slang or casual expressions.  
   - Use business terminology but keep it understandable.  

5. Formatting:  
   - Clearly label each section in bold.  
   - List bullet points with a dash (-) and a space before text.  

6. Quality Check Before Finalizing:  
   - Is this business model realistic and implementable?  
   - Does it differentiate the business from competitors?  
   - Does it show strategic depth without overcomplicating?  

**IMPORTANT**: Ensure that ALL 9 sections are included, especially Key Partners (key_partnerships). This section should identify strategic alliances, joint ventures, suppliers, distributors, or other key business relationships that are essential for the business model to work.

**USER ANSWERS ANALYSIS:**
- Value Propositions: ${params.mcqAnswers?.valuePropositions || 'Not specified'}
- Customer Segments: ${params.mcqAnswers?.customerSegments || 'Not specified'}
- Channels: ${params.mcqAnswers?.channels || 'Not specified'}
- Revenue Streams: ${params.mcqAnswers?.revenueStreams || 'Not specified'}
- Key Resources: ${params.mcqAnswers?.keyResources || 'Not specified'}
- Business Model: ${params.mcqAnswers?.businessModel || 'Not specified'}

Use these answers to create a more accurate and tailored Business Model Canvas.

Now, generate the final **Business Model Canvas** with the above standards applied. Output in JSON format with keys: customer_segments, value_propositions, channels, customer_relationships, revenue_streams, key_activities, key_resources, key_partnerships, cost_structure.`;

        try {
          result = await generateText(enhancedPrompt);

          // Try to parse the response as JSON
          if (result) {
            try {
              // Clean the response - remove markdown code blocks if present
              let cleanedResult = result.trim();
              if (cleanedResult.startsWith('```json')) {
                cleanedResult = cleanedResult.replace(/^```json\s*/, '').replace(/\s*```$/, '');
              } else if (cleanedResult.startsWith('```')) {
                cleanedResult = cleanedResult.replace(/^```\s*/, '').replace(/\s*```$/, '');
              }

              const parsed = JSON.parse(cleanedResult);
              // Convert snake_case keys to camelCase for consistency
              result = {
                customerSegments: parsed.customer_segments || parsed.customerSegments || 'Target customers',
                valuePropositions: parsed.value_propositions || parsed.valuePropositions || 'Customer value',
                channels: parsed.channels || 'Distribution channels',
                customerRelationships: parsed.customer_relationships || parsed.customerRelationships || 'Customer engagement',
                revenueStreams: parsed.revenue_streams || parsed.revenueStreams || 'Revenue sources',
                keyActivities: parsed.key_activities || parsed.keyActivities || 'Core activities',
                keyResources: parsed.key_resources || parsed.keyResources || 'Essential resources',
                keyPartnerships: parsed.key_partnerships || parsed.keyPartnerships || 'Strategic partnerships',
                costStructure: parsed.cost_structure || parsed.costStructure || 'Business costs'
              };
            } catch (parseError) {
              console.error("Failed to parse AI response as JSON:", parseError);
              // If parsing fails, create a structured response from the text
              result = {
                customerSegments: result.includes('Customer Segments') ? result.split('Customer Segments')[1]?.split('\n')[0] || 'Target customers' : 'Target customers',
                valuePropositions: result.includes('Value Propositions') ? result.split('Value Propositions')[1]?.split('\n')[0] || 'Customer value' : 'Customer value',
                channels: result.includes('Channels') ? result.split('Channels')[1]?.split('\n')[0] || 'Distribution channels' : 'Distribution channels',
                customerRelationships: result.includes('Customer Relationships') ? result.split('Customer Relationships')[1]?.split('\n')[0] || 'Customer engagement' : 'Customer engagement',
                revenueStreams: result.includes('Revenue Streams') ? result.split('Revenue Streams')[1]?.split('\n')[0] || 'Revenue sources' : 'Revenue sources',
                keyActivities: result.includes('Key Activities') ? result.split('Key Activities')[1]?.split('\n')[0] || 'Core activities' : 'Core activities',
                keyResources: result.includes('Key Resources') ? result.split('Key Resources')[1]?.split('\n')[0] || 'Essential resources' : 'Essential resources',
                keyPartnerships: result.includes('Key Partnerships') ? result.split('Key Partnerships')[1]?.split('\n')[0] || 'Strategic partnerships' : 'Strategic partnerships',
                costStructure: result.includes('Cost Structure') ? result.split('Cost Structure')[1]?.split('\n')[0] || 'Business costs' : 'Business costs'
              };
            }
          } else {
            // Fallback response if no result from AI
            result = {
              customerSegments: `Target customer segments for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
              valuePropositions: `Value delivered to customers through ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
              channels: `Distribution and communication channels for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
              customerRelationships: `Customer engagement and support for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
              revenueStreams: `Revenue generation streams for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
              keyActivities: `Core business activities for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
              keyResources: `Essential resources and assets for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
              keyPartnerships: `Strategic partnerships for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
              costStructure: `Business cost structure for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`
            };
          }
        } catch (aiError) {
          console.error("AI generation failed, using fallback:", aiError);
          // Fallback response if AI fails
          result = {
            customerSegments: `Target customer segments for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
            valuePropositions: `Value delivered to customers through ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
            channels: `Distribution and communication channels for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
            customerRelationships: `Customer engagement and support for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
            revenueStreams: `Revenue generation streams for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
            keyActivities: `Core business activities for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
            keyResources: `Essential resources and assets for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
            keyPartnerships: `Strategic partnerships for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`,
            costStructure: `Business cost structure for ${params.businessIdea.split(' ').slice(0, 3).join(' ')}`
          };
        }
        break;

      case 'generateCreativeContent':
        if (!params.prompt) {
          return NextResponse.json(
            { error: 'Prompt is required' },
            { status: 400 }
          );
        }
        const creativePrompt = `Generate ${params.contentType || 'general'} content based on: ${params.prompt}
        
        Make it creative, engaging, and well-structured.`;
        try {
          result = await generateText(creativePrompt);
        } catch (error) {
          console.error("OpenAI error:", error);
          result = `Creative content about: ${params.prompt}\n\nThis is a sample creative content generated for demonstration purposes.`;
        }
        break;

      case 'improveContent':
        if (!params.content) {
          return NextResponse.json(
            { error: 'Content is required' },
            { status: 400 }
          );
        }
        const improvePrompt = `Please improve the following content for ${params.improvementType || 'general'}:
        
        ${params.content}
        
        Provide the improved version with explanations of the changes made.`;
        try {
          result = await generateText(improvePrompt);
        } catch (error) {
          console.error("OpenAI error:", error);
          result = `Improved content:\n${params.content}\n\nThis content has been enhanced for better clarity and impact.`;
        }
        break;

      case 'generateInsights':
        if (!params.content) {
          return NextResponse.json(
            { error: 'Content is required' },
            { status: 400 }
          );
        }
        const insightsPrompt = `Analyze the following content and provide key insights:
        
        ${params.content}
        
        Provide actionable insights and recommendations.`;
        try {
          result = await generateText(insightsPrompt);
        } catch (error) {
          console.error("OpenAI error:", error);
          result = `Key insights for the provided content:\n\n1. Consider expanding on the main points\n2. Add more specific examples\n3. Include actionable recommendations\n4. Focus on user benefits`;
        }
        break;

      case 'chatWithContext':
        if (!params.messages) {
          return NextResponse.json(
            { error: 'Messages are required' },
            { status: 400 }
          );
        }
        const messages = params.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        }));
        try {
          result = await generateText(JSON.stringify(messages));
        } catch (error) {
          console.error("OpenAI error:", error);
          result = "I understand your message. How can I help you further?";
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI API is running',
    availableActions: [
      'generateHaiku',
      'generateBusinessModelCanvas',
      'generateCreativeContent',
      'improveContent',
      'generateInsights',
      'chatWithContext'
    ]
  });
} 