const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  try {
    const src = path.resolve(__dirname, 'sonaris-player-embedded.json');
    if (!fs.existsSync(src)) throw new Error('Embedded JSON not found: ' + src);
    const meta = JSON.parse(fs.readFileSync(src, 'utf8'));
    const dataUrl = meta.data || '';
    const base64 = dataUrl.split(',')[1];
    if (!base64) throw new Error('No base64 data in embedded JSON');

    const pngBuffer = Buffer.from(base64, 'base64');

    // Ensure assets dir
    const assetsDir = path.join(__dirname, 'assets');
    if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

    const outPath = path.join(assetsDir, 'sonaris-player.webp');

    // Convert to webp
    const webpBuffer = await sharp(pngBuffer).webp({ quality: 90 }).toBuffer();
    fs.writeFileSync(outPath, webpBuffer);

    // Update JSON to reference webp
    const newDataUrl = `data:image/webp;base64,${webpBuffer.toString('base64')}`;
    meta.filename = 'sonaris-player.webp';
    meta.mime = 'image/webp';
    meta.size = webpBuffer.length;
    meta.data = newDataUrl;
    meta.updatedAt = new Date().toISOString();

    fs.writeFileSync(src, JSON.stringify(meta, null, 2), 'utf8');

    console.log('Wrote', outPath);
    console.log('Updated', src);
  } catch (err) {
    console.error('Conversion failed:', err);
    process.exit(1);
  }
})();