"use client";

import { type User, userStore } from "@/common/userStore";
import TextInput from "@/components/input/textinput";
import { deepMerge } from "@/utils/merge";
import ImageUrlInput from "@/components/input/imageurlinput";

export default function Home() {

      const user = userStore((s) => s);

    if (user?.id && !user.extended) return <></>;

  return (<>
    <div className="lg:flex gap-3">
        <div className="lg:w-1/2">
          <TextInput
                         name="Embed Color"
                        url="/dashboard/dmnotifications"
                        dataName="embedcolor"
                        description="Color of your notification embed"
                        type="color"
                        defaultState={user?.extended?.dmnotifications?.embedcolor ?? 0}
                        onSave={(value) => {
                            userStore.setState(deepMerge<User>(user, 
                              { extended: { dmnotifications: { 
                                embedcolor: Number(value), 
                              } } }));
                        }}
          />
          </div>
                <div className="w-1/2">
                    <TextInput
                        name="Source"
                        url="/dashboard/dmnotifications"
                        dataName="source"
                        description="Where your notification is coming from"
                        type="text"
                        defaultState={user?.extended?.dmnotifications?.source ?? "https://example.com/videos.rss"}
                        onSave={(value) => {
                            userStore.setState(deepMerge<User>(user, 
                              { extended: { dmnotifications: { 
                                source: String(value) 
                              } } }));
                        }}
                    />
                </div>
          </div>
          <div className="w-1/2">
          <TextInput
                        name="Message"
                        url="/dashboard/dmnotifications"
                        dataName="message"
                        description="Custom message (optional)"
                        type="text"
                        defaultState={user?.extended?.dmnotifications?.message ?? "You got a new notifications from"}
                        onSave={(value) => {
                             userStore.setState(deepMerge<User>(user, 
                              { extended: { dmnotifications: { 
                                message: String(value), 
                              } } }));
                        }}
          />
        </div>

                    <ImageUrlInput
            name="Thumbnail"
            url="/dashboard/dmnotifications"
            ratio="aspect-[4/1]"
            dataName="thumbnail"
            description="Enter the url for your thumbnail. The recomended image ration is 4:1 and recommended resolution 1024x256px."
            defaultState={user?.extended?.dmnotifications?.thumbnail || ""}
            onSave={(value) => {
              userStore.setState(deepMerge<User>(user, 
                              { extended: { dmnotifications: { 
                                thumbnail: value,
                              } } }));
                        }}
          />
  </>);
}
