// writeCleanSources.js
// Writes clean C and C++ source files with proper < > characters.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cPath = path.join(__dirname, 'c_source.txt');
const cppPath = path.join(__dirname, 'cpp_source.txt');

const cSource = `#include <stdio.h>

int main() {
    int a, b, c;
    printf("Enter first number: ");
    scanf("%d", &a);
    printf("Enter second number: ");
    scanf("%d", &b);
    printf("Sum = %d\n", a + b);
    printf("Enter third number: ");
    scanf("%d", &c);
    printf("Final result = %d\n", a + b + c);
    return 0;
}`;

const cppSource = `#include <iostream>

int main() {
    int a, b, c;
    std::cout << "Enter first number: ";
    std::cin >> a;
    std::cout << "Enter second number: ";
    std::cin >> b;
    std::cout << "Sum = " << (a + b) << std::endl;
    std::cout << "Enter third number: ";
    std::cin >> c;
    std::cout << "Final result = " << (a + b + c) << std::endl;
    return 0;
}`;

fs.writeFileSync(cPath, cSource, 'utf8');
fs.writeFileSync(cppPath, cppSource, 'utf8');
console.log('Clean sources written');
