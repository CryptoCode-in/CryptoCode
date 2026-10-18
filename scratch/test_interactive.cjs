const { routeInteractiveCode } = require('./backend/execution/languageRouter');
const sessionManager = require('./backend/execution/sessionManager');

const code = `name = input("Enter name: ")\nage = int(input("Enter age: "))\nprint(name, age)`;

(async () => {
  console.log('Starting interactive python');
  const session = await routeInteractiveCode('python', code, 'testsess1', {
    onStdout: (text) => console.log('STDOUT:', text),
    onStderr: (text) => console.error('STDERR:', text),
    onStatus: (s) => console.log('STATUS:', s),
    onExit: (info) => console.log('EXIT:', info)
  });
  setTimeout(() => {
    console.log('Sending Alice');
    sessionManager.writeInput('testsess1', 'Alice\n');
    setTimeout(() => {
      console.log('Sending 25');
      sessionManager.writeInput('testsess1', '25\n');
    }, 500);
  }, 1000);
})();
