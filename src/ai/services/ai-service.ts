import { createChatCompletion, generateText } from "@/lib/openai";

// Helper function to check if we're on the client side
function isClientSide(): boolean {
  return typeof window !== 'undefined';
}

// Helper function to make API calls
async function makeAPICall(action: string, params: any): Promise<any> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...params }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API call failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to make API call');
  }
}

export class AIService {
  /**
   * Generate a haiku about a given topic
   */
  static async generateHaiku(topic: string = "ai"): Promise<string> {
    try {
      if (isClientSide()) {
        return await makeAPICall('generateHaiku', { topic });
      } else {
        const prompt = `Write a haiku about ${topic}. Make it creative and engaging.`;
        const response = await generateText(prompt);
        return response || "Failed to generate haiku";
      }
    } catch (error) {
      console.error("Error generating haiku:", error);
      if (error instanceof Error && error.message.includes("API key")) {
        return "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.";
      }
      return "Error generating haiku";
    }
  }

  /**
   * Generate business model canvas content
   */
  static async generateBusinessModelCanvas(businessIdea: string, mcqAnswers?: any): Promise<any> {
    try {
      if (isClientSide()) {
        return await makeAPICall('generateBusinessModelCanvas', { businessIdea, mcqAnswers });
      } else {
        // Professional & Consistent BMC Generation Prompt
        const enhancedPrompt = `You are an award-winning startup strategist, business consultant, and venture capitalist with 20+ years of experience helping founders create successful business models.  
You are tasked with generating a **professional, high-quality, and standardized Business Model Canvas** for the given business idea.

**Business Description:**  
${businessIdea}

**Additional Details from User (Multiple Choice Answers):**  
${mcqAnswers ? JSON.stringify(mcqAnswers, null, 2) : 'None provided'}

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
- Value Propositions: ${mcqAnswers?.valuePropositions || 'Not specified'}
- Customer Segments: ${mcqAnswers?.customerSegments || 'Not specified'}
- Channels: ${mcqAnswers?.channels || 'Not specified'}
- Revenue Streams: ${mcqAnswers?.revenueStreams || 'Not specified'}
- Key Resources: ${mcqAnswers?.keyResources || 'Not specified'}
- Business Model: ${mcqAnswers?.businessModel || 'Not specified'}

Use these answers to create a more accurate and tailored Business Model Canvas.

Now, generate the final **Business Model Canvas** with the above standards applied. Output in JSON format with keys: customer_segments, value_propositions, channels, customer_relationships, revenue_streams, key_activities, key_resources, key_partnerships, cost_structure.`;
        
        try {
          const response = await generateText(enhancedPrompt);
          
          // Try to parse the response as JSON
          if (response) {
            try {
              // Clean the response - remove markdown code blocks if present
              let cleanedResponse = response.trim();
              if (cleanedResponse.startsWith('```json')) {
                cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
              } else if (cleanedResponse.startsWith('```')) {
                cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
              }
              
              const parsed = JSON.parse(cleanedResponse);
              // Convert snake_case keys to camelCase for consistency
              return {
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
              return {
                customerSegments: response.includes('Customer Segments') ? response.split('Customer Segments')[1]?.split('\n')[0] || 'Target customers' : 'Target customers',
                valuePropositions: response.includes('Value Propositions') ? response.split('Value Propositions')[1]?.split('\n')[0] || 'Customer value' : 'Customer value',
                channels: response.includes('Channels') ? response.split('Channels')[1]?.split('\n')[0] || 'Distribution channels' : 'Distribution channels',
                customerRelationships: response.includes('Customer Relationships') ? response.split('Customer Relationships')[1]?.split('\n')[0] || 'Customer engagement' : 'Customer engagement',
                revenueStreams: response.includes('Revenue Streams') ? response.split('Revenue Streams')[1]?.split('\n')[0] || 'Revenue sources' : 'Revenue sources',
                keyActivities: response.includes('Key Activities') ? response.split('Key Activities')[1]?.split('\n')[0] || 'Core activities' : 'Core activities',
                keyResources: response.includes('Key Resources') ? response.split('Key Resources')[1]?.split('\n')[0] || 'Essential resources' : 'Essential resources',
                keyPartnerships: response.includes('Key Partnerships') ? response.split('Key Partnerships')[1]?.split('\n')[0] || 'Strategic partnerships' : 'Strategic partnerships',
                costStructure: response.includes('Cost Structure') ? response.split('Cost Structure')[1]?.split('\n')[0] || 'Business costs' : 'Business costs'
              };
            }
          }
        } catch (aiError) {
          console.error("AI generation failed, using fallback:", aiError);
        }
        
        // Fallback response if no response from AI or AI fails
        return {
          customerSegments: `Target customer segments for ${businessIdea.split(' ').slice(0, 3).join(' ')}`,
          valuePropositions: `Value delivered to customers through ${businessIdea.split(' ').slice(0, 3).join(' ')}`,
          channels: `Distribution and communication channels for ${businessIdea.split(' ').slice(0, 3).join(' ')}`,
          customerRelationships: `Customer engagement and support for ${businessIdea.split(' ').slice(0, 3).join(' ')}`,
          revenueStreams: `Revenue generation streams for ${businessIdea.split(' ').slice(0, 3).join(' ')}`,
          keyActivities: `Core business activities for ${businessIdea.split(' ').slice(0, 3).join(' ')}`,
          keyResources: `Essential resources and assets for ${businessIdea.split(' ').slice(0, 3).join(' ')}`,
          keyPartnerships: `Strategic partnerships for ${businessIdea.split(' ').slice(0, 3).join(' ')}`,
          costStructure: `Business cost structure for ${businessIdea.split(' ').slice(0, 3).join(' ')}`
        };
      }
    } catch (error) {
      console.error("Error generating business model canvas:", error);
      if (error instanceof Error && error.message.includes("API key")) {
        throw new Error("OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.");
      }
      throw new Error("Failed to generate business model canvas");
    }
  }

  /**
   * Generate creative content for canvases
   */
  static async generateCreativeContent(prompt: string, contentType: string = "general"): Promise<string> {
    try {
      if (isClientSide()) {
        return await makeAPICall('generateCreativeContent', { prompt, contentType });
      } else {
        const enhancedPrompt = `Generate ${contentType} content based on: ${prompt}
        
        Make it creative, engaging, and well-structured.`;
        
        const response = await generateText(enhancedPrompt);
        return response || "Failed to generate content";
      }
    } catch (error) {
      console.error("Error generating creative content:", error);
      if (error instanceof Error && error.message.includes("API key")) {
        return "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.";
      }
      return "Error generating content";
    }
  }

  /**
   * Analyze and improve existing content
   */
  static async improveContent(content: string, improvementType: string = "general"): Promise<string> {
    try {
      if (isClientSide()) {
        return await makeAPICall('improveContent', { content, improvementType });
      } else {
        const prompt = `Please improve the following content for ${improvementType}:
        
        ${content}
        
        Provide the improved version with explanations of the changes made.`;
        
        const response = await generateText(prompt);
        return response || "Failed to improve content";
      }
    } catch (error) {
      console.error("Error improving content:", error);
      if (error instanceof Error && error.message.includes("API key")) {
        return "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.";
      }
      return "Error improving content";
    }
  }

  /**
   * Generate insights from data or content
   */
  static async generateInsights(content: string): Promise<string> {
    try {
      if (isClientSide()) {
        return await makeAPICall('generateInsights', { content });
      } else {
        const prompt = `Analyze the following content and provide key insights:
        
        ${content}
        
        Focus on actionable insights and recommendations.`;
        
        const response = await generateText(prompt);
        return response || "Failed to generate insights";
      }
    } catch (error) {
      console.error("Error generating insights:", error);
      if (error instanceof Error && error.message.includes("API key")) {
        return "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.";
      }
      return "Error generating insights";
    }
  }

  /**
   * Chat completion with context
   */
  static async chatWithContext(
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
    context?: string
  ): Promise<string> {
    try {
      if (isClientSide()) {
        return await makeAPICall('chatWithContext', { messages, context });
      } else {
        let enhancedMessages = [...messages];
        
        if (context) {
          enhancedMessages.unshift({
            role: "system",
            content: `Context: ${context}. Please use this context to provide more relevant responses.`
          });
        }

        const response = await createChatCompletion(enhancedMessages);
        return response || "No response generated";
      }
    } catch (error) {
      console.error("Error in chat completion:", error);
      if (error instanceof Error && error.message.includes("API key")) {
        return "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.";
      }
      return "Error in chat completion";
    }
  }
} 