// Test harness for CryptoCode interactive terminal
const io = require('socket.io-client');
function generateId(){ return Math.random().toString(36).substring(2,15); }

function runTest(language, code, inputs) {
  const socket = io('http://localhost:5000', { transports: ['websocket'] });
  const sessionId = generateId();
  const received = [];

  socket.on('connect', () => {
    console.log('Connected, sessionId', sessionId);
    socket.emit('execute:start', { language, code, sessionId });
  });

  socket.on('execute:stdout', (payload) => {
    const text = payload.data;
    process.stdout.write('[STDOUT] ' + text);
    received.push({type:'stdout', text});
    if (inputs.length > 0 && /Enter|input|Prompt|\?/i.test(text)) {
      const input = inputs.shift();
      console.log('Sending input:', input.trim());
      socket.emit('execute:input', { sessionId, input });
    }
  });

  socket.on('execute:stderr', (payload) => {
    const text = payload.data;
    process.stderr.write('[STDERR] ' + text);
    received.push({type:'stderr', text});
  });

  socket.on('execute:status', (status) => {
    console.log('Status:', status);
    received.push({type:'status', status});
  });

  socket.on('execute:exit', (info) => {
    console.log('Exit:', info);
    received.push({type:'exit', info});
    socket.disconnect();
    console.log('Test completed.');
    const allStdout = received.filter(r=>r.type==='stdout').map(r=>r.text).join('');
    console.log('=== Collected STDOUT ===');
    console.log(allStdout);
  });
}

// C test
const cCode = "#include <stdio.h>\n\nint main() {\n    int a, b, c;\n    printf(\"Enter first number: \");\n    scanf(\"%d\", &a);\n    printf(\"Enter second number: \");\n    scanf(\"%d\", &b);\n    printf(\"Sum = %d\\n\", a + b);\n    printf(\"Enter third number: \");\n    scanf(\"%d\", &c);\n    printf(\"Final result = %d\\n\", a + b + c);\n    return 0;\n}";
runTest('c', cCode, ['10\n','20\n','5\n']);

// C++ test (using C stdio for simplicity)
const cppCode = "#include <iostream>\n\nint main() {\n    int a, b, c;\n    std::cout << \"Enter first number: \";\n    std::cin >> a;\n    std::cout << \"Enter second number: \";\n    std::cin >> b;\n    std::cout << \"Sum = \" << (a + b) << std::endl;\n    std::cout << \"Enter third number: \";\n    std::cin >> c;\n    std::cout << \"Final result = \" << (a + b + c) << std::endl;\n    return 0;\n}";
runTest('cpp', cppCode, ['10\n','20\n','5\n']);




    // cout << "Enter first number: ";
    // cin >> a;
    // cout << "Enter second number: ";
    // cin >> b;
    // cout << "Sum = " << a+b << "\n";
    // cout << "Enter third number: ";
    // cin >> c;
    // cout << "Final result = " << a+b+c << "\n";
    // return 0;
// }`;


// Python test
const pythonCode = "a = int(input(\"Enter first number: \"))\nb = int(input(\"Enter second number: \"))\nprint(\"Sum =\", a + b)\nc = int(input(\"Enter third number: \"))\nprint(\"Final result =\", a + b + c)";
runTest('python', pythonCode, ['10\n','20\n','5\n']);

// Java test
const javaCode = `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter first number: ");
        int a = scanner.nextInt();
        System.out.print("Enter second number: ");
        int b = scanner.nextInt();
        System.out.println("Sum = " + (a+b));
        System.out.print("Enter third number: ");
        int c = scanner.nextInt();
        System.out.println("Final result = " + (a+b+c));
    }
}`;
runTest('java', javaCode, ['10\n','20\n','5\n']);
