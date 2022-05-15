import { Client, GuildEmoji } from "discord.js";

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