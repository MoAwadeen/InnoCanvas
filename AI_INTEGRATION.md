# AI Integration Documentation

This document describes the AI integration added to InnoCanvas using OpenAI's API.

## Features

- **Haiku Generation**: Generate creative haikus about any topic
- **Business Model Canvas**: Generate business model canvas content for ideas
- **Creative Content**: Generate creative content based on prompts
- **Content Improvement**: Improve and enhance existing content
- **Insights Generation**: Generate insights from content analysis
- **Chat with Context**: Chat completion with context support

## Setup

1. **Install Dependencies**
   ```bash
   npm install openai
   ```

2. **Environment Variables**
   Add the following to your `.env.local` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **API Key**
   - Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Add it to your environment variables

## Usage

### Using the AI Service

```typescript
import { AIService } from '@/ai/services/ai-service';

// Generate a haiku
const haiku = await AIService.generateHaiku('technology');

// Generate business model canvas
const bmc = await AIService.generateBusinessModelCanvas('AI-powered app');

// Generate creative content
const content = await AIService.generateCreativeContent('Write about innovation', 'story');

// Improve content
const improved = await AIService.improveContent('Your content here');

// Generate insights
const insights = await AIService.generateInsights('Your content here');
```

### Using the React Hook

```typescript
import { useAI } from '@/hooks/useAI';

function MyComponent() {
  const { loading, error, data, generateHaiku } = useAI();

  const handleGenerate = async () => {
    try {
      await generateHaiku('nature');
    } catch (error) {
      console.error('Failed to generate haiku:', error);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Haiku'}
      </button>
      {error && <p>Error: {error}</p>}
      {data && <p>{data}</p>}
    </div>
  );
}
```

### Using the API Route

```typescript
// POST /api/ai
const response = await fetch('/api/ai', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'generateHaiku',
    topic: 'technology'
  })
});

const result = await response.json();
```

## Components

### AIDemo Component

The `AIDemo` component (`src/components/ai-demo.tsx`) provides a complete UI for testing all AI features:

- Haiku Generator
- Business Model Canvas Generator
- Creative Content Generator
- Content Improvement Tool
- Insights Generator

### Demo Page

Visit `/ai-demo` to see the AI functionality in action.

## File Structure

```
src/
├── ai/
│   ├── services/
│   │   └── ai-service.ts          # AI service class
│   ├── flows/                     # AI workflows
│   └── test-ai.ts                 # AI testing utilities
├── components/
│   └── ai-demo.tsx                # AI demo component
├── hooks/
│   └── useAI.ts                   # React hook for AI
├── lib/
│   └── openai.ts                  # OpenAI client configuration
└── app/
    └── api/
        └── ai/
            └── route.ts           # AI API routes
```

## API Endpoints

### POST /api/ai

Handles AI requests with the following actions:

- `generateHaiku` - Generate haiku about a topic
- `generateBusinessModelCanvas` - Generate business model canvas
- `generateCreativeContent` - Generate creative content
- `improveContent` - Improve existing content
- `generateInsights` - Generate insights from content
- `chatWithContext` - Chat with context

### GET /api/ai

Returns information about available AI actions.

## Error Handling

The AI integration includes comprehensive error handling:

- API key validation
- Network error handling
- Rate limiting support
- User-friendly error messages

## Testing

Run the AI test:

```bash
# Test the AI integration
npx ts-node src/ai/test-ai.ts
```

## Security

- API keys are stored in environment variables
- No hardcoded credentials in the codebase
- Server-side API routes for secure processing
- Input validation and sanitization

## Future Enhancements

- Caching for AI responses
- Rate limiting implementation
- Advanced prompt engineering
- Multi-model support
- Conversation history
- Custom AI workflows 