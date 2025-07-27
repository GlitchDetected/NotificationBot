import { db } from "../index";
import type { DmNotificationsTable } from "../types";

export function getDmNotification(userId: string) {
    return db
        .selectFrom("dmnotifications")
        .selectAll()
        .where("userId", "=", userId)
        .executeTakeFirst();
}

export function createDmNotification(data: Omit<DmNotificationsTable, "createdAt" | "updatedAt">) {
    return db
        .insertInto("dmnotifications")
        .values(data)
        .returningAll()
        .executeTakeFirst();
}

export function updateDmNotification(
    userId: string,
    updates: Partial<Omit<DmNotificationsTable, "userId" | "createdAt" | "updatedAt">>
) {
    return db
        .updateTable("dmnotifications")
        .set(updates)
        .where("userId", "=", userId)
        .executeTakeFirst();
}

export function deleteDmNotification(userId: string) {
    return db
        .deleteFrom("dmnotifications")
        .where("userId", "=", userId)
        .executeTakeFirst();
}