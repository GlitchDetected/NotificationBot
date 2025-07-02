// "use client";

// import { Accordion, AccordionItem } from "@heroui/react";
// import { Loader2 } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { HiUserAdd } from "react-icons/hi";

// const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

// interface feedNotificationEntry {
//     guildId: string;
//     rssChannelId: string;
//     rssLink: string;
//     rssPingRoleId: string;
// }

// interface Channel {
//     id: string;
//     name: string;
// }

// interface Role {
//     id: string;
//     name: string;
// }

// export default function Home() {
//     const params = useParams();

//     const guildId = Array.isArray(params.guildId) ? params.guildId[0] : params.guildId;
//     const [loading, setLoading] = useState(true);

//     const [feedCount, setFeedCount] = useState<feedNotificationEntry[]>([]);

//     const [channels, setChannels] = useState<Channel[]>([]);

//     const [roles, setRoles] = useState<Role[]>([]);

//     const url = `/guilds/${params.guildId}/feednotifications` as const;

//     useEffect(() => {
//         if (!guildId) return;

//         (async () => {
//             setLoading(true);
//             try {
//                 const res = await fetch(`${NEXT_PUBLIC_API}/dashboard/feednotifications?guildId=${guildId}`, {
//                     credentials: "include"
//                 });
//                 if (res.ok) {
//                     const data = await res.json();
//                     const configData = data.config ?? {};
//                     setFeedCount(configData);

//                     const feedKeys = Object.keys(configData).filter((key) => key.startsWith("feed"));
//                 } else if (res.status === 404) {
//                     setFeedCount([]);
//                 }

//                 // Fetch guild data from localhost:3001/dashboard/@me/guilds/
//                 const guildsRes = await fetch(`${NEXT_PUBLIC_API}/dashboard/@me/guilds/`, { credentials: "include" });
//                 if (guildsRes.ok) {
//                     const guildsData = await guildsRes.json();
//                     // Find the guild that matches the guildId and set channels/roles
//                     const guild = guildsData.find((g: any) => g.id === guildId);

//                     if (guild && guild.channels) {
//                         setChannels(guild.channels);
//                     }

//                     if (guild && guild.roles) {
//                         setRoles(guild.roles);
//                     }
//                 } else {
//                     console.error("Error fetching guilds, channels, or roles");
//                 }
//             } catch (error) {
//                 console.error("Error fetching feed notification configuration:", error);
//             }
//             setLoading(false);
//         })();
//     }, [guildId]);

//     if (!guildId) {
//         return <div>Missing Guild ID! Login to view this!</div>;
//     }

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-40">
//                 <Loader2 className="w-12 h-12 animate-spin" />
//             </div>
//         );
//     }

//     const addFeed = () => {
//         if (feedCount.length >= 8) {
//             alert("You can only add up to 8 feeds.");
//             return;
//         }

//         setFeedCount([
//             ...feedCount,
//             {
//                 guildId,
//                 rssChannelId: "",
//                 rssLink: "",
//                 rssPingRoleId: ""
//             }
//         ]);
//     };

//     const updateFeed = (index: number, field: keyof (typeof feedCount)[0], value: string) => {
//         const updatedFeeds = [...feedCount];
//         updatedFeeds[index][field] = value;
//         setFeedCount(updatedFeeds);
//     };

//     const saveconfig = async () => {
//     type FeedConfig = Record<`feed ${number}`, feedNotificationEntry>;

//     const feedPayload: FeedConfig = {};

//     feedCount.forEach((feed, index) => {
//         feedPayload[`feed ${index + 1}`] = {
//             guildId,
//             rssChannelId: feed.rssChannelId,
//             rssLink: feed.rssLink,
//             rssPingRoleId: feed.rssPingRoleId
//         };
//     });

//     try {
//         const res = await fetch(`${NEXT_PUBLIC_API}/dashboard/feednotifications`, {
//             method: "POST",
//             credentials: "include",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(feedPayload)
//         });

