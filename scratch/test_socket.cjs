const { io } = require('socket.io-client');

const socket = io('http://localhost:5000', { transports: ['websocket'] });

socket.on('connect', () => {
  console.log('Connected to socket server, id:', socket.id);
  const sessionId = socket.id;
  const code = `name = input("Enter name: ")\nage = int(input("Enter age: "))\nprint(name, age)`;
  // start interactive execution
  socket.emit('execute:start', { language: 'python', code, sessionId });
});

socket.on('execute:status', (status) => {
  console.log('STATUS:', status);
});

socket.on('execute:stdout', (payload) => {
  console.log('STDOUT:', payload.data);
});

socket.on('execute:stderr', (payload) => {
  console.error('STDERR:', payload.data);
});

socket.on('execute:exit', (info) => {
  console.log('EXIT:', info);
  socket.disconnect();
});

let step = 0;
// listen for running status to know when to send input
socket.on('execute:status', (status) => {
  if (status.status === 'running') {
    if (step === 0) {
      console.log('Sending first input (Alice)');
      socket.emit('execute:input', { sessionId: socket.id, input: 'Alice\n' });
      step++;
    } else if (step === 1) {
      console.log('Sending second input (25)');
      socket.emit('execute:input', { sessionId: socket.id, input: '25\n' });
      step++;
    }
  }
});
