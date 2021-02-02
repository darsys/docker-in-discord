
const Discord = require('discord.js');
const { EventEmitter } = require("events");

class discordServer extends EventEmitter {

    constructor(token, serverid, botname) {
        super()
        this.token = token
        this.serverid = serverid
        this.botname = botname
        this.client = new Discord.Client();
        this.client.on('ready', async () => {
            this.server = this.client.guilds.resolve(this.serverid);
            console.log(`Logged in as ${this.client.user.tag}! to server ${this.server.name}!`);
            this.cleanDiscord()
            this.catChannel = await this.server.channels.create(this.botname, { type: 'category' })
            this.emit('ready')
        })
        this.client.login(this.token);
    }

    

    initialize = () => {
    }

    findChannelbyName(channelName) {
        return this.server.channels.cache.find( n => n.name === channelName)
    }
    
    findChannelsbyParentName(parentName) {
        let parent = this.findChannelbyName(parentName)
        if (parent) {
            return this.server.channels.cache.find( n => n.parent === parent.Id)
        } else {
            return undefined
        }
    }
    
    cleanDiscord() {
        // check if the parent category exists
        // if it exists attempt to find subordinate channels and remove
        
        this.server.channels.cache.forEach( (c) => {
            console.log(`channel ${c.name} reason: ${c.reason}`)
                if(c.reason === this.botname || c.topic === 'docker chat') {
                    this.removeChannel(c, 'cleaning up at startup.. ')
                }
            });
        let oldCatChannel = this.findChannelbyName(this.botname)
        if (oldCatChannel) this.removeChannel(oldCatChannel, 'cleaning up at startup.. ')
    }

    createChannel(channelName) {
        let options = {
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

    removeChannel( channel, reason = 'No Good Reason!') {
        channel.delete(reason)
            .then( (chan) => { console.debug(`${chan.name} removed for ${reason}`); })
            .catch(console.error)
    }

}

module.exports = discordServer