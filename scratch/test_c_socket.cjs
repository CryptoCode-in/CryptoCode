const { io } = require('socket.io-client');

const socket = io('http://localhost:5000', { transports: ['websocket'] });

socket.on('connect', () => {
  console.log('Connected, socket id:', socket.id);
  const sessionId = socket.id;
  const code = `#include <stdio.h>
int main() {
    float num1, num2, sum;
    printf("Enter first number: ");
    scanf("%f", &num1);
    printf("Enter second number: ");
    scanf("%f", &num2);
    sum = num1 + num2;
    printf("Sum = %.2f\\n", sum);
    return 0;
}`;
  socket.emit('execute:start', { language: 'c', code, sessionId });
});

let step = 0;

socket.on('execute:status', (status) => {
  console.log('STATUS:', status);
  if (status.status === 'running') {
    if (step === 0) {
      console.log('Sending first input: 10');
      socket.emit('execute:input', { sessionId: socket.id, input: '10\n' });
      step++;
    } else if (step === 1) {
      console.log('Sending second input: 20');
      socket.emit('execute:input', { sessionId: socket.id, input: '20\n' });
      step++;
    }
  }
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
