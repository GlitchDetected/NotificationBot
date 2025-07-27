import { db } from "../index";

export function getUser(id: string) {
    return db
        .selectFrom("user")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
}