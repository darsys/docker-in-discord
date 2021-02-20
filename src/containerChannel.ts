import container from './container'
import Discord from 'discord.js';

export interface containerChannel extends container {
    channel: Discord.Channel
  }
  
export default container
  