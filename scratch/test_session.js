const sessionManager = require('./backend/execution/sessionManager');
const path = require('path');
(async () => {
  const sessionId = 'test123';
  const pythonCmd = 'python'; // assume python in PATH
  const tempDir = null; // let sessionManager handle cwd
  const session = sessionManager.createSession(sessionId, pythonCmd, ['-u', '- <<EOF\nname = input(\"Enter name: \")\nage = int(input(\"Enter age: \"))\nprint(name, age)\nEOF'], {
    cwd: process.cwd(),
    onStdout: (data)=> console.log('STDOUT:', data),
    onStderr: (data)=> console.error('STDERR:', data),
    onStatus: (s)=> console.log('STATUS:', s),
    onExit: (res)=> console.log('EXIT:', res)
  });
  // wait a bit then send input
  setTimeout(()=>{
    session.writeInput('Alice\n');
    setTimeout(()=>{ session.writeInput('25\n'); }, 500);
  }, 1000);
})();
