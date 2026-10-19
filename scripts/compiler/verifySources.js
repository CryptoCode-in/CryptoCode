// verifySources.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function hexLine(file) {
  const data = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const firstLine = data.split('\n')[0];
  const buffer = Buffer.from(firstLine, 'utf8');
  console.log(`${file} first line:`);
  console.log(firstLine);
  console.log('Hex codes:', buffer.toString('hex').match(/../g).join(' '));
}

hexLine('c_source.txt');
hexLine('cpp_source.txt');
