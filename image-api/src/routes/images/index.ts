import { Hono } from 'hono'
import sharp from 'sharp'

const router = new Hono();

router.get('/', async (c) => {
  // Get query parameters
  const type = c.req.query('type') || 'join'
  const username = c.req.query('username') || 'Unknown User'
  const members = c.req.query('members') || '0'
  const hash = c.req.query('hash') || ''
  const background = c.req.query('background') || '#222'

  const svg = `
    <svg width="700" height="250">
      <rect width="100%" height="100%" fill="${background}"/>
      <text x="30" y="80" font-size="32" fill="#fff" font-family="Sans">
        ${type === 'join' ? 'Welcome' : 'Goodbye'}, ${username}!
      </text>
      <text x="30" y="140" font-size="24" fill="#fff" font-family="Sans">
        Members: ${members}
      </text>
      <text x="30" y="190" font-size="18" fill="#fff" font-family="Sans">
        Hash: ${hash}
      </text>
    </svg>
  `

  const imageBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer()

  return new Response(new Uint8Array(imageBuffer), {
    headers: { 'Content-Type': 'image/png' },
    status: 200
  })
})

export default router;