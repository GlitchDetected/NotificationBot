import { db } from "../index";

export function getBye(guildId: string) {
    return db
        .selectFrom("bye")
        .selectAll()
        .where("guildId", "=", guildId)
        .executeTakeFirst();
}