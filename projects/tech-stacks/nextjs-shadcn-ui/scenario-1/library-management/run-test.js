const { execSync } = require('child_process');

try {
  const output = execSync('npx vitest run tests/level-3/task-2/returns-page.test.tsx --reporter verbose', {
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  console.log(output);
} catch (error) {
  console.error(error.stdout || error.message);
  console.error(error.stderr || '');
  process.exit(error.status || 1);
}