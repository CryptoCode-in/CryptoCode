const { io } = require('socket.io-client');
const socket = io('http://localhost:5000', { transports: ['websocket'] });

socket.on('connect', () => {
  const sessionId = socket.id;
  const code = `name = input("Enter name: ")\nage = int(input("Enter age: "))\nprint(name, age)`;
  socket.emit('execute:start', { language: 'python', code, sessionId });
  // send inputs after prompts
  setTimeout(() => socket.emit('execute:input', { sessionId, input: 'Alice\n' }), 2000);
  setTimeout(() => socket.emit('execute:input', { sessionId, input: '30\n' }), 4000);
});

socket.on('execute:status', s => console.log('STATUS', s));
socket.on('execute:stdout', p => console.log('STDOUT', p.data));
socket.on('execute:exit', e => { console.log('EXIT', e); socket.disconnect(); });
