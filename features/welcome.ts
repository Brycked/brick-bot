import { Client, TextChannel } from "discord.js"
import welcomeSchema from "../models/welcome-schema"

const welcomeData = {} as {
    // guildID: [channel, message]
    [key: string]: [TextChannel, string]
}

export default (client: Client) => {
    client.on('guildMemberAdd', async (member) => {
        const { guild, id } = member
        let data = welcomeData[guild.id]

        if (!data) {
            const results = await welcomeSchema.findById(guild.id)
            if (!results) {
                return
            }

            const { channelId, text} = results
            const channel = guild.channels.cache.get(channelId) as TextChannel
            data = welcomeData[guild.id] = [channel, text]
        }

        data[0].send({
            content: data[1].replace(/@/g, member.toString()).replace(/#&/g, guild.toString()),
            allowedMentions: {users: []}
        })
    })
}

export const config = {
    displayName: 'Welcome Channel',
    dbName: 'WELCOME_CHANNEL'
}