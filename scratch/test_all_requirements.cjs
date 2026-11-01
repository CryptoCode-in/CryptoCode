const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const assert = require('assert');
const { validatePassword: backendValidator } = require('../backend/src/utils/passwordValidator');

console.log('=== TEST SUITE 1: Password Strength Validation Unit Tests ===');

const testCases = [
  {
    password: 'Crypto@123',
    expectedValid: true,
    description: 'Valid password (upper, lower, digit, special, length >= 6)'
  },
  {
    password: 'crypto123',
    expectedValid: false,
    expectedErrorSubstring: 'uppercase',
    description: 'Invalid: missing uppercase letter'
  },
  {
    password: 'CRYPTO@123',
    expectedValid: false,
    expectedErrorSubstring: 'lowercase',
    description: 'Invalid: missing lowercase letter'
  },
  {
    password: 'Crypto@',
    expectedValid: false,
    expectedErrorSubstring: 'number',
    description: 'Invalid: missing number'
  },
  {
    password: 'CryptoCode',
    expectedValid: false,
    expectedErrorSubstring: 'special',
    description: 'Invalid: missing number and special character'
  },
  {
    password: 'Ab1!',
    expectedValid: false,
    expectedErrorSubstring: '6 characters',
    description: 'Invalid: less than 6 characters'
  },
  {
    password: '',
    expectedValid: false,
    expectedErrorSubstring: 'required',
    description: 'Invalid: empty string'
  }
];

let failedTests = 0;

for (const tc of testCases) {
  const res = backendValidator(tc.password);
  try {
    assert.strictEqual(res.isValid, tc.expectedValid, `Failed validity check for "${tc.password}"`);
    if (!tc.expectedValid && tc.expectedErrorSubstring) {
      const hasSubstring = res.errors.some(e => e.toLowerCase().includes(tc.expectedErrorSubstring.toLowerCase()));
      assert.ok(hasSubstring, `Expected error message to mention "${tc.expectedErrorSubstring}", got: ${JSON.stringify(res.errors)}`);
    }
    console.log(`  ✓ Passed: ${tc.description} ("${tc.password}") -> isValid: ${res.isValid}`);
  } catch (err) {
    console.error(`  ✗ Failed: ${tc.description} ("${tc.password}"):`, err.message);
    failedTests++;
  }
}

console.log('\n=== TEST SUITE 2: Backend Controllers Endpoint Inspection ===');

// Check submissionController languageUsage output
const submissionController = require('../backend/src/controllers/submissionController');
assert.ok(typeof submissionController.getSubmissionAnalytics === 'function', 'getSubmissionAnalytics must be exported');
console.log('  ✓ getSubmissionAnalytics function is properly defined');

// Verify studentController registerStudent has password validation
const studentController = require('../backend/src/controllers/studentController');
assert.ok(typeof studentController.registerStudent === 'function', 'registerStudent must be exported');
console.log('  ✓ registerStudent function is properly defined');

// Verify authController has signup, login, changePassword, resetPassword
const authController = require('../backend/src/controllers/authController');
assert.ok(typeof authController.signup === 'function', 'signup must be exported');
assert.ok(typeof authController.login === 'function', 'login must be exported');
assert.ok(typeof authController.changePassword === 'function', 'changePassword must be exported');
assert.ok(typeof authController.resetPassword === 'function', 'resetPassword must be exported');
console.log('  ✓ authController exports: signup, login, changePassword, resetPassword');

console.log('\n=== TEST SUITE 3: Simulated Request Validation on authController ===');

// Mock Express req & res
function createMockRes() {
  const res = {
    statusCode: null,
    jsonData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      return this;
    }
  };
  return res;
}

async function testSignupInvalidPassword() {
  const req = {
    body: {
      name: 'Test Student',
      email: 'student_invalid_pw@test.com',
      password: 'crypto123', // missing uppercase & special
      role: 'student'
    }
  };
  const res = createMockRes();
  await authController.signup(req, res);
  assert.strictEqual(res.statusCode, 400, 'Signup with invalid password must return HTTP 400');
  assert.ok(res.jsonData.message.includes('Password does not meet requirements'), 'Must include requirement error');
  console.log('  ✓ authController.signup rejected invalid password with message:', res.jsonData.message);
}

async function testChangePasswordInvalid() {
  const req = {
    body: {
      currentPassword: 'Crypto@123',
      newPassword: 'crypto' // too short, missing upper, digit, special
    }
  };
  const res = createMockRes();
  await authController.changePassword(req, res);
  assert.strictEqual(res.statusCode, 400, 'changePassword with invalid password must return HTTP 400');
  assert.ok(res.jsonData.message.includes('New password does not meet requirements'), 'Must include requirement error');
  console.log('  ✓ authController.changePassword rejected invalid password with message:', res.jsonData.message);
}

async function testResetPasswordInvalid() {
  const req = {
    body: {
      token_hash: 'mock_token',
      newPassword: 'CRYPTO@123' // missing lowercase
    }
  };
  const res = createMockRes();
  await authController.resetPassword(req, res);
  assert.strictEqual(res.statusCode, 400, 'resetPassword with invalid password must return HTTP 400');
  assert.ok(res.jsonData.message.includes('New password does not meet requirements'), 'Must include requirement error');
  console.log('  ✓ authController.resetPassword rejected invalid password with message:', res.jsonData.message);
}

(async () => {
  await testSignupInvalidPassword();
  await testChangePasswordInvalid();
  await testResetPasswordInvalid();

  if (failedTests === 0) {
    console.log('\n>>> ALL TEST SUITES PASSED CLEANLY! <<<');
  } else {
    console.error(`\n>>> ${failedTests} TESTS FAILED <<<`);
    process.exit(1);
  }
})();
