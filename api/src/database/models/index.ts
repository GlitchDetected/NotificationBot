import Bye from "./bye";
import DmNotifications from "./dmnotifications";
import FollowUpdates from "./followupdates";
import Notifications from "./notifications";
import Reviews from "./reviews";
import User from "./User";
import Welcome from "./welcome";

const models = {
    User,
    Notifications,
    DmNotifications,
    FollowUpdates,
    Welcome,
    Bye,
    Reviews
};

export type ModelsMap = typeof models;
export default models;