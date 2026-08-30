// config.js
const parseCsvList = (value, fallback = []) => {
  if (!value) return fallback;
  return value
    .split(',')
    .map((item) => String(item).trim())
    .filter(Boolean);
};

const ownerId = process.env.OWNER_ID || '1105509323511169086';
const partnerId = process.env.PARTNER_ID || '1497187125974798416';
const noPrefixUsers = parseCsvList(process.env.NO_PREFIX_USERS, [ownerId, partnerId]);

const envLavalinkNodes = (() => {
  const rawNodes = process.env.LAVALINK_NODES;
  if (rawNodes) {
    try {
      const parsed = JSON.parse(rawNodes);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.map((node) => ({
        name: node.name || 'Ajidev-US',
        host: node.host || process.env.LAVALINK_HOST || '127.0.0.1',
        port: Number(node.port ?? process.env.LAVALINK_PORT ?? 2333),
        password: node.password ?? process.env.LAVALINK_PASSWORD ?? 'YOUR_PASSWORD',
        secure: Boolean(node.secure ?? node.ssl ?? false),
        ...(node.region ? { region: node.region } : {})
      }));
    } catch (error) {
      console.warn('Invalid LAVALINK_NODES JSON, falling back to single-node config.', error.message);
    }
  }

  return [
    {
      name: 'Ajidev-US',
      host: process.env.LAVALINK_HOST || 'lavalinkv4.serenetia.com',
      port: Number(process.env.LAVALINK_PORT || 443),
      password: process.env.LAVALINK_PASSWORD || 'https://dsc.gg/ajidevserver',
      secure: true,
      region: 'us'
    }
  ];
})();

module.exports = {
  token: process.env.DISCORD_TOKEN || '',
  clientId: process.env.CLIENT_ID || '1541831397004550204',
  guildId: process.env.GUILD_ID || '1535279044906586195',
  prefix: process.env.COMMAND_PREFIX || '$',
  enablePrefix: true,
  supportServer: process.env.SUPPORT_SERVER || 'https://discord.gg/9dsUdQ2PPD',
  noPrefixUsers,
  owner: {
    id: ownerId,
    name: process.env.OWNER_NAME || 'Owner',
    partnerId
  },
  partner: {
    id: partnerId,
    name: process.env.PARTNER_NAME || 'Partner'
  },

  activity: {
    name: process.env.ACTIVITY_NAME || '$help',
    type: process.env.ACTIVITY_TYPE || 'LISTENING' // PLAYING, LISTENING, WATCHING, STREAMING, COMPETING
  },

  // Premium UI / theme options (can be set via environment variables)
  premium: {
    accentEmoji: process.env.PREMIUM_ACCENT || '✨',
    bannerUrl: process.env.PREMIUM_BANNER || '',
    enableAnimation: (process.env.PREMIUM_ANIM || 'false') === 'true'
  },

  express: {
    enabled: true,
    port: Number(process.env.PORT || 5000)
  },

  emojis: {
    play: '▶️',
    pause: '⏸️',
    stop: '⏹️',
    skip: '⏭️',
    queue: '📜',
    music: '🎵',
    loop: '🔁',
    shuffle: '🔀',
    volume: '🔊',
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  },

  aliases: {
    play: ['p'],
    pause: ['pa'],
    resume: ['r', 'res'],
    skip: ['s', 'next'],
    stop: ['st', 'leave', 'disconnect'],
    volume: ['v', 'vol'],
    queue: ['q'],
    nowplaying: ['np', 'current'],
    shuffle: ['sh', 'mix'],
    loop: ['l', 'repeat'],
    remove: ['rm', 'delete'],
    move: ['mv'],
    clearqueue: ['cq', 'clear'],
    '247': ['24/7', 'stay'],
    stats: ['status', 'info'],
    ping: ['latency'],
    invite: ['inv'],
    support: ['server'],
    help: ['h', 'commands', 'cmd']
  },

  lavalink: {
    nodes: envLavalinkNodes
  }
};
