import { Hono } from 'hono';
import { httpError } from '../../utils/httperror';
import { HttpErrorMessage } from '../../utils/httpjson';

const router = new Hono();

// localhost:3001/sessions/
// api.notificationbot.xyz/sessions/

router.get("/", async (c) => {
  try {
    
  const user = c.get('user');

  if (!user?.accessToken) {
     return httpError(HttpErrorMessage.MissingAccess)
  }

  return c.json({
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatarHash: user.avatarHash
  })
  } catch (err) {
    console.error("Error processing sessions data:", err);
    return c.json({ error: "Internal server error" });
  }
});

export default router;