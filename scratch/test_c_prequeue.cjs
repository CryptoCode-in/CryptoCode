const { io } = require('socket.io-client');
const socket = io('http://localhost:5000', { transports: ['websocket'] });

socket.on('connect', () => {
  const sessionId = socket.id;
  const code = `#include <stdio.h>\nint main() {\n    float a,b;\n    printf("Enter first number: ");\n    scanf("%f", &a);\n    printf("Enter second number: ");\n    scanf("%f", &b);\n    printf("Sum = %.2f\\n", a+b);\n    return 0;\n}`;
  socket.emit('execute:start', { language: 'c', code, sessionId });
  // Immediately send input before any status
  socket.emit('execute:input', { sessionId, input: '10\n' });
  socket.emit('execute:input', { sessionId, input: '20\n' });
});

socket.on('execute:status', (status) => console.log('STATUS', status));
socket.on('execute:stdout', (payload) => console.log('STDOUT', payload.data));
socket.on('execute:exit', (info) => { console.log('EXIT', info); socket.disconnect(); });
