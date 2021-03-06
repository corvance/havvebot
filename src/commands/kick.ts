import { GuildMember, Message, MessageEmbed, Permissions } from "discord.js";
import { Command } from '../command'
import { BOT_COLOR, getCurrentDateString, getCurrentTimeString } from "../utils";

let command: Command = new Command(kick, new MessageEmbed({
    color: BOT_COLOR,
    title: 'Kick',
    description: 'Kicks a user.',
    fields: [
        {
            name: '`user`',
            value: 'A mention of the user to kick.'
        },
        {
            name: '`reason`',
            value: 'A text string reason for the kick.'
        },
        {
            name: '**Examples**',
            value: '```bash\n'
                + 'h/kick @DoctorSung\n'
                + 'h/kick @Lazerhorse get back to the basement!\n'
                + '```'
        }
    ]
}));

module.exports = {
    name: "kick",
    command: command
}

function kick(msg: Message, args: string): void {
    if (!msg.member || !msg.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        msg.channel.send({
            embeds: [{
                color: BOT_COLOR,
                title: 'Action Failed.',
                description: '❌ You don\'t have the right permission to do that.'
            }]
        });
        return;
    }

    if (msg.mentions.members) {
        let member: GuildMember | undefined = msg.mentions.members.first();
        if (!member) {
            msg.channel.send({
                embeds: [{
                    color: BOT_COLOR,
                    title: 'Action Failed.',
                    description: '❌ Invalid server member.'
                }]
            });
            return;
        }
        if (!member.kickable) {
            msg.channel.send({
                embeds: [{
                    color: BOT_COLOR,
                    title: 'Action Failed.',
                    description: '❌ You can\'t kick that member.'
                }]
            });
            return;
        }

        let numSpaces: number = (msg.content.match(/ /g) || []).length;
        let reason: string = 'None';
        if (numSpaces === msg.mentions.members.size) {
            msg.channel.send({
                embeds: [{
                    color: BOT_COLOR,
                    title: `Kicked ${member.displayName}.`,
                }]
            });
        }
        else {
            reason = msg.content.split(' ').slice(msg.mentions.members.size + 1).join(' ');
            msg.channel.send({
                embeds: [{
                    color: BOT_COLOR,
                    title: `Kicked ${member.displayName}.`,
                    description: `Reason: ${reason}`
                }]
            });
        }

        member.kick(reason);

        if (msg.guild) {
            let logChannel = msg.guild.channels.cache.find(channel => channel.name === 'ban-kick-log');

            if (logChannel) {
                if (logChannel.isText()) {
                    logChannel.send({
                        embeds: [{
                            color: BOT_COLOR,
                            title: 'Banned User.',
                            description: `**Username:** ${member.displayName}#${msg.author.discriminator}\n`
                                + `**ID:** ${member.id}\n`
                                + `**Reason:** ${reason}\n`
                                + `**Date:** ${getCurrentDateString()}\n`
                                + `**Time:** ${getCurrentTimeString()}\n`,
                            thumbnail: { url: member.displayAvatarURL() }
                        }]
                    });
                }
            }
        }
    }
    else {
        msg.channel.send({
            embeds: [{
                color: BOT_COLOR,
                title: 'Action Failed.',
                description: '❌ You must mention a member to kick.'
            }]
        });
        return;
    }
}