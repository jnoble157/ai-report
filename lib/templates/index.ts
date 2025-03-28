import { type Template, type TemplateContext, type TemplateManager } from './types';
import { executiveTemplate } from './templates/executive';
import { detailedTemplate } from './templates/detailed';
import { meetingTemplate } from './templates/meeting';
import { projectTemplate } from './templates/project';
import { researchTemplate } from './templates/research';
import { productTemplate } from './templates/product';

class DefaultTemplateManager implements TemplateManager {
  private templates: Map<string, Template>;

  constructor() {
    this.templates = new Map();
    this.registerTemplate(executiveTemplate);
    this.registerTemplate(detailedTemplate);
    this.registerTemplate(meetingTemplate);
    this.registerTemplate(projectTemplate);
    this.registerTemplate(researchTemplate);
    this.registerTemplate(productTemplate);
  }

  private registerTemplate(template: Template) {
    this.templates.set(template.id, template);
  }

  getTemplate(id: string): Template | undefined {
    return this.templates.get(id);
  }

  getAllTemplates(): Template[] {
    return Array.from(this.templates.values());
  }

  getSystemPrompt(template: Template, context: TemplateContext): string {
    const formatInstructions = template.formatInstructions?.[context.format];
    return `${template.systemPrompt}

Format the output using this structure:

${formatInstructions}`;
  }
}

export const templateManager = new DefaultTemplateManager(); 