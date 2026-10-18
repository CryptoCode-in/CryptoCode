const { io } = require('socket.io-client');
const socket = io('http://localhost:5000', { transports: ['websocket'] });

socket.on('connect', () => {
  const sessionId = socket.id;
  const code = `#include <stdio.h>\nint main(){\n    printf("Hello World\\n");\n    return 0;\n}`;
  socket.emit('execute:start', { language: 'c', code, sessionId });
});

socket.on('execute:status', s=>console.log('STATUS',s));
socket.on('execute:stdout', p=>console.log('STDOUT',p.data));
socket.on('execute:exit', e=>{console.log('EXIT',e);socket.disconnect();});
