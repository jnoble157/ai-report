import { Template } from '../types';
import { formatInstructions } from '../formats';

export const meetingTemplate: Template = {
  id: 'meeting',
  name: 'Meeting Notes',
  description: 'Structured meeting notes with action items and next steps',
  systemPrompt: `You are an expert at creating clear, actionable meeting notes. Transform the provided content into well-organized meeting documentation.

Focus on:
- Identifying key discussion topics and decisions
- Capturing action items and ownership
- Maintaining clear structure and organization
- Highlighting next steps and follow-ups

Be specific about who is responsible for what.`,
  formatInstructions: formatInstructions.meeting,
  metadata: {
    icon: 'calendar',
    color: 'green',
    previewContent: `# Meeting Notes: Project Review

**Date:** Sample Date
**Participants:** Team Members

## Agenda
1. Project Status Update
2. Technical Challenges
3. Next Sprint Planning

## Discussion Points
### Project Status
- Milestone completion status
- Resource allocation
- Timeline adjustments

## Action Items
| Task | Owner | Due Date |
|------|--------|----------|
| Task 1 | Alice | Date |
| Task 2 | Bob | Date |`
  }
}; 