const { routeInteractiveCode } = require('./backend/execution/languageRouter');
const sessionManager = require('./backend/execution/sessionManager');

const code = `name = input("Enter name: ")\nage = int(input("Enter age: "))\nprint(name, age)`;

let stdout = '';
let stderr = '';
let status = '';

(async () => {
  const session = await routeInteractiveCode('python', code, 'testsess1', {
    onStdout: (text) => { stdout += text; console.log('STDOUT:', text); },
    onStderr: (text) => { stderr += text; console.error('STDERR:', text); },
    onStatus: (s) => { status = s; console.log('STATUS:', s); },
    onExit: (exitInfo) => { console.log('EXIT:', exitInfo); console.log('FINAL STDOUT:', stdout); }
  });

  // Wait a moment for the process to start, then send inputs
  setTimeout(() => {
    console.log('Sending name');
    sessionManager.writeInput('testsess1', 'Alice\n');
    setTimeout(() => {
      console.log('Sending age');
      sessionManager.writeInput('testsess1', '25\n');
    }, 500);
  }, 1000);
})();
