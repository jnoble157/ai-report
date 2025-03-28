import { Template } from '../types';
import { formatInstructions } from '../formats';

export const detailedTemplate: Template = {
  id: 'detailed',
  name: 'Detailed Analysis',
  description: 'Comprehensive analysis with background and recommendations',
  systemPrompt: `You are an expert analyst tasked with creating a detailed analysis report. Transform the provided content into a comprehensive analysis.

Focus on:
- Providing thorough context and background
- Breaking down complex topics into clear subtopics
- Supporting arguments with evidence and data
- Offering concrete, actionable recommendations
- Maintaining academic rigor while being accessible

Be thorough but clear in your analysis.`,
  formatInstructions: formatInstructions.detailed,
  metadata: {
    icon: 'book-open',
    color: 'purple',
    previewContent: `# Detailed Analysis: Sample Report

## Background
Context and historical information.

## Problem Statement
Clear definition of the challenge or opportunity.

## Analysis
### Market Trends
Detailed exploration of market dynamics...

### Technical Feasibility
In-depth technical analysis...

## Evidence and Data
- Statistical evidence point
- Market research finding
- Technical validation

## Recommendations
1. Primary strategic initiative
2. Technical implementation plan
3. Resource allocation strategy`
  }
}; 