import EventEmitter from 'events'
import Docker, { Container } from 'dockerode'
import Discord from 'discord.js';

export interface container extends Docker.ContainerInfo {
  name: string
  container: Docker.Container
  channel: Discord.Channel
}

export class container implements container {

}

export default container
