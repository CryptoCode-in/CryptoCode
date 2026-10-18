const sessionManager = require('./backend/execution/sessionManager');
const { routeInteractiveCode } = require('./backend/execution/languageRouter');

const code = `name = input('Enter name: ')\nage = int(input('Enter age: '))\nprint(name, age)`;

const sessionId = 'test-session-1';

routeInteractiveCode('python', code, sessionId, {
  onStdout: (text) => console.log('STDOUT>', text),
  onStderr: (text) => console.error('STDERR>', text),
  onStatus: (status) => console.log('STATUS>', status),
  onExit: (info) => console.log('EXIT>', info)
}).then((session) => {
  // send inputs after short delays
  setTimeout(() => {
    console.log('Sending name input');
    sessionManager.writeInput(sessionId, 'Alice');
  }, 1000);
  setTimeout(() => {
    console.log('Sending age input');
    sessionManager.writeInput(sessionId, '30');
  }, 2000);
});
