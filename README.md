# AI Report

AI Report is a web application that transforms GPT conversations into structured, professional reports. Simply paste a shared conversation URL, choose a report template, and get a well-formatted report in seconds.

## Features

- **Conversation Parsing**: Extract content from shared GPT conversation links
- **Multiple Report Templates**: Choose from executive summaries, detailed breakdowns, or actionable insights
- **Export Options**: Download as PDF, markdown, or copy as text
- **Clean UI**: Modern, responsive interface built with Next.js and Tailwind CSS
- **Dark Mode Support**: Toggle between light and dark themes

## Important Usage Notes

### Sharing ChatGPT Conversations

For the app to access your ChatGPT conversations, they must be properly shared:

1. Open your conversation in ChatGPT
2. Click the "Share" button at the top (square with arrow icon)
3. **Important:** Toggle "Share with web" to ON position
4. Click "Create shared link"
5. Copy and paste the entire URL into the app

If your shared link returns a login page, the "Share with web" toggle was not enabled.

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
├── public/               # Static assets
└── styles/               # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
