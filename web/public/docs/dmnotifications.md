`NotificationBot` can send notifications directly to your DMs. This functionality enables the bot to automatically send news, video uploads, twitch streams, and community updates through the help of RSS.
<br />
<br />

![DM notification example](//notificationbot.png?fullwidth=true)

<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" height="513" frameborder="0" allow="autoplay">
</iframe>

## Setup
1. Add NotificationBot to your server by going to [notificationbot.xyz/add](https://notificationbot.xyz/add).
2. Head to the dashboard by going to [notificationbot.xyz/dashboard](https://notificationbot.xyz/dashboard).
3. Select the **DM notification tab**.
4. Enter your desired customization and click save

### ✏️ Custom embed
You can pick **whatever color** you want for you embed, making it easier to reconize where your notification is coming from!

### 🖼️ Source
<mark>
    Provide a direct link to where you want your notification is coming from. Something like: https://www.youtube.com/feeds/videos.xml?channel_id=UCX6OQ3DkcsbYNE6H8uQQuVA`
</mark>
<br />

## Message
You can have a custom message for your notifications. For example: **New upload from MrBeast <@920487197046607872> <td><t:1715878720:R></td>**.

<table>
    <thead>
        <tr>
            <th width="181">Placeholder</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>user.mention</code></td>
            <td><@920487197046607872></td>
            <td>User mention</td>
        </tr>
        <tr>
            <td><code>user.id</code></td>
            <td>920487197046607872</td>
            <td>User id</td>
        </tr>
        <tr>
            <td><code>user.tag</code></td>
            <td>@glitchdetected</td>
            <td>User tag</td>
        </tr>
        <tr>
            <td><code>user.name</code></td>
            <td>GlitchDetected</td>
            <td>Username</td>
        </tr>
        <tr>
            <td><code>user.avatar</code></td>
            <td>https://cdn.discordapp.com/...</td>
            <td>Avatar URL</td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
        <tr>
            <th width="181">Placeholder</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>guild.name</code></td>
            <td>randomdevelopment</td>
            <td>Server name</td>
        </tr>
        <tr>
            <td><code>guild.id</code></td>
            <td>1332096827872514058</td>
            <td>Server id</td>
        </tr>
        <tr>
            <td><code>guild.avatar</code></td>
            <td>https://cdn.discordapp.com/...</td>
            <td>Icon URL</td>
        </tr>
        <tr>
            <td><code>guild.rules</code></td>
            <td><#1334692086926147628></td>
            <td>Announcements</td>
        </tr>
        <tr>
            <td><code>guild.memberCount</code></td>
            <td>10</td>
            <td>Member count</td>
        </tr>
    </tbody>
</table>

# Voiceover
<audio controls src="/en_us_001.mp3">