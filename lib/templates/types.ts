export type InputType = 'llm' | 'scratch' | 'file';
export type ReportFormat = 'markdown' | 'text';

export interface FormatInstructions {
  markdown: string;
  text: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  formatInstructions?: FormatInstructions;
  examples?: {
    input: string;
    output: string;
  }[];
  metadata?: {
    icon?: string;
    color?: string;
    previewContent?: string;
  };
}

export interface TemplateContext {
  inputType: InputType;
  format: ReportFormat;
  content: string;
  title?: string;
}

export interface TemplateManager {
  getTemplate(id: string): Template | undefined;
  getAllTemplates(): Template[];
  getSystemPrompt(template: Template, context: TemplateContext): string;
} 