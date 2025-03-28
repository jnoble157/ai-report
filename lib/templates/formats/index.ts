import { FormatInstructions } from '../types';

export const formatInstructions: Record<string, FormatInstructions> = {
  executive: {
    markdown: `# Executive Summary: [Topic]

## Overview
[1-2 sentence summary of the entire discussion]

## Key Points
- [Key point 1]
- [Key point 2]
- [Key point 3]

## Conclusions
[Brief summary of conclusions or decisions reached]

## Next Steps
- [Action item 1]
- [Action item 2]
- [Action item 3]

---
*Generated with AI Report from conversation on [date]*`,
    text: `EXECUTIVE SUMMARY: [TOPIC]

OVERVIEW
[1-2 sentence summary]

KEY POINTS
* [Key point 1]
* [Key point 2]
* [Key point 3]

CONCLUSIONS
[Brief summary]

NEXT STEPS
* [Action item 1]
* [Action item 2]
* [Action item 3]

---
Generated with AI Report`
  },
  detailed: {
    markdown: `# Detailed Analysis: [Topic]

## Background
[Context and background information]

## Problem Statement
[Clear problem definition]

## Analysis
### [Subtopic 1]
[Analysis details]

### [Subtopic 2]
[Analysis details]

## Evidence and Data
- [Supporting fact 1]
- [Supporting fact 2]
- [Supporting fact 3]

## Recommendations
1. [Primary recommendation]
2. [Secondary recommendation]
3. [Tertiary recommendation]

---
*Generated with AI Report*`,
    text: `DETAILED ANALYSIS: [TOPIC]

BACKGROUND
[Context]

PROBLEM STATEMENT
[Definition]

ANALYSIS
[Details]

EVIDENCE AND DATA
* [Fact 1]
* [Fact 2]
* [Fact 3]

RECOMMENDATIONS
1. [Primary]
2. [Secondary]
3. [Tertiary]

---
Generated with AI Report`
  },
  meeting: {
    markdown: `# Meeting Notes: [Topic]

**Date:** [Meeting Date]
**Participants:** [List of participants]

## Agenda
1. [Agenda item 1]
2. [Agenda item 2]
3. [Agenda item 3]

## Discussion Points
### [Topic 1]
- [Key points]
- [Decisions]

## Action Items
| Task | Owner | Due Date |
|------|--------|----------|
| [Task 1] | [Owner] | [Date] |

---
*Generated with AI Report*`,
    text: `MEETING NOTES: [TOPIC]

Date: [Date]
Participants: [List]

AGENDA
1. [Item 1]
2. [Item 2]

DISCUSSION
[Topic 1]
* [Points]
* [Decisions]

ACTION ITEMS
Task: [Task 1]
Owner: [Name]
Due: [Date]

---
Generated with AI Report`
  },
  project: {
    markdown: `# [Project Name]

## Project Overview
[Project description and goals]

## Key Features
- [Feature 1]
- [Feature 2]
- [Feature 3]

## Technical Stack
- [Technology 1]
- [Technology 2]
- [Technology 3]

## Requirements
### Functional Requirements
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

### Technical Specifications
- [Spec 1]
- [Spec 2]
- [Spec 3]

## Implementation Plan
### Phase 1: Foundation
- [Task 1]
- [Task 2]
- [Task 3]

### Phase 2: Core Features
- [Task 1]
- [Task 2]
- [Task 3]

## Status and Next Steps
- [Current status]
- [Next milestone]
- [Future plans]

---
*Generated with AI Report*`,
    text: `[PROJECT NAME]

PROJECT OVERVIEW
[Project description and goals]

KEY FEATURES
* [Feature 1]
* [Feature 2]
* [Feature 3]

TECHNICAL STACK
* [Technology 1]
* [Technology 2]
* [Technology 3]

REQUIREMENTS
Functional:
* [Requirement 1]
* [Requirement 2]
* [Requirement 3]

Technical:
* [Spec 1]
* [Spec 2]
* [Spec 3]

IMPLEMENTATION
Phase 1:
* [Task 1]
* [Task 2]
* [Task 3]

Phase 2:
* [Task 1]
* [Task 2]
* [Task 3]

STATUS AND NEXT STEPS
* [Current status]
* [Next milestone]
* [Future plans]

---
Generated with AI Report`
  },
  research: {
    markdown: `# Research Summary: [Topic]

## Abstract
[Brief summary]

## Methodology
[Research methods]

## Key Findings
### Finding 1
[Details]

## Implications
[Impact]

## Future Research
[Suggestions]

---
*Generated with AI Report*`,
    text: `RESEARCH: [TOPIC]

ABSTRACT
[Summary]

METHODOLOGY
[Methods]

FINDINGS
1. [Finding 1]
2. [Finding 2]

IMPLICATIONS
[Impact]

FUTURE RESEARCH
[Suggestions]

---
Generated with AI Report`
  },
  product: {
    markdown: `# Product Specification: [Name]

## Overview
[Description]

## User Personas
### Primary User
- Demographics: [Details]
- Goals: [Goals]
- Pain Points: [Points]

## Features
- [Feature 1]
- [Feature 2]

## Success Metrics
- [Metric 1]
- [Metric 2]

---
*Generated with AI Report*`,
    text: `PRODUCT: [NAME]

OVERVIEW
[Description]

USERS
Primary:
* Demographics: [Details]
* Goals: [Goals]
* Pain Points: [Points]

FEATURES
* [Feature 1]
* [Feature 2]

METRICS
* [Metric 1]
* [Metric 2]

---
Generated with AI Report`
  }
}; 