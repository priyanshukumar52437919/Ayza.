const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

(async () => {
  try {
    // Path to the attached PNG (from the user's message)
    const src = "c:\\Users\\priya\\AppData\\Roaming\\Code\\agentSessionData\\23e94b3c-6e4d-4642-8e1a-a2396813867d\\attachments\\bd9800bb-298a-4d0a-819b-b27418e44bcd\\Pasted Image.png";
    if (!fs.existsSync(src)) {
      console.error('Source image not found:', src);
      process.exit(2);
    }

    const img = await loadImage(src);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    let buffer;
    let mime;
    try {
      buffer = canvas.toBuffer('image/webp', { quality: 0.9 });
      mime = 'image/webp';
      console.log('Converted to WEBP');
    } catch (e) {
      console.warn('WEBP conversion failed (threw), falling back to PNG:', e.message || e);
      buffer = canvas.toBuffer('image/png');
      mime = 'image/png';
    }

    // If canvas.toBuffer returned falsy for WEBP, fallback to default PNG buffer
    if (!buffer) {
      try {
        buffer = canvas.toBuffer();
        mime = 'image/png';
        console.warn('WEBP not supported by canvas build; using PNG output');
      } catch (e) {
        throw new Error('Canvas failed to produce any buffer: ' + (e.message || e));
      }
    }

    // Ensure we have a Node Buffer
    if (!(buffer instanceof Buffer)) buffer = Buffer.from(buffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mime};base64,${base64}`;

    const out = {
      name: 'sonaris-player.embedded',
      filename: mime === 'image/webp' ? 'sonaris-player.webp' : 'sonaris-player.png',
      mime,
      size: buffer.length,
      data: dataUrl,
      createdAt: new Date().toISOString()
    };

    const outPath = path.join(__dirname, 'sonaris-player-embedded.json');
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
    console.log('Wrote', outPath);
  } catch (err) {
    console.error('Error during conversion:', err);
    process.exit(1);
  }
})();