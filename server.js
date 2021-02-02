'use strict'
require('dotenv').config()

const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const DISCORD_SERVERID = process.env.DISCORD_SERVERID
const DISCORD_BOTNAME = process.env.DISCORD_BOTNAME
const DiscordServer = require('./discordServer.js')
const discordServer = new DiscordServer(DISCORD_TOKEN, DISCORD_SERVERID, DISCORD_BOTNAME)

const dockerConnectObject = {socketPath: '/var/run/docker-host.sock'}
const DockerServer = require('./dockerServer.js')
const dockerServer = new DockerServer(dockerConnectObject)

discordServer.on("ready", () => {
	dockerServer.getContainers()
	.then( (containers) => { 
		containers.slice(3,6).forEach( (containerInfo) => {
			let containerName = containerInfo.Names[0].substring(1)
			console.log(`Container name: '${containerName}' id: '${containerInfo.Id}' image: '${containerInfo.Image}'`);
			discordServer.createChannel(containerName)
		})
	})				
	.catch(console.error)
});
// dockerServer.docker.info()
// 	.then( (info) => console.log(info) )
// 	.catch(console.error)

