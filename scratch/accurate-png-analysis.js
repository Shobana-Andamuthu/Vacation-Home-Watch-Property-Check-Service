const fs = require('fs');
const zlib = require('zlib');

function readPng(filePath) {
  const buf = fs.readFileSync(filePath);
  let pos = 8;
  let width, height;
  const idats = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
    } else if (type === 'IDAT') {
      idats.push(buf.slice(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }
  const decompressed = zlib.inflateSync(Buffer.concat(idats));
  const bpp = 4; // RGBA
  const stride = 1 + width * bpp;
  const raw = Buffer.alloc(width * height * bpp);

  // Unfilter PNG
  let prevRow = Buffer.alloc(width * bpp);
  for (let y = 0; y < height; y++) {
    const filter = decompressed[y * stride];
    const srcRow = decompressed.slice(y * stride + 1, (y + 1) * stride);
    const dstRow = raw.slice(y * width * bpp, (y + 1) * width * bpp);

    for (let x = 0; x < width * bpp; x++) {
      const a = x >= bpp ? dstRow[x - bpp] : 0;
      const b = prevRow[x];
      const c = x >= bpp ? prevRow[x - bpp] : 0;
      const val = srcRow[x];

      if (filter === 0) dstRow[x] = val;
      else if (filter === 1) dstRow[x] = (val + a) & 0xff;
      else if (filter === 2) dstRow[x] = (val + b) & 0xff;
      else if (filter === 3) dstRow[x] = (val + Math.floor((a + b) / 2)) & 0xff;
      else if (filter === 4) {
        // Paeth
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        let pr;
        if (pa <= pb && pa <= pc) pr = a;
        else if (pb <= pc) pr = b;
        else pr = c;
        dstRow[x] = (val + pr) & 0xff;
      }
    }
    prevRow = dstRow;
  }

  return { width, height, data: raw };
}

const { width, height, data } = readPng('C:/Users/User/.gemini/antigravity-ide/brain/c1ea1ed9-4d4b-4dc4-bee4-a1b31263ea20/.user_uploaded/media_1792043531474.png');
console.log(`Successfully uncompressed & unfiltered PNG: ${width}x${height}`);

// Let's find:
// 1. Navbar area (y: 10 to 60)
// For each column x from 0 to width - 1, find if it has content (non #f8f7f2)
let navLeft = -1, navRight = -1;
for (let x = 0; x < width; x++) {
  let isContent = false;
  for (let y = 15; y < 55; y++) {
    const idx = (y * width + x) * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    if (Math.abs(r - 248) + Math.abs(g - 247) + Math.abs(b - 242) > 40) {
      isContent = true;
      break;
    }
  }
  if (isContent) {
    if (navLeft === -1) navLeft = x;
    navRight = x;
  }
}
console.log(`Navbar content bounds: left=${navLeft}, right=${navRight}, span=${navRight - navLeft}`);

// Let's find distinct elements in navbar
let elements = [];
let currentElem = null;
for (let x = navLeft; x <= navRight; x++) {
  let isContent = false;
  for (let y = 15; y < 55; y++) {
    const idx = (y * width + x) * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    if (Math.abs(r - 248) + Math.abs(g - 247) + Math.abs(b - 242) > 30) {
      isContent = true;
      break;
    }
  }
  if (isContent) {
    if (!currentElem) currentElem = { start: x };
  } else {
    if (currentElem) {
      currentElem.end = x - 1;
      elements.push(currentElem);
      currentElem = null;
    }
  }
}
if (currentElem) {
  currentElem.end = navRight;
  elements.push(currentElem);
}

// Merge elements closer than 15px
let merged = [];
for (const el of elements) {
  if (merged.length === 0) merged.push(el);
  else {
    const prev = merged[merged.length - 1];
    if (el.start - prev.end < 15) {
      prev.end = el.end;
    } else {
      merged.push(el);
    }
  }
}
console.log('Merged navbar element groups (start, end, width, gap to next):');
for (let i = 0; i < merged.length; i++) {
  const el = merged[i];
  const gap = i < merged.length - 1 ? merged[i + 1].start - el.end : 0;
  console.log(`Group ${i + 1}: x=${el.start}..${el.end} (w=${el.end - el.start + 1}), gapToNext=${gap}`);
}

// 2. Heading area (y: 65 to 128)
let headLeft = -1, headRight = -1;
for (let x = 0; x < width; x++) {
  let isContent = false;
  for (let y = 70; y < height; y++) {
    const idx = (y * width + x) * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    // dark text or badge
    if (r < 180 && g < 180 && b < 180) {
      isContent = true;
      break;
    }
  }
  if (isContent) {
    if (headLeft === -1) headLeft = x;
    headRight = x;
  }
}
console.log(`Heading content bounds: left=${headLeft}, right=${headRight}, center=${Math.round((headLeft + headRight) / 2)}`);
