const { io } = require('socket.io-client');
const socket = io('http://localhost:5000', { transports: ['websocket'] });

socket.on('connect', () => {
  const sessionId = socket.id;
  const code = `#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    cout << "Enter first number: ";\n    cin >> a;\n    cout << "Enter second number: ";\n    cin >> b;\n    cout << "Sum = " << (a + b) << "\\n";\n    return 0;\n}`;
  socket.emit('execute:start', { language: 'cpp', code, sessionId });
  setTimeout(() => socket.emit('execute:input', { sessionId, input: '10\n' }), 2000);
  setTimeout(() => socket.emit('execute:input', { sessionId, input: '20\n' }), 4000);
});

socket.on('execute:status', s => console.log('STATUS', s));
socket.on('execute:stdout', p => console.log('STDOUT', p.data));
socket.on('execute:exit', e => { console.log('EXIT', e); socket.disconnect(); });
