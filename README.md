# AI Report

AI Report is a web application that transforms content into structured, professional reports. Whether you have a GPT conversation, scratch notes, or text files, you can quickly generate well-formatted reports with different templates.

## Features

### Multiple Input Methods
- **LLM Conversations**: Extract content from shared GPT conversation links
- **Scratch Notes**: Convert your quick notes into structured reports
- **File Upload**: Process content from .md, .txt, or .json files (up to 1MB)

### Report Generation
- **Smart Templates**: Choose from multiple professional templates:
  - Executive Summary
  - Detailed Analysis
  - Meeting Notes
  - Project Documentation
  - Research Summary
  - Product Specification
- **Format Options**: Download as PDF, markdown, or copy as text
- **Preview Support**: See template structure before generating

### Modern Interface
- **Clean UI**: Modern, responsive interface built with Next.js and Tailwind CSS
- **Dark Mode**: Toggle between light and dark themes
- **Drag & Drop**: Easy file uploading with drag and drop support

## Important Usage Notes

### Using LLM Conversations

For the app to access your ChatGPT conversations, they must be properly shared:

1. Open your conversation in ChatGPT
2. Click the "Share" button at the top (square with arrow icon)
3. **Important:** Toggle "Share with web" to ON position
4. Click "Create shared link"
5. Copy and paste the entire URL into the app

If your shared link returns a login page, the "Share with web" toggle was not enabled.

### File Upload Guidelines

When uploading files:
- Supported formats: .md, .txt, .json
- Maximum file size: 1MB
- Files should contain text content for analysis

### API Key Configuration

The application requires an OpenAI API key to generate reports. It also supports using Google's Gemini model through OpenRouter.

- For OpenAI: Use an API key from your [OpenAI dashboard](https://platform.openai.com/api-keys)
- For Gemini: [Get an API key from OpenRouter](https://openrouter.ai/) (starts with `sk-or-`)

### Example Mode

If you don't have a shared conversation available, you can use the "Example URL" button for testing.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key for report generation

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-report.git
cd ai-report
```

2. Install dependencies
```bash
npm install --legacy-peer-deps
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```env
OPENAI_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-report.git
```

2. Install dependencies using our makefile for convenience:
```bash
make setup
```

3. Update your API key in the `.env.local` file:
```
OPENAI_API_KEY=your_key_here
```

4. Start the development server:
```bash
make dev
```

5. Open [http://localhost:3000](http://localhost:3000) and try it out!

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **UI Components**: shadcn/ui
- **AI Integration**: OpenAI API via AI SDK
- **Parsing**: Cheerio for HTML parsing
- **Markdown**: React Markdown for rendering
- **Deployment**: Vercel

## Project Structure

```
/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── app/               # Protected app routes
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # UI components from shadcn
│   └── ...               # Feature components
├── lib/                   # Utility functions
│   ├── templates/        # Report template system
│   │   ├── formats/     # Format instructions
│   │   ├── templates/   # Template definitions
│   │   └── README.md    # Template docs
├── public/               # Static assets
└── styles/               # Global styles
```

### Template System

The application uses a modular template system for report generation. Each template includes:
- Professional format instructions
- AI system prompts
- Preview content
- Styling metadata

For information on creating or modifying templates, see [Template Documentation](lib/templates/README.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
