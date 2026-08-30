# MusicBot

A powerful and easy-to-use Discord music bot with support for YouTube, Spotify, SoundCloud, and more. Fully customizable and self-hosted.

## Features

- High-quality audio playback  
- Multi-source support (YouTube, Spotify, etc.)  
- Easy configuration via `.env` and `config.js`  
- Simple setup and self-hosting  

## Getting Started

1. Clone the repository  
   ``git clone https://github.com/Unknownzop/MusicBot.git``

2. Navigate into the project directory  
   ``cd MusicBot``

3. Install dependencies  
   ``npm install``

4. Set up environment variables  
   ``cp .env.example .env``  
   Edit ``.env`` with your bot token, client ID, guild ID, owner IDs, and Lavalink values.

   Example configuration:
   ```env
   DISCORD_TOKEN=YOUR_BOT_TOKEN
   CLIENT_ID=1541831397004550204
   GUILD_ID=902611608252084225
   SUPPORT_SERVER=https://discord.gg/rj9R3qTVZA
   OWNER_ID=1105509323511169086
   PARTNER_ID=1497187125974798416
   NO_PREFIX_USERS=1105509323511169086,1497187125974798416
   LAVALINK_HOST=127.0.0.1
   LAVALINK_PORT=2333
   LAVALINK_PASSWORD=YOUR_PASSWORD
   ```

5. (Optional) Customize settings in  
   ``config.js``

6. Start the bot  
   ``node index.js``

## Owner / No-Prefix Access

The bot now supports configured owner and partner IDs without requiring the command prefix, and the owner information is stored in the config file for quick access.

- Owner ID: `1105509323511169086`
- Partner ID: `1497187125974798416`
- Support Server: `https://discord.gg/rj9R3qTVZA`

## License

This project is licensed under the GPL-3.0 License  
[View License](https://github.com/Unknownzop/MusicBot/blob/main/LICENSE)
