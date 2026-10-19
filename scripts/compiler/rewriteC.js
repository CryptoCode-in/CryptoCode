// rewriteC.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cPath = path.join(__dirname, 'c_source.txt');
let content = fs.readFileSync(cPath, 'utf8');
// replace double backslash n with single backslash n
content = content.replace(/\\\\n/g, '\\n');
fs.writeFileSync(cPath, content, 'utf8');
console.log('c_source.txt rewritten with single escaped newlines');
