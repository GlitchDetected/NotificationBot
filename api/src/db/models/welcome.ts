import type { Insertable } from "kysely";

import { db } from "../index";
import type { Database } from "../types";

export function getWelcome(guildId: string) {
    return db
        .selectFrom("welcome")
        .selectAll()
        .where("guildId", "=", guildId)
        .executeTakeFirst();
}

const DISALLOWED_UPDATE_COLUMNS = [
    "createdAt"
] satisfies (keyof Database["welcome"])[];

export function upsertWelcome(welcome: Insertable<Database["welcome"]>) {
    const updateConfig = welcome;

    for (const k of Object.keys(updateConfig) as typeof DISALLOWED_UPDATE_COLUMNS) {
        if (!DISALLOWED_UPDATE_COLUMNS.includes(k)) continue;
        updateConfig[k] = undefined as unknown as never;
    }

    return db
        .insertInto("welcome")
        .values(welcome)
        .onConflict((oc) => oc
            .column("guildId")
            .doUpdateSet(updateConfig)
        )
        .returningAll()
        .executeTakeFirst() as unknown as Promise<Database["welcome"]>;
}