import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';

const source = stripTypeScriptTypes(readFileSync(new URL('./effort.ts', import.meta.url), 'utf8'))
 .replace(/import \{ getSupportedThinkingLevels \} from [^;]+;/, '')
 .replace('export default function effortExtension', 'function effortExtension');
function fixture(levels) {
 let command; let effective = 'high'; const changes = []; const notices = [];
 const register = vm.runInNewContext(source + '\neffortExtension;', { getSupportedThinkingLevels: () => levels });
 register({ on() {}, registerCommand(_name, value) { command = value; }, setThinkingLevel(level) { changes.push(level); effective = level; }, getThinkingLevel() { return effective; } });
 const ctx = { hasUI: true, model: { id: 'test-model' }, ui: { setStatus() {}, notify: (...args) => notices.push(args), select: async (_title, choices) => choices.at(-1) } };
 return { command, ctx, changes, notices };
}

test('max has the same direct-command and picker behavior when supported', async () => {
 const f = fixture(['off', 'high', 'max']);
 await f.command.handler(' max ', f.ctx);
 await f.command.handler('', f.ctx);
 assert.deepEqual(f.changes, ['max', 'max']);
 assert.ok(f.command.getArgumentCompletions('ma').some(item => item.value === 'max'));
});

test('unsupported or unknown effort never changes the active level', async () => {
 for (const input of ['max', 'unknown', 'HIGH']) {
  const f = fixture(['off', 'high']);
  await f.command.handler(input, f.ctx);
  assert.deepEqual(f.changes, []);
  assert.equal(f.notices[0][1], 'error');
 }
});
