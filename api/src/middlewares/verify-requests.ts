export default function apiKeyMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
        const apikeyheader = req.header("apikey");
        const API_SECRET = process.env.API_SECRET;

        if (!apikeyheader || apikeyheader !== API_SECRET) {
            res.status(401).json({ message: "Invalid or missing API key" });
            return;
        }

    } catch (error) {
        console.error(error);
    }

    next();
}