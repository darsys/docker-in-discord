'use strict';

require('dotenv').config()

const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const DISCORD_SERVERID = process.env.DISCORD_SERVERID

const Discord = require('discord.js');
const client = new Discord.Client();

let dcserver 

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	dcserver = client.guilds.resolve(DISCORD_SERVERID)
	console.log(dcserver.name)
  });
  
client.on('message', msg => {
	dcserver.channels.create(msg.content)
});

client.login(DISCORD_TOKEN);
