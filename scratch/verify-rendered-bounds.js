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
  const bpp = 4;
  const stride = 1 + width * bpp;
  const raw = Buffer.alloc(width * height * bpp);

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
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        let pr = (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
        dstRow[x] = (val + pr) & 0xff;
      }
    }
    prevRow = dstRow;
  }
  return { width, height, data: raw };
}

function checkNavbarBounds(name, file) {
  const { width, height, data } = readPng(file);
  let left = -1, right = -1;
  for (let x = 0; x < width; x++) {
    for (let y = 15; y < 65; y++) {
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // Check if noticeably different from offwhite / background
      if (Math.abs(r - 248) + Math.abs(g - 247) + Math.abs(b - 242) > 40) {
        if (left === -1) left = x;
        right = x;
        break;
      }
    }
  }
  console.log(`${name}: total width=${width}, navbar content left=${left}, right=${right}, span=${right - left}`);
}

checkNavbarBounds('Login Page', 'scratch/login_1440.png');
checkNavbarBounds('Dashboard Page', 'scratch/dashboard_1440.png');
checkNavbarBounds('Index Page', 'scratch/index_1440.png');
