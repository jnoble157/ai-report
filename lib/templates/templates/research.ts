import { Template } from '../types';
import { formatInstructions } from '../formats';

export const researchTemplate: Template = {
  id: 'research',
  name: 'Research Summary',
  description: 'Academic-style research summary with methodology and findings',
  systemPrompt: `You are an expert researcher creating a research summary. Transform the provided content into a clear, academic research summary.

Focus on:
- Presenting clear methodology and findings
- Supporting conclusions with data
- Acknowledging limitations
- Suggesting future research directions
- Maintaining academic rigor and proper citations

Be thorough and scientific in your analysis.`,
  formatInstructions: formatInstructions.research,
  metadata: {
    icon: 'microscope',
    color: 'yellow',
    previewContent: `# Research Summary: Topic Analysis

## Abstract
Brief overview of research objectives and findings.

## Methodology
- Data collection approach
- Analysis methods
- Validation techniques

## Key Findings
### Finding 1: Title
Detailed explanation with supporting data...

## Implications
Discussion of research impact and applications.

## Future Research
Suggested areas for further investigation.`
  }
}; 