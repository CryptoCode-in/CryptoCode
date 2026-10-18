const { io } = require('socket.io-client');
const socket = io('http://localhost:5000', { transports: ['websocket'] });

socket.on('connect', () => {
  const sessionId = socket.id;
  const code = `#include <stdio.h>\nint main() {\n    int a,b;\n    printf("Enter first number: ");\n    scanf("%d", &a);\n    printf("Enter second number: ");\n    scanf("%d", &b);\n    printf("Sum = %d\\n", a+b);\n    return 0;\n}`;
  socket.emit('execute:start', { language: 'c', code, sessionId });
  // send inputs after short delays to mimic user after prompts
  setTimeout(() => socket.emit('execute:input', { sessionId, input: '10\n' }), 2000);
  setTimeout(() => socket.emit('execute:input', { sessionId, input: '20\n' }), 4000);
});

socket.on('execute:status', s => console.log('STATUS', s));
socket.on('execute:stdout', p => console.log('STDOUT', p.data));
socket.on('execute:exit', e => { console.log('EXIT', e); socket.disconnect(); });
