import { Message, MessageEmbed } from "discord.js";
import { Command } from '../command'

let command: Command = new Command(ping, new MessageEmbed({color: 0xdddddd, description: 'Responds with ping latency info.'}));

module.exports = {
    name: "ping",
    command: command
}

function ping(msg: Message, args: string) : void {
    msg.channel.send(`Latency is ${msg.createdTimestamp - msg.createdTimestamp}ms!\nAPI Latency is ${Math.round(msg.client.ws.ping)}ms.`);
}