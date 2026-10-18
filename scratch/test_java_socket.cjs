const { io } = require('socket.io-client');
const socket = io('http://localhost:5000', { transports: ['websocket'] });

socket.on('connect', () => {
  const sessionId = socket.id;
  const code = `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.print("Enter first number: ");\n        int a = sc.nextInt();\n        System.out.print("Enter second number: ");\n        int b = sc.nextInt();\n        System.out.println("Sum = " + (a+b));\n    }\n}`;
  socket.emit('execute:start', { language: 'java', code, sessionId });
  setTimeout(() => socket.emit('execute:input', { sessionId, input: '10\n' }), 2000);
  setTimeout(() => socket.emit('execute:input', { sessionId, input: '20\n' }), 4000);
});

socket.on('execute:status', s => console.log('STATUS', s));
socket.on('execute:stdout', p => console.log('STDOUT', p.data));
socket.on('execute:exit', e => { console.log('EXIT', e); socket.disconnect(); });
