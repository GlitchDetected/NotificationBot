"use client";

import { HiBookOpen } from "react-icons/hi";

import { OverviewLink } from "@/components/overview-link";
import { Section } from "@/components/section";

import { type Guild, guildStore } from "@/common/guildStore";
import FollowUpdates from "./updates.component";
import TextInput from "@/components/input/textinput";
import { deepMerge } from "@/utils/merge";
import { useParams } from "next/navigation";

export default function Home() {
  const guild = guildStore((g) => g);
  const params = useParams();

  return (<>
        <OverviewLink
            title="Documentation"
            message="Refer to the documentation any time!"
            url={`/docs/home`}
            icon={<HiBookOpen />}
        />

        <FollowUpdates />

        <Section
        title="Miscellaneous"
        >
        Random configs that don't fit in the other tabs
        </Section>

          <TextInput
                         name="Bot Prefix"
                        url={`/guilds/${params.guildId}`}
                        dataName="botPrefix"
                        description="Custom prefix (3)"
                        type="text"
                        defaultState={guild?.botPrefix ?? ";"}
                        onSave={(value) => {
                            guildStore.setState(deepMerge<Guild>(guild, { 
                              botPrefix: String(value),
                             })
    );
  }}
/>
  </>);
}
