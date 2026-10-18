const { io } = require('socket.io-client');
const socket = io('http://localhost:5000', { transports: ['websocket'] });

socket.on('connect', () => {
  const sessionId = socket.id;
  const code = `a = int(input("Enter first number: "))\n b = int(input("Enter second number: "))\n print("Sum =", a + b)`;
  socket.emit('execute:start', { language: 'python', code, sessionId });
  setTimeout(() => socket.emit('execute:input', { sessionId, input: '10\n' }), 2000);
  setTimeout(() => socket.emit('execute:input', { sessionId, input: '20\n' }), 4000);
});

socket.on('execute:status', s => console.log('STATUS', s));
socket.on('execute:stdout', p => console.log('STDOUT', p.data));
socket.on('execute:exit', e => { console.log('EXIT', e); socket.disconnect(); });
