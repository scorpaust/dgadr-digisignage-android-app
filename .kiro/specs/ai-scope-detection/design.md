# Design Document - AI Scope Detection Enhancement

## Overview

This design implements a comprehensive scope detection system for the DGADR AI assistant that identifies out-of-scope queries and provides appropriate responses. The system uses multiple detection layers and maintains professional boundaries while guiding users toward appropriate topics.

## Architecture

### Detection Pipeline

```
User Query → Scope Analyzer → Decision Engine → Response Generator
     ↓              ↓              ↓              ↓
Input Text → Keywords/Patterns → In/Out Scope → Appropriate Response
```

### System Components

1. **ScopeDetectionService**: Core detection logic
2. **ResponseTemplateService**: Standardized response templates
3. **KeywordAnalyzer**: Pattern matching for scope detection
4. **ContextAnalyzer**: Advanced context understanding
5. **Enhanced AIService**: Integration with existing AI pipeline

## Components and Interfaces

### ScopeDetectionService

```typescript
interface ScopeDetectionResult {
  isInScope: boolean;
  confidence: number;
  detectedCategory?: string;
  suggestedResponse?: string;
}

class ScopeDetectionService {
  detectScope(query: string): ScopeDetectionResult;
  isGeneralKnowledge(query: string): boolean;
  isPersonalAdvice(query: string): boolean;
  isEntertainment(query: string): boolean;
  isOtherGovernment(query: string): boolean;
}
```

### ResponseTemplateService

```typescript
interface ResponseTemplate {
  message: string;
  examples: string[];
  competencyAreas: string[];
}

class ResponseTemplateService {
  getOutOfScopeResponse(category?: string): ResponseTemplate;
  getDGADRCompetencies(): string[];
  getExampleQuestions(): string[];
}
```

### Enhanced Detection Categories

#### 1. General Knowledge Detection

- **Science**: physics, chemistry, biology, astronomy, mathematics
- **History**: historical events, dates, figures, periods
- **Geography**: countries, capitals, landmarks, general locations
- **Culture**: literature, art, music, entertainment
- **Technology**: general IT, software, hardware (non-DGADR)

#### 2. Personal Advice Detection

- **Health**: medical advice, symptoms, treatments, medications
- **Legal**: legal advice, rights, procedures, court matters
- **Financial**: investments, taxes (non-agricultural), banking
- **Personal**: relationships, career advice, life decisions

#### 3. Entertainment Detection

- **Games**: puzzles, riddles, word games, trivia
- **Jokes**: humor requests, funny stories, entertainment
- **Stories**: creative writing, fictional narratives
- **Casual Chat**: greetings without purpose, small talk

#### 4. Other Government Services

- **Social Security**: pensions, benefits, social services
- **Health Services**: SNS, hospitals, health centers
- **Education**: schools, universities, educational programs
- **Transportation**: roads, public transport, traffic
- **Justice**: courts, legal procedures, police matters

## Data Models

### Detection Configuration

```typescript
interface DetectionConfig {
  outOfScopeCategories: {
    [category: string]: {
      keywords: string[];
      patterns: RegExp[];
      confidence: number;
    };
  };
  dgadrCompetencies: string[];
  responseTemplates: {
    [category: string]: ResponseTemplate;
  };
}
```

### Query Analysis Result

```typescript
interface QueryAnalysis {
  originalQuery: string;
  normalizedQuery: string;
  detectedKeywords: string[];
  scopeResult: ScopeDetectionResult;
  recommendedAction: "respond" | "redirect" | "clarify";
}
```

## Error Handling

### Detection Failures

- **Fallback to Conservative Approach**: If detection fails, assume out-of-scope
- **Logging**: Record failed detections for system improvement
- **Graceful Degradation**: Provide generic out-of-scope response

### Edge Cases

- **Ambiguous Queries**: Queries that could be both in and out of scope
- **Mixed Topics**: Queries combining DGADR and non-DGADR topics
- **Language Variations**: Different ways of expressing the same concept
- **Typos and Misspellings**: Robust matching despite text errors

## Testing Strategy

### Unit Tests

- Test individual detection methods with known inputs
- Verify response template generation
- Test keyword matching accuracy
- Validate confidence scoring

### Integration Tests

- Test full pipeline from query to response
- Verify proper integration with existing AIService
- Test fallback mechanisms
- Validate logging and monitoring

### User Acceptance Tests

- Test with real user queries from different categories
- Verify response appropriateness and tone
- Test edge cases and ambiguous queries
- Validate user experience flow

## Implementation Approach

### Phase 1: Core Detection

1. Implement ScopeDetectionService with basic keyword matching
2. Create ResponseTemplateService with standard templates
3. Define comprehensive out-of-scope keyword lists
4. Integrate with existing AIService

### Phase 2: Advanced Detection

1. Add pattern-based detection for complex queries
2. Implement confidence scoring system
3. Add context analysis for ambiguous cases
4. Enhance response personalization

### Phase 3: Monitoring and Optimization

1. Add logging and analytics for detection accuracy
2. Implement feedback mechanism for false positives/negatives
3. Create admin interface for updating detection rules
4. Optimize performance and response times

## Response Templates

### Standard Out-of-Scope Response

```
"A sua questão não se enquadra nas competências da DGADR.

A DGADR esclarece sobre:
• Agricultura e apoios rurais
• Desenvolvimento rural e turismo rural
• Recursos florestais e licenciamentos
• Sanidade animal e vegetal
• Segurança alimentar

Exemplos de perguntas que posso ajudar:
• 'Como candidatar-me a apoios para jovens agricultores?'
• 'Preciso de licença para cortar árvores?'
• 'Informações sobre produção biológica'

Pretende mais algum esclarecimento sobre estes temas?"
```

### Category-Specific Responses

- **General Knowledge**: Focus on DGADR's technical expertise areas
- **Personal Advice**: Redirect to appropriate professional services
- **Entertainment**: Politely decline and redirect to DGADR topics
- **Other Government**: Provide relevant external contacts when available

## Performance Considerations

### Detection Speed

- **Target Response Time**: < 200ms for scope detection
- **Caching**: Cache detection results for similar queries
- **Optimization**: Use efficient string matching algorithms

### Memory Usage

- **Keyword Storage**: Optimize keyword lists for memory efficiency
- **Pattern Compilation**: Pre-compile regex patterns for performance
- **Result Caching**: Implement LRU cache for recent detections

## Security Considerations

### Input Validation

- **Sanitization**: Clean user input before processing
- **Length Limits**: Prevent excessively long queries
- **Rate Limiting**: Prevent abuse of detection system

### Data Protection

- **Query Logging**: Ensure compliance with privacy regulations
- **Sensitive Information**: Detect and handle personal information appropriately
- **Audit Trail**: Maintain logs for system monitoring and improvement
