const io = require('socket.io-client');
const { v4: uuidv4 } = require('uuid');

function runTest(language, code, inputs) {
  const socket = io('http://localhost:5000', { transports: ['websocket'] });
  const sessionId = uuidv4();
  const received = [];

  socket.on('connect', () => {
    console.log('Connected, sessionId', sessionId);
    socket.emit('execute:start', { language, code, sessionId });
  });

  socket.on('execute:stdout', (payload) => {
    const text = payload.data;
    process.stdout.write('[STDOUT] ' + text);
    received.push({type:'stdout', text});
    // When prompt appears, send next input
    if (inputs.length > 0 && text.includes('Enter')) {
      const input = inputs.shift();
      console.log('Sending input:', input);
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
    // Output final collected stdout for verification
    const allStdout = received.filter(r=>r.type==='stdout').map(r=>r.text).join('');
    console.log('=== Collected STDOUT ===');
    console.log(allStdout);
  });
}

// C test
const cCode = `#include <stdio.h>
int main(){
    int a,b,c;
    printf("Enter first number: ");
    scanf("%d", &a);
    printf("Enter second number: ");
    scanf("%d", &b);
    printf("Sum = %d\n", a+b);
    printf("Enter third number: ");
    scanf("%d", &c);
    printf("Final result = %d\n", a+b+c);
    return 0;
}`;
runTest('c', cCode, ['10\n','20\n','5\n']);
