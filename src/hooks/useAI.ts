import { useState, useCallback } from 'react';
import { AIService } from '@/ai/services/ai-service';

interface AIState {
  loading: boolean;
  error: string | null;
  data: any;
}

export function useAI() {
  const [state, setState] = useState<AIState>({
    loading: false,
    error: null,
    data: null,
  });

  const generateHaiku = useCallback(async (topic: string = "ai") => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await AIService.generateHaiku(topic);
      setState(prev => ({ ...prev, loading: false, data: result }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate haiku';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const generateBusinessModelCanvas = useCallback(async (businessIdea: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await AIService.generateBusinessModelCanvas(businessIdea);
      setState(prev => ({ ...prev, loading: false, data: result }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate business model canvas';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const generateCreativeContent = useCallback(async (prompt: string, contentType: string = "general") => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await AIService.generateCreativeContent(prompt, contentType);
      setState(prev => ({ ...prev, loading: false, data: result }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const improveContent = useCallback(async (content: string, improvementType: string = "general") => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await AIService.improveContent(content, improvementType);
      setState(prev => ({ ...prev, loading: false, data: result }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to improve content';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const generateInsights = useCallback(async (content: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await AIService.generateInsights(content);
      setState(prev => ({ ...prev, loading: false, data: result }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate insights';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const chatWithContext = useCallback(async (
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
    context?: string
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await AIService.chatWithContext(messages, context);
      setState(prev => ({ ...prev, loading: false, data: result }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete chat';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearData = useCallback(() => {
    setState(prev => ({ ...prev, data: null }));
  }, []);

  return {
    ...state,
    generateHaiku,
    generateBusinessModelCanvas,
    generateCreativeContent,
    improveContent,
    generateInsights,
    chatWithContext,
    clearError,
    clearData,
  };
} 