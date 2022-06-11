import {GuildMember, Message, MessageEmbed, Permissions} from "discord.js";
import { Command } from '../command'

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
            name: '**Example**',
            value: '```bash\n'
            + 'h/ban @DoctorSung\n'
            + '```'
        }
    ]
}));

module.exports = {
    name: "ban",
    command: command
}

function ban(msg: Message, args: string) : void {
    if (!msg.member || !msg.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        msg.channel.send({embeds: [{
            color: 0xdddddd,
            title: 'Action Failed.',
            description: '❌ You don\'t have the right permission to do that.'
        }]});
        return;
    }

    if (msg.mentions.members) {
        let member : GuildMember | undefined = msg.mentions.members.first();
        if (!member) {
            msg.channel.send({embeds: [{
                color: 0xdddddd,
                title: 'Action Failed.',
                description: '❌ Invalid server member.'
            }]});
            return;
        }
        if (!member.bannable) {
            msg.channel.send({embeds: [{
                color: 0xdddddd,
                title: 'Action Failed.',
                description: '❌ You can\'t ban that member.'
            }]});
            return;
        }

        member.ban();

        let numSpaces: number = (msg.content.match(/ /g) || []).length;
        if (numSpaces === msg.mentions.members.size) {
            msg.channel.send({embeds: [{
                color: 0xdddddd,
                title: `Banned ${member.displayName}.`,
            }]});
        }
        else {
            msg.channel.send({embeds: [{
                color: 0xdddddd,
                title: `Banned ${member.displayName}.`,
                description: `Reason: ${msg.content.split(' ').slice(msg.mentions.members.size + 1).join(' ')}`
            }]});
        }
    }
    else {
        msg.channel.send({embeds: [{
            color: 0xdddddd,
            title: 'Action Failed.',
            description: '❌ You must mention a member to ban.'
        }]});
        return;
    }
}