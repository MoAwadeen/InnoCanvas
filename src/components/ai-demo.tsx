"use client";

import { useState } from 'react';
import { useAI } from '@/hooks/useAI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sparkles, Brain, Lightbulb, MessageSquare } from 'lucide-react';

export function AIDemo() {
  const [topic, setTopic] = useState("ai");
  const [businessIdea, setBusinessIdea] = useState("");
  const [content, setContent] = useState("");
  const [prompt, setPrompt] = useState("");
  
  const {
    loading,
    error,
    data,
    generateHaiku,
    generateBusinessModelCanvas,
    generateCreativeContent,
    improveContent,
    generateInsights,
    clearError,
    clearData,
  } = useAI();

  const handleGenerateHaiku = async () => {
    try {
      await generateHaiku(topic);
    } catch (error) {
      console.error("Failed to generate haiku:", error);
    }
  };

  const handleGenerateBusinessModel = async () => {
    if (!businessIdea.trim()) return;
    try {
      await generateBusinessModelCanvas(businessIdea);
    } catch (error) {
      console.error("Failed to generate business model:", error);
    }
  };

  const handleGenerateContent = async () => {
    if (!prompt.trim()) return;
    try {
      await generateCreativeContent(prompt);
    } catch (error) {
      console.error("Failed to generate content:", error);
    }
  };

  const handleImproveContent = async () => {
    if (!content.trim()) return;
    try {
      await improveContent(content);
    } catch (error) {
      console.error("Failed to improve content:", error);
    }
  };

  const handleGenerateInsights = async () => {
    if (!content.trim()) return;
    try {
      await generateInsights(content);
    } catch (error) {
      console.error("Failed to generate insights:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">AI Demo</h1>
        <p className="text-muted-foreground">
          Explore the AI capabilities integrated into InnoCanvas
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" className="ml-2" onClick={clearError}>
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Haiku Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Haiku Generator
            </CardTitle>
            <CardDescription>
              Generate creative haikus about any topic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter a topic (e.g., 'ai', 'nature', 'business')"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <Button onClick={handleGenerateHaiku} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
              </Button>
            </div>
            {data && typeof data === 'string' && data.includes('haiku') && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-mono text-sm whitespace-pre-line">{data}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business Model Canvas Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Business Model Canvas
            </CardTitle>
            <CardDescription>
              Generate a business model canvas for your idea
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your business idea"
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
              />
              <Button onClick={handleGenerateBusinessModel} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
              </Button>
            </div>
            {data && typeof data === 'string' && data.includes('business') && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-mono text-sm whitespace-pre-line">{data}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Creative Content Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Creative Content
            </CardTitle>
            <CardDescription>
              Generate creative content based on your prompt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter your creative prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
              <Button onClick={handleGenerateContent} disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Content"}
              </Button>
            </div>
            {data && typeof data === 'string' && !data.includes('haiku') && !data.includes('business') && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm whitespace-pre-line">{data}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Content Improvement
            </CardTitle>
            <CardDescription>
              Improve and enhance your existing content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter content to improve"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={handleImproveContent} disabled={loading} className="flex-1">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Improve"}
                </Button>
                <Button onClick={handleGenerateInsights} disabled={loading} variant="outline" className="flex-1">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Insights"}
                </Button>
              </div>
            </div>
            {data && typeof data === 'string' && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm whitespace-pre-line">{data}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={clearData}>
          Clear Results
        </Button>
      </div>
    </div>
  );
} 