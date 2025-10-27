import { Hono } from 'hono'
import sharp from 'sharp'

const router = new Hono()

router.get('/', async (c) => {
  const type = c.req.query('type')
  const username = c.req.query('username') || 'Unknown User'
  const members = c.req.query('members') || '0'
  const hash = c.req.query('hash') || ''
  const background = c.req.query('background') || '#222'
  const style = c.req.query('style') || '1'

  if (type !== 'welcome' && type !== 'goodbye') {
    return c.text('Invalid type — must be "welcome" or "goodbye"', 400)
  }

  const title = type === 'welcome' ? `Welcome, ${username}!` : `Goodbye, ${username}!`

  let svg = `
<svg width="1024" height="450" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${background}"/>
  <text x="50" y="120" font-size="50" fill="#fff" font-family="Sans">${title}</text>
  <text x="50" y="200" font-size="38" fill="#fff" font-family="Sans">Members: ${members}</text>
  <text x="50" y="260" font-size="28" fill="#ccc" font-family="Sans">Hash: ${hash}</text>
</svg>
  `

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer()

  return c.body(new Uint8Array(pngBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
    }
  })
})

export default router
