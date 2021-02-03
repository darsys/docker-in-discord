require('dotenv').config()

const DISCORD_TOKEN = process.env.DISCORD_TOKEN || ''
const DISCORD_SERVERID = process.env.DISCORD_SERVERID || ''
const DISCORD_BOTNAME = process.env.DISCORD_BOTNAME || 'dockerNdiscord'
import DiscordServer from './discordServer'
const discordSvr = new DiscordServer(DISCORD_TOKEN, DISCORD_SERVERID, DISCORD_BOTNAME)

const dockerConnectObject = {socketPath: '/var/run/docker-host.sock'}
import DockerSvr from './dockerServer'
const dockerSvr = new DockerSvr(dockerConnectObject)

discordSvr.on("ready", () => {
	dockerSvr.getContainers()
	.then( (containers: any[]) => { 
		containers.slice(3,6).forEach( (containerInfo: any): any => {
			let containerName = containerInfo.Names[0].substring(1)
			console.log(`Container name: '${containerName}' id: '${containerInfo.Id}' image: '${containerInfo.Image}'`);
			discordSvr.createChannel(containerName)
		})
	})				
	.catch(console.error)
});
