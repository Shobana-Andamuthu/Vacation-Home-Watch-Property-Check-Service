const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('C:/Users/User/.gemini/antigravity-ide/brain/c1ea1ed9-4d4b-4dc4-bee4-a1b31263ea20/.user_uploaded/media_1792043531474.png');
let pos = 8;
let width, height;
const idatChunks = [];
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString('ascii', pos + 4, pos + 8);
  if (type === 'IHDR') {
    width = buf.readUInt32BE(pos + 8);
    height = buf.readUInt32BE(pos + 12);
  } else if (type === 'IDAT') {
    idatChunks.push(buf.slice(pos + 8, pos + 8 + len));
  }
  pos += 12 + len;
}
const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
const bpp = 4;
const rowSize = 1 + width * bpp;

// Let's sample y = 35 (middle of navbar)
// Print x coordinates of distinct elements
let clusters = [];
let inElement = false;
let startX = 0;

for (let x = 0; x < width; x++) {
  // Check y from 25 to 45
  let hasContent = false;
  for (let y = 25; y <= 45; y++) {
    const px = y * rowSize + 1 + x * bpp;
    const r = decompressed[px], g = decompressed[px + 1], b = decompressed[px + 2];
    const diff = Math.abs(r - 248) + Math.abs(g - 247) + Math.abs(b - 242);
    if (diff > 40) {
      hasContent = true;
      break;
    }
  }
  if (hasContent && !inElement) {
    inElement = true;
    startX = x;
  } else if (!hasContent && inElement) {
    inElement = false;
    clusters.push({ startX, endX: x - 1, width: x - startX });
  }
}
if (inElement) clusters.push({ startX, endX: width - 1, width: width - startX });

console.log('Navbar elements detected on horizontal scan:');
console.log(clusters);
