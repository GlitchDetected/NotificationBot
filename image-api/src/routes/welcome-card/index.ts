import { Hono } from "hono";
import sharp from "sharp";

const router = new Hono();

router.get("/", async (c) => {
    const type = c.req.query("type");
    const username = c.req.query("username") || "Unknown User";
    const members = c.req.query("members") || "0";
    const hash = c.req.query("hash") || "";
    const background = c.req.query("background") || "#222";
    const textColor = c.req.query("text_color") || "#fff";

    if (type !== "welcome" && type !== "goodbye") {
        return c.text('Invalid type — must be "welcome" or "goodbye"', 400);
    }

    const title = type === "welcome" ? `Welcome, ${username}!` : `Goodbye, ${username}!`;

    let baseImage: Buffer;

    if (background.startsWith("http")) {
        try {
            const response = await fetch(background);
            if (!response.ok) return c.text("Failed to fetch background image", 400);
            const arrayBuffer = await response.arrayBuffer();
            baseImage = Buffer.from(arrayBuffer);
        } catch (err) {
            return c.text("Error fetching background image", 500);
        }
    } else {
        // Solid color background: create a plain image
        baseImage = await sharp({
            create: {
                width: 960,
                height: 540,
                channels: 3,
                background: background,
            },
        })
            .png()
            .toBuffer();
    }

    // Create SVG overlay with the text
    const svgOverlay = `
<svg width="960" height="540">
  <text x="50" y="120" font-size="50" fill="${textColor}" font-family="Sans">${title}</text>
  <text x="50" y="200" font-size="38" fill="${textColor}" font-family="Sans">Members: ${members}</text>
  <text x="50" y="260" font-size="28" fill="${textColor}" font-family="Sans">Hash: ${hash}</text>
</svg>
`;

    // Composite the text on top of the background
    const finalImage = await sharp(baseImage)
        .resize(960, 540) // ensure consistent size
        .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
        .png()
        .toBuffer();

    return c.body(new Uint8Array(finalImage), {
        status: 200,
        headers: { "Content-Type": "image/png" },
    });
});

export default router;