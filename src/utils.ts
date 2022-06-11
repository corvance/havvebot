import { Client, GuildEmoji, Message } from "discord.js";

export function getEmoji(client: Client, emojiNameID: string) : GuildEmoji | string {
    let emoji: GuildEmoji | undefined = client.emojis.cache.get(emojiNameID);
    return (emoji === undefined) ? emojiNameID : emoji;
}

export function dateToUNIXTimestamp(date: Date) : string {
    return `<t:${Math.floor(date.getTime() / 1000)}:R>`;
}

export function splitOnSpaceExceptQuotedBracketed(splitstr: string) : string[] {
    let arr: RegExpMatchArray | null =
        splitstr.match(/(?:(["'])(\\.|(?!\1)[^\\])*\1|\[(?:(["'])(\\.|(?!\2)[^\\])*\2|[^\]])*\]|\((?:(["'])(\\.|(?!\3)[^\\])*\3|[^)])*\)|[^ ])+/g);
    return (arr === null) ? [] : arr;
}

export function formatStringArg(arg: string) : string {
    if (arg[0] === '"' && arg[arg.length - 1] === '"')
        arg = arg.slice(1, -1);

    // Replace the text "\n" with newline characters.
    arg = arg.replace(/\\n/g, '\n');

    return arg;
}

export function getNumFromParam(param : number | string | boolean | undefined) : number {
    let num: number = NaN;

    if (typeof param === "string") {
        if (param[0] === '"' && param[param.length - 1] === '"')
            param = param.slice(1, -1);

        num = parseInt(param);
    }
    else if (param !== undefined && typeof param !== "boolean")
        num = param;

    return num;
}

export function convertTimeText(timeText: string) : number | undefined {
    // Separate number from the text i.e. 2m -> 2, 4d -> 4, 16h -> 16.
    let time: number | undefined = getNumFromParam(timeText);
    // Isolate the text timescale modifier i.e. h, d, m.
    let scale: string = timeText.replace(/[0-9]/g, '');

    switch (scale) {
        case 's': time *= 1000; break;
        case 'm': time *= 60000; break;
        case 'h': time *= 3600000; break;
        case 'd': time *= 86400000; break;
        case 'w': time *= 604800000; break;
        case 'mo': time *= 2419200000; break;
        case 'y': time *= 29030400000; break;
        default: time = undefined;
    }

    return time;
}

export function unknownError(msg: Message) {
    msg.channel.send({embeds: [{
        color: 0xdddddd,
        title: 'Action Failed.',
        description: '❌ Role \'Muted\' doesn\'t exist.'
    }]});
}