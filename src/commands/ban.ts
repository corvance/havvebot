import { GuildMember, Message, MessageEmbed, Permissions } from "discord.js";
import { Command } from '../command'
import { getCurrentDateString, getCurrentTimeString } from "../utils";

let command: Command = new Command(ban, new MessageEmbed({
    color: 0xdddddd,
    title: 'Ban',
    description: 'Bans a user.',
    fields: [
        {
            name: '`user`',
            value: 'A mention of the user to ban.'
        },
        {
            name: '`reason`',
            value: 'A text string reason for the ban.'
        },
        {
            name: '**Examples**',
            value: '```bash\n'
                + 'h/ban @DoctorSung\n'
                + 'h/ban @CommanderMeouch stop pinging all the ladies\n'

                + '```'
        }
    ]
}));

module.exports = {
    name: "ban",
    command: command
}

function ban(msg: Message, args: string): void {
    if (!msg.member || !msg.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        msg.channel.send({
            embeds: [{
                color: 0xdddddd,
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
                    color: 0xdddddd,
                    title: 'Action Failed.',
                    description: '❌ Invalid server member.'
                }]
            });
            return;
        }
        if (!member.bannable) {
            msg.channel.send({
                embeds: [{
                    color: 0xdddddd,
                    title: 'Action Failed.',
                    description: '❌ You can\'t ban that member.'
                }]
            });
            return;
        }

        let numSpaces: number = (msg.content.match(/ /g) || []).length;
        let reason: string = 'None';
        if (numSpaces === msg.mentions.members.size) {
            msg.channel.send({
                embeds: [{
                    color: 0xdddddd,
                    title: `Banned ${member.displayName}.`,
                }]
            });
        }
        else {
            reason = msg.content.split(' ').slice(msg.mentions.members.size + 1).join(' ');
            msg.channel.send({
                embeds: [{
                    color: 0xdddddd,
                    title: `Banned ${member.displayName}.`,
                    description: `Reason: ${reason}`
                }]
            });
        }

        member.ban({reason: reason});

        if (msg.guild) {
            let logChannel = msg.guild.channels.cache.find(channel => channel.name === 'ban-kick-log');

            if (logChannel) {
                if (logChannel.isText()) {
                    logChannel.send({
                        embeds: [{
                            color: 0xdddddd,
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
                color: 0xdddddd,
                title: 'Action Failed.',
                description: '❌ You must mention a member to ban.'
            }]
        });
        return;
    }
}