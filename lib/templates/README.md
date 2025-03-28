# Templates System

This directory contains the template system for AI Report. The system is designed to be modular and easily extensible.

## Directory Structure

```
templates/
├── formats/         # Format instructions for each template type
├── templates/       # Individual template definitions
├── types.ts        # TypeScript type definitions
├── index.ts        # Template manager implementation
└── README.md       # This file
```

## Adding a New Template

1. Create a new file in `templates/` (e.g., `templates/new-template.ts`)
2. Define your template using the `Template` interface:

```typescript
import { Template } from '../types';
import { formatInstructions } from '../formats';

export const newTemplate: Template = {
  id: 'unique-id',
  name: 'Display Name',
  description: 'Brief description',
  systemPrompt: `System instructions for the AI...`,
  formatInstructions: formatInstructions.yourFormat,
  metadata: {
    icon: 'icon-name',    // From available icon set
    color: 'color-name',  // Tailwind color
    previewContent: `...` // Markdown preview
  }
};
```

3. Add format instructions in `formats/index.ts`:

```typescript
yourFormat: {
  markdown: `# Template structure in markdown...`,
  text: `TEMPLATE STRUCTURE IN TEXT...`
}
```

4. Register the template in `index.ts`:

```typescript
import { newTemplate } from './templates/new-template';
// ...
this.registerTemplate(newTemplate);
```

## Template Guidelines

### System Prompts
- Be specific about the role and task
- Include clear focus points
- Keep instructions concise but comprehensive
- Use consistent language and tone

### Format Instructions
- Include both markdown and text formats
- Use consistent structure
- Include placeholders in [brackets]
- Add signature line at the bottom

### Metadata
- Choose appropriate icons from the icon set
- Use Tailwind colors for consistency
- Provide realistic preview content

## Available Icons
- clipboard-list
- book-open
- calendar
- file-code
- microscope
- box
- (Add new icons to this list when used)

## Tailwind Colors
- blue
- purple
- green
- indigo
- yellow
- orange
- (Use Tailwind color palette) 