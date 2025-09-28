import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import sharp from 'sharp'
import { HttpErrorCode, HttpErrorMessage } from './constants/http-error.js'
import baseRouter from "./routes/base-router";

const app = new Hono()

app.route("/", baseRouter);

app.get('/*', async (c) => {
  const statusCode = HttpErrorCode.NotFound
  const message = HttpErrorMessage.NotFound

  // Generate an SVG to render with Sharp
  const svg = `
  <svg width="500" height="200">
    <rect width="100%" height="100%" fill="#222"/>
    <text x="30" y="80" font-size="24" fill="#fff" font-family="Sans">Status: ${statusCode}</text>
    <text x="30" y="130" font-size="24" fill="#fff" font-family="Sans">Message: ${message}</text>
  </svg>
  `

  // Convert SVG to PNG
  const imageBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer()
  const pngData = new Uint8Array(imageBuffer)

  return new Response(pngData, {
    headers: { 'Content-Type': 'image/png' },
    status: statusCode
  })
})

const PORT = Number(process.env.PORT) || 5000

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`Server listening on http://localhost:${info.port}`)
  }
)

export default app;