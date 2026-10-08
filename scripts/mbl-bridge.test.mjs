import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MBL_BRIDGE_CHANNEL, MBL_BRIDGE_VERSION, MBL_MODES, MBL_PALETTES,
  trustedMblParentOrigin, isMblBridgeCommand, isMblBridgeHello,
} from '../src/bridge/mblBridge.ts';

const command = (action, value, requestId = 'mbl-1') => ({
  channel: MBL_BRIDGE_CHANNEL, kind: 'command', action, value, requestId,
});

test('only the genuine GitHub Pages MBL referrer may control the embedded visualizer', () => {
  assert.equal(trustedMblParentOrigin('https://michaelwave369.github.io/MoreBounceLabs/#/lab'), 'https://michaelwave369.github.io');
  assert.equal(trustedMblParentOrigin('https://michaelwave369.github.io/MoreBounceLabs/'), 'https://michaelwave369.github.io');
  for (const invalid of [
    '', 'https://evil.example/MoreBounceLabs/', 'https://michaelwave369.github.io/evil/',
    'https://michaelwave369.github.io/MoreBounceLabs-copy/', 'http://michaelwave369.github.io/MoreBounceLabs/',
    'https://michaelwave369.github.io.evil.test/MoreBounceLabs/', 'javascript:alert(1)',
  ]) assert.equal(trustedMblParentOrigin(invalid), null, invalid);
});

test('the hello message must match the protocol and version', () => {
  assert.equal(isMblBridgeHello({ channel: MBL_BRIDGE_CHANNEL, kind: 'hello', version: MBL_BRIDGE_VERSION }), true);
  assert.equal(isMblBridgeHello({ channel: MBL_BRIDGE_CHANNEL, kind: 'hello', version: 999 }), false);
  assert.equal(isMblBridgeHello({ channel: 'other', kind: 'hello', version: 1 }), false);
});

test('only allowlisted modes/palettes and exact safe/reset actions can cross bridge', () => {
  for (const mode of MBL_MODES) assert.equal(isMblBridgeCommand(command('mode', mode)), true);
  for (const palette of MBL_PALETTES) assert.equal(isMblBridgeCommand(command('palette', palette)), true);
  assert.equal(isMblBridgeCommand(command('safe', undefined)), true);
  assert.equal(isMblBridgeCommand(command('reset', undefined)), true);
  for (const evil of [
    command('mode', 'javascript:alert(1)'), command('palette', '#ff0000'),
    command('safe', 'surprise'), command('reset', null), command('delete', undefined),
    command('mode', MBL_MODES[0], 'mbl-xx'),
    { ...command('mode', MBL_MODES[0]), channel: 'other' },
    null, {}, [], 42,
  ]) assert.equal(isMblBridgeCommand(evil), false, JSON.stringify(evil));
});
