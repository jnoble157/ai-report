import { Template } from '../types';
import { formatInstructions } from '../formats';

export const executiveTemplate: Template = {
  id: 'executive',
  name: 'Executive Summary',
  description: 'A concise overview with key points and next steps',
  systemPrompt: `You are an expert at creating executive summaries. Transform the provided content into a clear, actionable executive summary.

Focus on:
- Extracting the main topic and key discussion points
- Identifying concrete conclusions and decisions
- Outlining specific next steps and action items
- Maintaining professional, clear language

Keep the summary focused and actionable.`,
  formatInstructions: formatInstructions.executive,
  metadata: {
    icon: 'clipboard-list',
    color: 'blue',
    previewContent: `# Executive Summary: Sample Report

## Overview
A concise overview of the key points and findings.

## Key Points
- Strategic insight highlighted here
- Important data point or trend
- Critical business impact

## Conclusions
Clear summary of decisions and outcomes.

## Next Steps
- Action item with owner
- Timeline for implementation
- Follow-up requirements`
  }
}; 