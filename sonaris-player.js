const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

function roundRect(ctx, x, y, w, h, r) {
  if (r === undefined) r = 5;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawAlbumFallback(ctx) {
  ctx.fillStyle = '#222';
  roundRect(ctx, 65, 90, 300, 300, 22);
  ctx.fill();
}

async function createSonarisPlayer({
  title,
  artist,
  requester,
  thumbnail,
  current = '00:00',
  duration = '04:23',
  volume = 100,
  paused = false,
  queue = []
}) {
  const width = 1200;
  const height = 650;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#080B18');
  bg.addColorStop(0.5, '#101126');
  bg.addColorStop(1, '#080A17');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Main panel
  ctx.fillStyle = '#0E1020';
  roundRect(ctx, 25, 25, 1150, 600, 24);
  ctx.fill();

  // subtle border
  ctx.strokeStyle = '#15152A';
  ctx.lineWidth = 2;
  roundRect(ctx, 25, 25, 1150, 600, 24);
  ctx.stroke();

  // Album art
  if (thumbnail) {
    try {
      const image = await loadImage(thumbnail);
      ctx.save();
      roundRect(ctx, 65, 90, 300, 300, 22);
      ctx.clip();
      ctx.drawImage(image, 65, 90, 300, 300);
      ctx.restore();

      ctx.strokeStyle = '#7257FF';
      ctx.lineWidth = 2;
      roundRect(ctx, 65, 90, 300, 300, 22);
      ctx.stroke();
    } catch (e) {
      drawAlbumFallback(ctx);
    }
  } else {
    drawAlbumFallback(ctx);
  }

  // NOW PLAYING label
  ctx.font = 'bold 22px Sans';
  ctx.fillStyle = '#A77BFF';
  ctx.fillText('NOW PLAYING', 410, 115);

  // Title
  ctx.font = 'bold 36px Sans';
  ctx.fillStyle = '#FFFFFF';
  const safeTitle = (title || 'Unknown Title').length > 38 ? (title || 'Unknown Title').substring(0, 38) + '...' : (title || 'Unknown Title');
  ctx.fillText(safeTitle, 410, 170);

  // Artist
  ctx.font = '20px Sans';
  ctx.fillStyle = '#B8B8CA';
  ctx.fillText(artist || 'Unknown Artist', 410, 210);

  // Requester
  ctx.font = '18px Sans';
  ctx.fillStyle = '#B8B8CA';
  ctx.fillText('Requested by', 410, 250);
  ctx.font = 'bold 18px Sans';
  ctx.fillStyle = '#9274FF';
  ctx.fillText(`@${requester || 'unknown'}`, 520, 250);

  // Progress bar background
  ctx.fillStyle = '#292A3C';
  roundRect(ctx, 410, 280, 650, 8, 4);
  ctx.fill();

  // Compute progress length from current and duration (simple parse mm:ss)
  function parseTime(t) {
    const parts = String(t).split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + (parts[1] || 0);
    return 0;
  }
  const curSec = parseTime(current);
  const durSec = parseTime(duration) || 1;
  const prog = Math.max(0, Math.min(1, curSec / durSec));
  const progWidth = Math.round(650 * prog);

  // Progress fill
  ctx.fillStyle = '#8B5CF6';
  roundRect(ctx, 410, 280, progWidth, 8, 4);
  ctx.fill();

  // Progress dot
  ctx.beginPath();
  ctx.arc(410 + progWidth, 284, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = '#8B5CF6';
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Times
  ctx.font = '16px Sans';
  ctx.fillStyle = '#A8A8B8';
  ctx.fillText(current, 410, 305);
  ctx.fillText(duration, 1010, 305);

  // Volume
  ctx.fillStyle = '#191B2C';
  roundRect(ctx, 410, 330, 600, 38, 8);
  ctx.fill();
  ctx.font = '18px Sans';
  ctx.fillStyle = '#8DA7FF';
  ctx.fillText('🔊 Volume:', 420, 355);
  ctx.font = '18px Sans';
  ctx.fillStyle = '#D0D0DC';
  ctx.fillText(`${volume}%`, 520, 355);
  ctx.fillStyle = '#292A3C';
  roundRect(ctx, 600, 346, 300, 8, 4);
  ctx.fill();
  ctx.fillStyle = '#8B5CF6';
  roundRect(ctx, 600, 346, Math.round((volume/100)*300), 8, 4);
  ctx.fill();

  // Controls area (drawn as decorative boxes to match aesthetic)
  // We'll not draw buttons but provide Discord buttons below

  // Queue (right column)
  ctx.font = 'bold 18px Sans';
  ctx.fillStyle = '#CFCFF6';
  ctx.fillText('QUEUE', 985, 120);

  ctx.font = '16px Sans';
  ctx.fillStyle = '#B8B8CA';
  const qStartY = 150;
  const qItemH = 50;
  const maxQueue = Math.min(queue.length, 7);
  for (let i = 0; i < maxQueue; i++) {
    const t = queue[i];
    const y = qStartY + i * qItemH;
    // background pill
    ctx.fillStyle = '#0E1222';
    roundRect(ctx, 840, y - 20, 330, 44, 10);
    ctx.fill();

    ctx.font = 'bold 14px Sans';
    ctx.fillStyle = '#FFFFFF';
    const safe = (t.info?.title || 'Unknown').length > 30 ? (t.info?.title || 'Unknown').substring(0, 30) + '...' : (t.info?.title || 'Unknown');
    ctx.fillText(safe, 860, y);

    ctx.font = '13px Sans';
    ctx.fillStyle = '#A8A8B8';
    ctx.fillText(t.info?.author || '', 860, y + 18);

    ctx.font = '13px Sans';
    ctx.fillStyle = '#A8A8B8';
    ctx.fillText(t.info?.length ? formatTime(t.info.length) : '', 1130, y);
  }

  // Footer info
  ctx.font = 'bold 18px Sans';
  ctx.fillStyle = '#C6B8FF';
  ctx.fillText('Sonaris Music Bot', 65, 580);
  ctx.font = '16px Sans';
  ctx.fillStyle = '#63D99A';
  ctx.fillText('● High Quality • 320kbps', 850, 580);

  const buffer = canvas.toBuffer('image/png');
  const attachment = new AttachmentBuilder(buffer, { name: 'sonaris-player.png' });

  // Discord controls (buttons)
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('back').setEmoji('⏮️').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('pause').setEmoji(paused ? '▶️' : '⏸️').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('skip').setEmoji('⏭️').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('skip10').setEmoji('⏩').setStyle(ButtonStyle.Secondary)
  );
  
  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('vol_down').setEmoji('🔉').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('vol_up').setEmoji('🔊').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('shuffle').setEmoji('🔀').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('favorite').setEmoji('💜').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('loop').setEmoji('🔁').setStyle(ButtonStyle.Secondary)
  );
  
  const row3 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('autoplay').setLabel('Autoplay').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setLabel('Features').setCustomId('features').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setLabel('Upgrade').setStyle(ButtonStyle.Link).setURL('https://discord.gg/9dsUdQ2PPD')
  );

  return { attachment, components: [row1, row2, row3] };
}

function formatTime(ms) {
  // Accept seconds or ms
  let s = Number(ms) || 0;
  if (s > 1000) s = Math.floor(s / 1000);
  const minutes = Math.floor(s / 60).toString().padStart(2, '0');
  const seconds = Math.floor(s % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

module.exports = { createSonarisPlayer };
