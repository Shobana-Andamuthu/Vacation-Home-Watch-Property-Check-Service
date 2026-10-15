const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function encodePNG(width, height, rgbaBuffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  function makeChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const len = data.length;
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(len, 0);

    const crcBuf = Buffer.alloc(4);
    const toCrc = Buffer.concat([typeBuf, data]);
    const crcVal = zlib.crc32(toCrc);
    crcBuf.writeUInt32BE(crcVal, 0);

    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const dstOffset = y * (1 + width * 4);
    scanlines[dstOffset] = 0; // Filter 0 (None)
    rgbaBuffer.copy(scanlines, dstOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function decodePNG(filePath) {
  const buf = fs.readFileSync(filePath);
  let pos = 8;
  const idatChunks = [];
  let width = 0, height = 0;
  
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
    } else if (type === 'IDAT') {
      idatChunks.push(buf.subarray(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }

  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
  const bpp = 4;
  const raw = Buffer.alloc(width * height * 4);
  const rowStride = 1 + width * bpp;

  function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  }

  for (let y = 0; y < height; y++) {
    const filter = decompressed[y * rowStride];
    const srcRow = y * rowStride + 1;
    const dstRow = y * width * bpp;
    const prevDstRow = (y - 1) * width * bpp;
    for (let x = 0; x < width * bpp; x++) {
      const orig = decompressed[srcRow + x];
      const left = x >= bpp ? raw[dstRow + x - bpp] : 0;
      const up = y > 0 ? raw[prevDstRow + x] : 0;
      const upLeft = (y > 0 && x >= bpp) ? raw[prevDstRow + x - bpp] : 0;
      let val = 0;
      if (filter === 0) val = orig;
      else if (filter === 1) val = (orig + left) & 0xff;
      else if (filter === 2) val = (orig + up) & 0xff;
      else if (filter === 3) val = (orig + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) val = (orig + paeth(left, up, upLeft)) & 0xff;
      raw[dstRow + x] = val;
    }
  }

  return { width, height, raw };
}

// Main logic
const inputPath = 'assets/images/havenguard-logo.png';
const { width, height, raw } = decodePNG(inputPath);

console.log('Decoded logo PNG:', width, 'x', height);

// 1. Flood fill from outer boundaries to identify background
const isBg = new Uint8Array(width * height);
const queue = [];

function isWhiteish(x, y) {
  const idx = (y * width + x) * 4;
  const r = raw[idx], g = raw[idx + 1], b = raw[idx + 2];
  return (r >= 235 && g >= 235 && b >= 235);
}

// Push all boundary pixels
for (let x = 0; x < width; x++) {
  if (isWhiteish(x, 0)) { isBg[0 * width + x] = 1; queue.push([x, 0]); }
  if (isWhiteish(x, height - 1)) { isBg[(height - 1) * width + x] = 1; queue.push([x, height - 1]); }
}
for (let y = 0; y < height; y++) {
  if (isWhiteish(0, y)) { isBg[y * width + 0] = 1; queue.push([0, y]); }
  if (isWhiteish(width - 1, y)) { isBg[y * width + (width - 1)] = 1; queue.push([width - 1, y]); }
}

let head = 0;
while (head < queue.length) {
  const [cx, cy] = queue[head++];
  const neighbors = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
  for (const [nx, ny] of neighbors) {
    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
      const nIdx = ny * width + nx;
      if (!isBg[nIdx] && isWhiteish(nx, ny)) {
        isBg[nIdx] = 1;
        queue.push([nx, ny]);
      }
    }
  }
}

console.log('Background flood-filled pixels:', queue.length);

// Make transparent version with anti-aliasing on background edges
const transparentRaw = Buffer.from(raw);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const pIdx = y * width + x;
    if (isBg[pIdx]) {
      const r = transparentRaw[idx], g = transparentRaw[idx + 1], b = transparentRaw[idx + 2];
      const brightness = (r + g + b) / 3;
      if (brightness >= 252) {
        transparentRaw[idx + 3] = 0;
      } else {
        // Feathered anti-aliasing edge
        const alpha = Math.max(0, Math.min(255, Math.round((255 - brightness) * 4)));
        transparentRaw[idx + 3] = alpha;
      }
    }
  }
}

// Crop function
function cropImage(srcBuf, sWidth, sHeight, minX, minY, maxX, maxY) {
  const cWidth = maxX - minX + 1;
  const cHeight = maxY - minY + 1;
  const cRaw = Buffer.alloc(cWidth * cHeight * 4);

  for (let y = 0; y < cHeight; y++) {
    const srcY = minY + y;
    for (let x = 0; x < cWidth; x++) {
      const srcX = minX + x;
      const srcIdx = (srcY * sWidth + srcX) * 4;
      const dstIdx = (y * cWidth + x) * 4;
      srcBuf.copy(cRaw, dstIdx, srcIdx, srcIdx + 4);
    }
  }
  return { width: cWidth, height: cHeight, raw: cRaw };
}

// 1. Full brand logo (cropped: X: 55 to 975, Y: 100 to 400)
const fullCrop = cropImage(transparentRaw, width, height, 55, 100, 975, 400);
const fullPng = encodePNG(fullCrop.width, fullCrop.height, fullCrop.raw);
fs.writeFileSync('assets/images/havenguard-logo-transparent.png', fullPng);
console.log('Created havenguard-logo-transparent.png:', fullCrop.width, 'x', fullCrop.height, fullPng.length, 'bytes');

// 2. Shield icon only (X: 55 to 320, Y: 100 to 400)
const iconCrop = cropImage(transparentRaw, width, height, 55, 100, 320, 400);
const iconPng = encodePNG(iconCrop.width, iconCrop.height, iconCrop.raw);
fs.writeFileSync('assets/images/havenguard-shield-icon.png', iconPng);
console.log('Created havenguard-shield-icon.png:', iconCrop.width, 'x', iconCrop.height, iconPng.length, 'bytes');

// 3. Dark mode version of full logo (inverts dark navy text to crisp bright white/silver for dark mode readability)
const darkRaw = Buffer.from(fullCrop.raw);
for (let i = 0; i < darkRaw.length; i += 4) {
  const r = darkRaw[i], g = darkRaw[i + 1], b = darkRaw[i + 2], a = darkRaw[i + 3];
  if (a > 30) {
    // If it's dark navy (Haven text or shield outline)
    // Dark navy has r < 60, g < 90, b < 130
    if (r < 75 && g < 100 && b < 140) {
      darkRaw[i] = 245;     // bright off-white / silver
      darkRaw[i + 1] = 247;
      darkRaw[i + 2] = 250;
    }
  }
}
const darkPng = encodePNG(fullCrop.width, fullCrop.height, darkRaw);
fs.writeFileSync('assets/images/havenguard-logo-dark.png', darkPng);
console.log('Created havenguard-logo-dark.png:', fullCrop.width, 'x', fullCrop.height, darkPng.length, 'bytes');
