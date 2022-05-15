# HavveBot

HavveBot is a TWRP-themed moderation bot created for use on the
[Ladyworld Discord server](https://discord.gg/NZGZJ2C). TWRP is a Canadian band most recongisable for their costumed personas, concealing their real identities. You should check them out!

## Usage

To run the bot, install the dependencies, compile the TypeScript to JavaScript with `tsc`, enter the `dist` directory and run `node bot.js` with the environment HAVVEBOT_TOKEN set to your bot token.

```bash
git clone https://www.github.com/corvance/havvebot
cd havvebot

npm i --save discord.js dotenv minimist @types/minimist
tsc

export HAVVEBOT_TOKEN=1234567890_abcdefghijklmnopqrstuvwxyz.ABCDEFGHIJKLMNOPQRSTUVWXYZ_12345
cd dist && node bot.js
```

Alternatively, you can use the scripts provided in package.json to simplify the process.

```bash
git clone https://www.github.com/corvance/havvebot
cd havvebot

npm i --save discord.js dotenv minimist @types/minimist
export HAVVEBOT_TOKEN=1234567890_abcdefghijklmnopqrstuvwxyz.ABCDEFGHIJKLMNOPQRSTUVWXYZ_12345
tsc && npm start
```

## Dependencies

- `discord.js` - The Discord bot library.
- `dotenv` - For facilitating loading of the token from a .env file.
- `minimist` - For parsing of bot command arguments like command-line arguments.

## License

This repository is subject to the terms of the MIT License, available at the LICENSE file in the root directory.
