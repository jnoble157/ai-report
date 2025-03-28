import { Template } from '../types';
import { formatInstructions } from '../formats';

export const productTemplate: Template = {
  id: 'product',
  name: 'Product Specification',
  description: 'Detailed product specifications with user personas and features',
  systemPrompt: `You are an expert product manager creating a product specification. Transform the provided content into a clear, comprehensive product spec.

Focus on:
- Defining clear user personas and needs
- Outlining specific features and requirements
- Creating clear user flows
- Setting measurable success metrics
- Maintaining user-centered focus

Be specific about features and requirements.`,
  formatInstructions: formatInstructions.product,
  metadata: {
    icon: 'box',
    color: 'orange',
    previewContent: `# Product Specification: Sample Product

## Product Overview
Description of product purpose and value proposition.

## User Personas
### Primary User
- Demographics: Professional, 25-45
- Goals: Efficiency, Automation
- Pain Points: Manual processes

## Features
### Core Features
- Feature 1: Description
- Feature 2: Description

## Success Metrics
- User adoption rate
- Performance benchmarks
- Customer satisfaction`
  }
}; 