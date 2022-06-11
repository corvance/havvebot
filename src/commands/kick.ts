import { GuildMember, Message, MessageEmbed, Permissions} from "discord.js";
import { Command } from '../command'

let command: Command = new Command(kick, new MessageEmbed({
    color: 0xdddddd,
    title: 'Kick',
    description: 'Kicks a user.',
    fields: [
        {
            name: '`user`',
            value: 'A mention of the user to kick.'
        },
        {
            name: '**Example**',
            value: '```bash\n'
            + 'h/kick @DoctorSung\n'
            + '```'
        }
    ]
}));

module.exports = {
    name: "kick",
    command: command
}

function kick(msg: Message, args: string) : void {
    if (!msg.member || !msg.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
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
        if (!member.kickable) {
            msg.channel.send({embeds: [{
                color: 0xdddddd,
                title: 'Action Failed.',
                description: '❌ You can\'t kick that member.'
            }]});
            return;
        }

        member.kick();
    }
    else {
        msg.channel.send({embeds: [{
            color: 0xdddddd,
            title: 'Action Failed.',
            description: '❌ You must mention a member to kick.'
        }]});
        return;
    }
}