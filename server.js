'use strict';

require('dotenv').config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_SERVERID = process.env.DISCORD_SERVERID;

const Discord = require('discord.js');
const client = new Discord.Client();

let dcserver;

client.on('ready', () => {
	dcserver = client.guilds.resolve(DISCORD_SERVERID);
	console.log(`Logged in as ${client.user.tag}! to server ${dcserver.name}!`);
  });
  
client.on('message', msg => {
	dcserver.channels.create(msg.content);
});

client.login(DISCORD_TOKEN);
