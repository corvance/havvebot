import { GuildMember, Message, MessageEmbed, Permissions} from "discord.js";
import { Command } from '../command'
import { getNumFromParam, convertTimeTextToSeconds, setTimeoutSeconds, unknownError } from '../utils';

let command: Command = new Command(mute, new MessageEmbed({
    color: 0xdddddd,
    title: 'mute',
    description: 'Mutes a user indefinitely or for a specified amount of time.',
    fields: [
        {
            name: '`user`',
            value: 'A mention of the user to kick.'
        },
        {
            name: '`duration`',
            value: 'An optional duration.'
        },
        {
            name: '**Examples**',
            value: '```bash\n'
            + 'h/mute @DoctorSung\n'
            + 'h/mute @CommanderMeouch 1h\n'
            + 'h/mute @LordPhobos 2d\n'
            + 'h/mute @MerchlordDylan 3.5m\n'
            + 'h/mute @Joe 7d\n'
            + '```'
        }
    ]
}));

module.exports = {
    name: "mute",
    command: command
}

function mute(msg: Message, args: string) : void {
    if (!msg.member || !msg.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) {
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
                description: '❌ You can\'t mute that member.'
            }]});
            return;
        }

        let guild = msg.guild;

        if (guild) {
            let mutedRole = guild.roles.cache.find(role => role.name === 'Muted');

            if (mutedRole) {
                // Determine mute duration.
                let numSpaces: number = (msg.content.match(/ /g) || []).length;

                // # spaces = # mentions -> no duration, indefinite.
                if (numSpaces === msg.mentions.members.size) {
                    member.roles.add(mutedRole);

                    msg.channel.send({embeds: [{
                        color: 0xdddddd,
                        title: `Muted ${member.displayName}.`
                    }]});
                }
                else {
                    let durationSecs: number | undefined = convertTimeTextToSeconds(msg.content.slice(msg.content.lastIndexOf(' ') + 1));

                    if (durationSecs === undefined) {
                        member.roles.remove(mutedRole);

                        msg.channel.send({embeds: [{
                            color: 0xdddddd,
                            title: 'Action Failed.',
                            description: '❌ Invalid duration.'
                        }]});
                    }
                    else {
                        member.roles.add(mutedRole);
                        msg.channel.send({embeds: [{
                            color: 0xdddddd,
                            title: `Muted ${member.displayName} for ${msg.content.slice(msg.content.lastIndexOf(' ') + 1)}.`
                        }]});
                        setTimeoutSeconds(async () => {
                            if (member) {
                                // The member may have left or deleted their profile.
                                member.fetch(true).then(fetchedMember => {
                                    if (guild) {
                                        // The Muted role may no longer exist.
                                        let fetchedMutedRole = guild.roles.cache.find(role => role.name === 'Muted');
                                        if (fetchedMutedRole && member) {
                                            member.roles.remove(fetchedMutedRole);
                                        }
                                    }
                                });
                            }
                        }, durationSecs);
                    }
                }
            }
            else {
                msg.channel.send({embeds: [{
                    color: 0xdddddd,
                    title: 'Action Failed.',
                    description: '❌ Role \'Muted\' doesn\'t exist.'
                }]});
            }
        }
        else {
            unknownError(msg);
        }

        return;
    }
    else {
        msg.channel.send({embeds: [{
            color: 0xdddddd,
            title: 'Action Failed.',
            description: '❌ You must mention a member to mute.'
        }]});
        return;
    }
}