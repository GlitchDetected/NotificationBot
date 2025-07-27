import { db } from "../index";

export function getReviews(guildId: string) {
    return db
        .selectFrom("reviews")
        .selectAll()
        .where("guildId", "=", guildId)
        .executeTakeFirst();
}