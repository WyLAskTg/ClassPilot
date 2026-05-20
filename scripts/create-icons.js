const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const size = 256;
const pixels = Buffer.alloc(size * size * 4);
const buildDir = path.join(__dirname, "..", "build");

function setPixel(x, y, color) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;

  const index = (y * size + x) * 4;
  pixels[index] = color[0];
  pixels[index + 1] = color[1];
  pixels[index + 2] = color[2];
  pixels[index + 3] = color[3];
}

function isInsideRoundedRect(px, py, x, y, width, height, radius) {
  const left = x + radius;
  const right = x + width - radius - 1;
  const top = y + radius;
  const bottom = y + height - radius - 1;

  if (px >= left && px <= right && py >= y && py < y + height) return true;
  if (py >= top && py <= bottom && px >= x && px < x + width) return true;

  const cx = px < left ? left : right;
  const cy = py < top ? top : bottom;
  const dx = px - cx;
  const dy = py - cy;

  return dx * dx + dy * dy <= radius * radius;
}

function drawRoundedRect(x, y, width, height, radius, color) {
  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) {
      if (isInsideRoundedRect(px, py, x, y, width, height, radius)) {
        setPixel(px, py, color);
      }
    }
  }
}

function drawRect(x, y, width, height, color) {
  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) {
      setPixel(px, py, color);
    }
  }
}

function drawCircle(cx, cy, radius, color) {
  for (let py = cy - radius; py <= cy + radius; py += 1) {
    for (let px = cx - radius; px <= cx + radius; px += 1) {
      const dx = px - cx;
      const dy = py - cy;

      if (dx * dx + dy * dy <= radius * radius) {
        setPixel(px, py, color);
      }
    }
  }
}

function drawClippedRect(x, y, width, height, clip, color) {
  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) {
      if (isInsideRoundedRect(px, py, clip.x, clip.y, clip.width, clip.height, clip.radius)) {
        setPixel(px, py, color);
      }
    }
  }
}

function makeCrcTable() {
  const table = [];

  for (let n = 0; n < 256; n += 1) {
    let c = n;

    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }

    table[n] = c >>> 0;
  }

  return table;
}

const crcTable = makeCrcTable();

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  const crc = Buffer.alloc(4);

  length.writeUInt32BE(data.length, 0);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function createPng() {
  const raw = Buffer.alloc((size * 4 + 1) * size);

  for (let y = 0; y < size; y += 1) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0;
    pixels.copy(raw, rowStart + 1, y * size * 4, (y + 1) * size * 4);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function createIco(png) {
  const header = Buffer.alloc(6);
  const entry = Buffer.alloc(16);

  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  entry[0] = 0;
  entry[1] = 0;
  entry[2] = 0;
  entry[3] = 0;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12);

  return Buffer.concat([header, entry, png]);
}

function drawIcon() {
  drawRoundedRect(14, 14, 228, 228, 44, [47, 128, 237, 255]);
  drawRoundedRect(30, 34, 196, 184, 24, [255, 255, 255, 255]);

  const calendar = { x: 30, y: 34, width: 196, height: 184, radius: 24 };
  drawClippedRect(30, 34, 196, 46, calendar, [24, 34, 48, 255]);

  drawCircle(82, 58, 8, [245, 247, 251, 255]);
  drawCircle(174, 58, 8, [245, 247, 251, 255]);
  drawRect(78, 34, 8, 28, [47, 128, 237, 255]);
  drawRect(170, 34, 8, 28, [47, 128, 237, 255]);

  for (const x of [76, 122, 168]) {
    drawRect(x, 96, 2, 96, [216, 222, 233, 255]);
  }

  for (const y of [120, 148, 176]) {
    drawRect(48, y, 160, 2, [216, 222, 233, 255]);
  }

  drawRoundedRect(55, 104, 54, 28, 8, [22, 163, 74, 255]);
  drawRoundedRect(116, 104, 76, 28, 8, [245, 158, 11, 255]);
  drawRoundedRect(70, 154, 96, 30, 8, [139, 92, 246, 255]);
  drawRoundedRect(146, 132, 50, 26, 8, [236, 72, 153, 255]);
}

fs.mkdirSync(buildDir, { recursive: true });
drawIcon();

const png = createPng();
fs.writeFileSync(path.join(buildDir, "icon.png"), png);
fs.writeFileSync(path.join(buildDir, "icon.ico"), createIco(png));

console.log("Generated build/icon.png and build/icon.ico");
