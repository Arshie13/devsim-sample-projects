import { run } from 'vitest/cli';

await run({
  args: ['run', 'tests/level-3/task-2/returns-page.test.tsx', '--reporter', 'verbose'],
});