import { db } from "../index";

export function getReview(guildId: string) {
    return db
        .selectFrom("reviews")
        .selectAll()
        .where("guildId", "=", guildId)
        .executeTakeFirst();
}

export function getAllReviews() {
    return db
        .selectFrom("reviews")
        .selectAll()
        .execute();
}