// fixTestInteractive.js (ESM version)
// Reads clean source files and injects them into testInteractive.cjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testFile = path.join(__dirname, 'testInteractive.cjs');
const backupFile = testFile + '.bak_before_fix';
const cSourceFile = path.join(__dirname, 'c_source.txt');
const cppSourceFile = path.join(__dirname, 'cpp_source.txt');
const pythonSourceFile = path.join(__dirname, 'python_source.txt');

console.log('Reading testInteractive.cjs');
let content = fs.readFileSync(testFile, 'utf8');

if (!fs.existsSync(backupFile)) {
  fs.copyFileSync(testFile, backupFile);
  console.log('Backup created at', backupFile);
} else {
  console.log('Backup already exists at', backupFile);
}

// Read clean source files (they already contain proper < and >)
const cSource = fs.readFileSync(cSourceFile, 'utf8');
const cppSource = fs.readFileSync(cppSourceFile, 'utf8');
const pySource = fs.readFileSync(pythonSourceFile, 'utf8');

// Use JSON.stringify to safely embed source strings (preserves backslashes)
const newC = `const cCode = ${JSON.stringify(cSource)};`;
const newCpp = `const cppCode = ${JSON.stringify(cppSource)};`;
const newPy = `const pythonCode = ${JSON.stringify(pySource)};`;

// Regex to locate the full declarations (template literals in original file)
const cPattern = /const cCode = `([\s\S]*?)`;/;
const cppPattern = /const cppCode = `([\s\S]*?)`;/;
const pyPattern = /const pythonCode = `([\s\S]*?)`;/;

if (!cPattern.test(content)) {
  console.error('cCode declaration not found – aborting');
  process.exit(1);
}
if (!cppPattern.test(content)) {
  console.error('cppCode declaration not found – aborting');
  process.exit(1);
}
if (!pyPattern.test(content)) {
  console.error('pythonCode declaration not found – aborting');
  process.exit(1);
}

content = content.replace(cPattern, newC);
content = content.replace(cppPattern, newCpp);
content = content.replace(pyPattern, newPy);

fs.writeFileSync(testFile, content, 'utf8');
console.log('Replacements applied successfully');
