import { db } from "../index";
import type { ByeTable } from "../types";

export function getBye(guildId: string) {
    return db
        .selectFrom("bye")
        .selectAll()
        .where("guildId", "=", guildId)
        .executeTakeFirst();
}

export function createBye(data: Omit<ByeTable, "createdAt" | "updatedAt">) {
    return db
        .insertInto("bye")
        .values(data)
        .returningAll()
        .executeTakeFirst();
}

export function updateBye(
    guildId: string,
    updates: Partial<Omit<ByeTable, "userId" | "createdAt" | "updatedAt">>
) {
    return db
        .updateTable("bye")
        .set(updates)
        .where("guildId", "=", guildId)
        .executeTakeFirst();
}