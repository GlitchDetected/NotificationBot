import { Hono } from 'hono';
import dmnotifications from "../../../database/models/dmnotifications";
import { httpError } from '../../../utils/httperror';
import { HttpErrorMessage } from '../../../utils/httpjson';

const router = new Hono();

/**
 * GET /dashboard/dmnotifications?userId=USER_ID
 * Fetch the user dmnotifications configuration for a specific user.
 */
router.get("/", async (c) => {
  try {
      const user = c.get('user');
    
      if (!user?.accessToken) {
         return httpError(HttpErrorMessage.MissingAccess)
      }

    const config = await dmnotifications.findOne({ where: { userId: user.id } });
    if (!config) {
       return c.json({ message: "No user dmnotifications configuration found." });
    }

     return c.json({
      embedcolor: config.embedcolor,
      source: config.source,
      thumbnail: config.thumbnail,
      message: config.message
    });
  } catch (error) {
    console.error("Error fetching user dmnotifications configuration:", error);
     return c.json({ message: "Error fetching user dmnotifications configuration", error });
  }
});

router.patch("/", async (c) => {
    const user = c.get("user");
  if (!user?.id) {
    return httpError(HttpErrorMessage.MissingAccess);
  }

  const body = await c.req.json();

  try {
    let config = await dmnotifications.findOne({ where: { userId: user.id } });

    if (config) {
      const keys: Array<"embedcolor" | "source" | "thumbnail" | "message"> = 
      ["embedcolor", "source", "thumbnail", "message"];
      
      for (const key of keys) {
        if (key in body) {
          (config as any)[key] = body[key];
        }
      }
      await config.save();
    } else {
      // Create
      config = await dmnotifications.create({
        userId: user.id,
        embedcolor: body.embedcolor,
        source: body.source,
        thumbnail: body.thumbnail,
        message: body.message,
      });
    }

     return c.json({
      embedcolor: config.embedcolor,
      source: config.source,
      thumbnail: config.thumbnail,
      message: config.message
    });
  } catch (error) {
    console.error("Error creating/updating user dmnotifications configuration:", error);
     return c.json({ message: "Error creating/updating dmnotifications configuration", error });
  }
});

/**
 * DELETE /dashboard/dmnotifications?userId=USER_ID
 * Delete a user's dmnotifications configuration.
 */
router.delete("/", async (c) => {
      const user = c.get('user');
    
      if (!user?.accessToken) {
         return httpError(HttpErrorMessage.MissingAccess)
      }

  try {
    const deletedCount = await dmnotifications.destroy({ where: { userId: user.id } });
    if (!deletedCount) {
       return c.json({ message: "No configuration found to delete." });
    }
     return c.json({ message: "dmnotifications configuration deleted successfully." });
  } catch (error) {
    console.error("Error deleting dmnotifications configuration:", error);
     return c.json({ message: "Error deleting dmnotifications configuration", error });
  }
});

export default router;
