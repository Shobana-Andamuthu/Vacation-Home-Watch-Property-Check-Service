const fs = require('fs');
const zlib = require('zlib');

function decodePng(filePath) {
  const buf = fs.readFileSync(filePath);
  let pos = 8;
  let width, height, bitDepth, colorType;
  const idatChunks = [];

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
      bitDepth = buf.readUInt8(pos + 16);
      colorType = buf.readUInt8(pos + 17);
    } else if (type === 'IDAT') {
      idatChunks.push(buf.slice(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }

  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
  console.log(`PNG Info: width=${width}, height=${height}, bitDepth=${bitDepth}, colorType=${colorType}`);

  // Color type 6 is RGBA (4 bytes per pixel), 2 is RGB (3 bytes)
  const bpp = colorType === 6 ? 4 : colorType === 2 ? 3 : 4;
  const rowSize = 1 + width * bpp;

  // Let's sample rows in navbar (y around 30-40) and heading (y around 90-120)
  // Find non-background pixels on each row
  // Background in navbar is offwhite ~ #F8F7F2 (r: 248, g: 247, b: 242) or white
  // Background in section is white #FFFFFF
  
  // Find leftmost and rightmost non-background pixels for navbar (y from 15 to 65)
  let navMinX = width, navMaxX = 0;
  for (let y = 15; y < 65; y++) {
    const rowOffset = y * rowSize + 1;
    for (let x = 0; x < width; x++) {
      const px = rowOffset + x * bpp;
      const r = decompressed[px];
      const g = decompressed[px + 1];
      const b = decompressed[px + 2];
      // Check if noticeably different from nav-bg (#F8F7F2 ~ 248, 247, 242)
      const diff = Math.abs(r - 248) + Math.abs(g - 247) + Math.abs(b - 242);
      if (diff > 35) {
        if (x < navMinX) navMinX = x;
        if (x > navMaxX) navMaxX = x;
      }
    }
  }

  console.log(`Navbar non-bg pixels: minX=${navMinX}, maxX=${navMaxX}`);

  // Find leftmost and rightmost for Why Home Watch Matters (y from 80 to 128)
  let headMinX = width, headMaxX = 0;
  for (let y = 80; y < height; y++) {
    const rowOffset = y * rowSize + 1;
    for (let x = 0; x < width; x++) {
      const px = rowOffset + x * bpp;
      const r = decompressed[px];
      const g = decompressed[px + 1];
      const b = decompressed[px + 2];
      // Check if text (dark color, r<100, g<100, b<100) or badge
      if (r < 180 && g < 180 && b < 180) {
        if (x < headMinX) headMinX = x;
        if (x > headMaxX) headMaxX = x;
      }
    }
  }

  console.log(`Heading non-bg pixels: minX=${headMinX}, maxX=${headMaxX}`);
}

decodePng('C:/Users/User/.gemini/antigravity-ide/brain/c1ea1ed9-4d4b-4dc4-bee4-a1b31263ea20/.user_uploaded/media_1792043531474.png');
