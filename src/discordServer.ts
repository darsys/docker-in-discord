import { DiscordAPIError } from "discord.js";

import Discord from 'discord.js';
let { EventEmitter } = require("events");

class discordServer extends EventEmitter {

    token: string
    serverid: string
    botname: string
    client: Discord.Client
    server: Discord.Guild
    catChannel: Discord.Channel

    constructor(token: string, serverid: string, botname: string) {
        super()
        this.token = token
        this.serverid = serverid
        this.botname = botname
        this.client = new Discord.Client();
        this.client.on('ready', async () => {
            let svr = this.client.guilds.resolve(this.serverid)
            if (svr !== null) {
                this.server = svr
                console.log(`Discord bot Logged in to server ${this.server.name}!`)
                this.cleanDiscord()
                let cat = await this.server.channels.create(this.botname, { type: 'category' })
                if (cat !== undefined)
                    this.catChannel = cat
                    this.emit('ready')
            }
        })
        this.client.login(this.token);
    }

    initialize = () => {
    }

    findChannelbyName(channelName: string) {
        return this.server.channels.cache.find( n => n.name === channelName)
    }
    
    cleanDiscord() {
        // check if the parent category exists
        // if it exists attempt to find subordinate channels and remove
        
        this.server.channels.cache.filter((channel) => { return channel.type === 'text'}).forEach( (c) => {
            console.log(c)
            if(c.isText()) {
                if(c.topic === 'docker chat') {
                    this.removeChannel(c, 'cleaning up at startup.. ')
                }
            }
        })
        let oldCatChannel = this.findChannelbyName(this.botname)
        if (oldCatChannel) this.removeChannel(oldCatChannel, 'cleaning up at startup.. ')
    }

    createChannel(channelName: string) : Promise<Discord.TextChannel | Discord.CategoryChannel | Discord.VoiceChannel> {
        let options : Discord.GuildCreateChannelOptions = {
            type: 'text',
            parent: this.catChannel.id,
            reason: this.botname,
            topic: 'docker chat'
        }
        let oldChannel = this.findChannelbyName(channelName) 
        if (oldChannel) {
            console.log(`Channel ${channelName} already exists`);
            this.removeChannel(oldChannel)
        } 
        console.debug(`${channelName} ${JSON.stringify(options)}`)
        return this.server.channels.create(channelName, options)
    }

    removeChannel( channel: Discord.GuildChannel, reason : string = 'No Good Reason!') {
        channel.delete(reason)
            .then( (chan) => { if(chan.isText()) console.debug(`${chan.id} removed for ${reason}`) } )
            .catch(console.error)
    }

}

export default discordServer