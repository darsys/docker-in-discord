/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';
require('dotenv').config()
const express = require('express');
const { Webhook, MessageBuilder } = require('discord-webhook-node')
const { json } = require('body-parser')

const WEBHOOK_URL = process.env.WEBHOOK_URL
const hook = new Webhook(WEBHOOK_URL)

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


// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.json())

app.post('/', (req, res) => {
	console.log(req.body)
	req.body.alerts.forEach(thisalert => {
		const myTitle = `**${thisalert.status}** ${thisalert.labels.severity} alert ${thisalert.labels.alertname}`
		const embed = new MessageBuilder()
		.setTimestamp(thisalert.startsAt)
		.setTitle(myTitle)
		// .addField('instance', thisalert.labels.instance, true)
		// .addField('job', thisalert.labels.job, true)
		if (thisalert.hasOwnProperty('labels')) {
				Object.keys(thisalert.labels).forEach (thiskey => {
				console.log(thiskey, thisalert.labels[thiskey])
				embed.addField(thiskey, thisalert.labels[thiskey], true)
			})
		}
		if (thisalert.hasOwnProperty('annotations')) {
			const myText = ''
			Object.keys(thisalert.annotations).forEach(thiskey => {
				console.log(thiskey, thisalert.annotations[thiskey])
				myText.concat(thiskey + ': ' + thisalert.labels[thiskey] +'\n')
			})
			console.log(myText)
			embed.setText(myText)
		}
		console.log(embed)
		sendToDiscord(embed, res)
	})
});

const sendToDiscord = async (theMessage, res) => {
	try {
		console.log('sending:', theMessage)
		await hook.send(theMessage)
		console.log('Successfully sent webhook!')
		res.status(200).end()
	}
	catch(e){
		console.log(e.message);
	};
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);