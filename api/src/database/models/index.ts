import Bye from "./bye";
import DmNotifications from "./dmnotifications";
import FollowUpdates from "./followupdates";
import Notifications from "./notifications";
import User from "./User";
import Welcome from "./welcome";

const models = {
    User,
    Notifications,
    DmNotifications,
    FollowUpdates,
    Welcome,
    Bye
};

export type ModelsMap = typeof models;
export default models;