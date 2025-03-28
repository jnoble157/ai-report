import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    console.log('Fetching conversation HTML from:', url)
    
    // Log request details
    console.log('Fetching conversation from:', url);
    
    // Fetch the content directly with all necessary headers
    const response = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-User': '?1',
        'Origin': 'https://aireport.dev',
        'Referer': 'https://aireport.dev/',
        'Connection': 'keep-alive'
      }
    })

    if (!response.ok) {
      console.error('Failed to fetch conversation:', response.status, response.statusText)
      return NextResponse.json(
        { error: `Failed to fetch conversation: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const html = await response.text()
    
    // Log response details
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    console.log('HTML length:', html.length)
    console.log('First 500 chars:', html.substring(0, 500))
    
    // Look for specific elements that indicate what we received
    const $ = cheerio.load(html)
    console.log('Meta tags:', $('meta').map((_: number, el: any) => $(el).attr('content')).get())
    console.log('Script types:', $('script').map((_: number, el: any) => $(el).attr('type')).get())
    console.log('Script src:', $('script').map((_: number, el: any) => $(el).attr('src')).get())
    
    // Check for specific content
    const mainContent = $('main').html()
    if (mainContent) {
      console.log('Main content first 500 chars:', mainContent.substring(0, 500))
    }
    
    // Look for conversation data in scripts
    $('script').each((_: number, el: any) => {
      const content = $(el).html() || ''
      if (content.includes('messages') || content.includes('conversation')) {
        console.log('Found interesting script:', content.substring(0, 200))
      }
    })
    
    // Check if we got a login page
    if (html.includes('Sign in to ChatGPT') || 
        html.includes('Log in with your OpenAI account') ||
        response.headers.get('x-frame-options') === 'DENY') {
      return NextResponse.json(
        { error: 'This conversation requires authentication. Make sure it is shared publicly.' },
        { status: 401 }
      )
    }
    
    // Check if we got an error page
    if (html.includes('Error 404') || html.includes('Page not found')) {
      return NextResponse.json(
        { error: 'Conversation not found. The URL might be incorrect or the conversation might have been deleted.' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ html })
  } catch (error: unknown) {
    console.error('Error fetching conversation:', error)
    
    // Type guard for Error objects
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        cause: error.cause,
        stack: error.stack
      })
      return NextResponse.json(
        { 
          error: 'Failed to fetch conversation',
          details: error.message,
          type: error.name
        },
        { status: 500 }
      )
    }
    
    // Generic error handling
    return NextResponse.json(
      { 
        error: 'Failed to fetch conversation',
        details: String(error)
      },
      { status: 500 }
    )
  }
}
