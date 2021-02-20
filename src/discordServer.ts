let { EventEmitter } = require("events");

import Discord from 'discord.js';
import container from './container';

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
        
        this.server.channels.cache.filter((channel) => { return channel.type === 'text'}).forEach( async (c) => {
            console.log(c)
            if(c.isText()) {
                if(c.topic === 'docker chat') {
                    await c.delete('cleaning up at startup.. ')
                }
            }
        })
        let oldCatChannel = this.findChannelbyName(this.botname)
        if (oldCatChannel) this.removeChannelAsync(oldCatChannel, 'cleaning up at startup.. ')
    }

    async createContainerChannel(container: container) {
        let newChannel = await this.createChannel(container.name)
        if (newChannel !== undefined)
            container.channel = newChannel
    }

   async createChannel(channelName: string) : Promise<Discord.GuildChannel> {
        let options : Discord.GuildCreateChannelOptions = {
            type: 'text',
            parent: this.catChannel.id,
            reason: this.botname,
            topic: 'docker chat'
        }
        let newChannel = this.findChannelbyName(channelName)
        if (newChannel !== undefined) {
            console.log(`Channel ${channelName} already exists`);
            return Promise.resolve(newChannel)
        } else {
            let newChannel = await this.server.channels.create(channelName, options)
            return Promise.resolve(newChannel)
        }
    }

    removeChannel( channel: Discord.GuildChannel, reason : string = 'No Good Reason!') {
        channel.delete(reason)
            .then( (chan) => { if(chan.isText()) console.debug(`${chan.id} removed for ${reason}`) } )
            .catch(console.error)
    }

    async removeChannelAsync( channel: Discord.GuildChannel, reason : string = 'No Good Reason!') {
        await channel.delete(reason)
    }


}

export default discordServer