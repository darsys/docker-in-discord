require('dotenv').config()

import container from './container'
import DockerServer from './dockerServer'
import DiscordServer from './discordServer'

const dockerConnectObject = {socketPath: '/var/run/docker-host.sock'}
const dockerSvr = new DockerServer(dockerConnectObject)

const DISCORD_TOKEN = process.env.DISCORD_TOKEN || ''
const DISCORD_SERVERID = process.env.DISCORD_SERVERID || ''
const DISCORD_BOTNAME = process.env.DISCORD_BOTNAME || 'dockerNdiscord'
const discordSvr = new DiscordServer(DISCORD_TOKEN, DISCORD_SERVERID, DISCORD_BOTNAME)

discordSvr.on("ready", () => {
	console.log(`discord server ready`)
	let cont = dockerSvr.getContainers()
	cont.forEach( (container: container): any => {
		console.log(`Channel creation for container name: '${container.name}' id: '${container.Id}' image: '${container.Image}'`);
		discordSvr.createContainerChannel(container)
	})
});

// function hookupEvents(channel) {
// 	this.docker.getEvents({filters: {'container': ['cadvisor']}}, function (err, data) {
// 		if(err){
// 			console.log(err.message);
// 		} else {
// 			data.on('data', function (chunk) {
// 				console.log(JSON.parse(chunk.toString('utf8')))
// 			})
// 		} 
// 	})
// }