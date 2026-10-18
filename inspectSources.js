// inspectSources.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function showCodes(file) {
  const data = fs.readFileSync(path.join(__dirname, file), 'utf8');
  console.log('---', file, '---');
  // show first 2 lines with char codes
  const lines = data.split('\n').slice(0, 2);
  lines.forEach((line, idx) => {
    const codes = [...line].map(ch => ch.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
    console.log(`Line${idx+1}: ${line}`);
    console.log(`Codes : ${codes}`);
  });
}

showCodes('c_source.txt');
showCodes('cpp_source.txt');
