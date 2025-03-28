import { Template } from '../types';
import { formatInstructions } from '../formats';

export const projectTemplate: Template = {
  id: 'project',
  name: 'Project Documentation',
  description: 'Comprehensive project documentation with technical details',
  systemPrompt: `You are an expert technical writer creating project documentation. Transform the provided content into clear, comprehensive project documentation.

Focus on:
- Clearly defining project scope and requirements
- Breaking down technical specifications
- Outlining implementation phases
- Providing clear timelines and resources
- Maintaining technical accuracy while being readable

Be thorough in technical details while keeping it accessible.`,
  formatInstructions: formatInstructions.project,
  metadata: {
    icon: 'file-code',
    color: 'indigo',
    previewContent: `# Project Documentation: Sample Project

## Project Overview
Brief description of project goals and scope.

## Requirements
### Functional Requirements
- User authentication system
- Data processing pipeline
- Reporting interface

### Technical Specifications
- Architecture overview
- Technology stack
- Security considerations

## Implementation Plan
### Phase 1: Foundation
- Core infrastructure setup
- Basic functionality implementation`
  }
}; 