//         if (res.ok) {
//             const data = await res.json();
//             setFeedCount(data.config);
//         } else {
//             alert("Error saving configuration.");
//         }
//     } catch (error) {
//         console.error("Error saving configuration:", error);
//         alert("Error saving configuration.");
//     }
//     };

//     const data = [
//         {
//             startContent: <HiUserAdd />,
//             title: "Rss Feed System",
//             subtitle: "Configure RSS feeds for your server",
//             content: (
//                 <div>
//                     {feedCount.map((feed, index) => (
//                         <div className="space-y-4 bg-emerald-800">
//                             <label className="text-sm font-semibold text-white">feed #{index + 1}</label>
//                             <div className="flex flex-col space-y-2">
//                                 <label className="text-sm font-semibold text-white">RSS Channel</label>
//                                 <select
//                                     value={feed.rssChannelId}
//                                     onChange={(e) => updateFeed(index, "rssChannelId", e.target.value)}
//                                     className="p-2 rounded bg-[#222] text-white border border-gray-600"
//                                 >
//                                     <option value="">Select a channel</option>
//                                     {channels.map((channel) => (
//                                         <option key={channel.id} value={channel.id}>
//                                             #{channel.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="flex flex-col space-y-2">
//                                 <label className="text-sm font-semibold text-white">RSS Link</label>
//                                 <input
//                                     type="text"
//                                     value={feed.rssLink}
//                                     onChange={(e) => updateFeed(index, "rssLink", e.target.value)}
//                                     placeholder="https://example.com/feed" // https://www.youtube.com/feeds/videos.xml?channel_id=
//                                     className="p-2 rounded bg-[#222] text-white border border-gray-600"
//                                 />
//                             </div>

//                             <div className="flex flex-col space-y-2">
//                                 <label className="text-sm font-semibold text-white">Ping Role</label>
//                                 <select
//                                     value={feed.rssPingRoleId}
//                                     onChange={(e) => updateFeed(index, "rssPingRoleId", e.target.value)}
//                                     className="p-2 rounded bg-[#222] text-white border border-gray-600"
//                                 >
//                                     <option value="">No role</option>
//                                     {roles.map((role) => (
//                                         <option key={role.id} value={role.id}>
//                                             @{role.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>
//                     ))}
//                     <button
//                         onClick={saveconfig}
//                         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                     >
//                         Save Changes
//                     </button>

//                     <button
//                         onClick={addFeed}
//                         disabled={feedCount.length >= 8}
//                         className={`mt-2 px-4 py-2 rounded transition ${
//                             feedCount.length >= 8 ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
//                         }`}
//                     >
//                         Add Feed ({feedCount.length}/8)
//                     </button>
//                 </div>
//             )
//         }
//     ];

//     return (
//         <div className="my-4 w-full" itemType="https://schema.org/FAQPage" itemScope>
//             <h2 className="text-2xl font-semibold mb-4">Feed Notifications</h2>
//             <h2 className="text-2 mb-4 text-gray-400">RSS and content feed updates</h2>

//             <Accordion className="rounded-lg overflow-hidden" variant="splitted" defaultExpandedKeys={["0"]}>
//                 {data.map((item, index) => (
//                     <AccordionItem
//                         aria-label={item.title}
//                         className="bg-[#151515]"
//                         classNames={{ content: "mb-2 space-y-4" }}
//                         key={index}
//                         startContent={item.startContent}
//                         subtitle={item.subtitle}
//                         title={<span itemProp="name">{item.title}</span>}
//                         itemType="https://schema.org/Question"
//                         itemProp="mainEntity"
//                         itemScope
//                     >
//                         <span itemType="https://schema.org/Answer" itemProp="acceptedAnswer" itemScope>
//                             {item.content}
//                         </span>
//                     </AccordionItem>
//                 ))}
//             </Accordion>
//         </div>
//     );
// }