import { db } from "../index";

export function getDmNotifications(userId?: string) {
    let query = db.selectFrom("dmnotifications").selectAll();

    if (userId) {
        query = query.where("userId", "=", userId);
    }

    return query.execute(); // returns Promise<DmNotification[]>
}