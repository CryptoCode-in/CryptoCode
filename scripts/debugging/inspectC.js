// inspectC.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cPath = path.join(__dirname, 'c_source.txt');
const buf = fs.readFileSync(cPath);
console.log('Hex dump of c_source.txt:');
let hex = '';
for (let i = 0; i < buf.length; i++) {
  hex += buf[i].toString(16).padStart(2, '0') + ' ';
  if ((i+1) % 16 === 0) hex += '\n';
}
console.log(hex);
