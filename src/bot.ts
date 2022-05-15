import * as de from 'dotenv';
de.config();

import { Client, Intents, MessageEmbed } from 'discord.js';
import * as fs from 'fs';

const client: Client = new Client(
    {
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MEMBERS]
    }
);

client.on('ready', function (e) {
    console.log(`HavveBot connected!`);
});

client.login(process.env.HAVVEBOT_TOKEN);

// Keep bot online.
import { createServer, IncomingMessage, ServerResponse } from 'http';
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200);
    res.end('ok');
});
server.listen(3000);

// Fill a commands object with commands accessible
// by key via their command name/prefix.
import { Command } from './command';

let commands: Map<string, Command | undefined> = new Map<string, Command>();

// Populate commands map.
const files: string[] = fs.readdirSync('./commands');
const jsFiles: string[] = files.filter(file => file.endsWith('.js'));
jsFiles.forEach(commandFile => {
    // const commandModule: any = require(`./commands/${commandFile}`);
    const commandModule = require(`./commands/${commandFile}`);
    if (commandModule.name !== undefined && commandModule.command !== undefined)
        commands.set(commandModule.name, commandModule.command);
});

// React to messages.
client.on('messageCreate',
    function (msg) {
        const prefixedCommand: string = msg.content.split(' ')[0];
        const commandName: string = prefixedCommand.split('h/')[1];

        let args: string = msg.content.split(/ (.*)/s)[1];
        args = (args === undefined) ? "" : args;

        if ((prefixedCommand) === 'h/help') {
            // No argument - main help.
            if (!args) {
                let helpEmbed: MessageEmbed = new MessageEmbed({
                    color: 0xdddddd,
                    title: 'HavveBot - A TWRP-themed moderation bot for the Ladyworld Discord server.',
                    description: 'Use h/help [command] for more detailed help.',
                    fields: [{ name: 'Commands', value: '`' + Array.from(commands.keys()).join('`\n`') + '`', inline: false}]
                });

                msg.channel.send({embeds: [helpEmbed]});
            }
            else {
                const command: Command | undefined = commands.get(args);
                if (command !== undefined)
                    msg.channel.send({ embeds: [command.help] });
            }

            return;
        }

        const command: Command | undefined = commands.get(commandName);

        // Filter out invalid commands and bot senders.
        if (command === undefined || msg.author.bot)
            return;
        else
            command.fn(msg, args);
    });