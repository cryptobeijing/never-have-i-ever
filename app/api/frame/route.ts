import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { untrustedData } = data
    const { state } = untrustedData

    // Fetch the prompt data
    const prompt = await fetch(`https://debbiedoes.fun/api/prompts/${state}`).then(res => res.json())
    const imageUrl = `https://debbiedoes.fun/api/og?author=${prompt.author?.username || 'anonymous'}&content=${encodeURIComponent(prompt.content)}&confessions=${prompt.totalConfessions}`
    const promptUrl = `https://debbiedoes.fun/prompts/${state}`

    // Return HTML with frame metadata
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Never Have I Ever: ${prompt.content}</title>
          <meta property="og:title" content="Never Have I Ever: ${prompt.content}" />
          <meta property="og:description" content="Join ${prompt.totalConfessions} others in confessing" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:post_url" content="${promptUrl}" />
          <meta property="fc:frame:image" content="${imageUrl}" />
          <meta property="fc:frame:button:1" content="🤫 Start Confessing" />
          <meta property="fc:frame:state" content="${state}" />
          <meta http-equiv="refresh" content="0;url=${promptUrl}" />
        </head>
        <body>
          <p>Redirecting to prompt...</p>
        </body>
      </html>
    `

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      }
    })
  } catch (error) {
    console.error('Error in frame handler:', error)
    return new Response('Error processing frame action', { status: 500 })
  }
} 