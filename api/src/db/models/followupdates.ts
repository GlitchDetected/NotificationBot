import { db } from "../index";

export function getFollowUpdates(guildId: string) {
    return db
        .selectFrom("followupdates")
        .selectAll()
        .where("guildId", "=", guildId)
        .executeTakeFirst();
}