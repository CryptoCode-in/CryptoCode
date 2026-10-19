// finalWriteSources.js
// Writes clean C source (single‑escaped \n) and correct Python source.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cPath = path.join(__dirname, 'c_source.txt');
const pyPath = path.join(__dirname, 'python_source.txt');

const cSource = `#include <stdio.h>

int main() {
    int a, b, c;
    printf("Enter first number: ");
    scanf("%d", &a);
    printf("Enter second number: ");
    scanf("%d", &b);
    printf("Sum = %d\\n", a + b);
    printf("Enter third number: ");
    scanf("%d", &c);
    printf("Final result = %d\\n", a + b + c);
    return 0;
}`;

const pySource = `a = int(input("Enter first number: "))
b = int(input("Enter second number: "))
print("Sum =", a + b)
c = int(input("Enter third number: "))
print("Final result =", a + b + c)`;

fs.writeFileSync(cPath, cSource, 'utf8');
fs.writeFileSync(pyPath, pySource, 'utf8');
console.log('Clean C and Python source files written');
