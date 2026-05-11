import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import {render} from 'ink-testing-library';
import App from '../bin/app.js';

test('renders hello world', () => {
  const {lastFrame} = render(React.createElement(App, {name: 'Ink'}));

  assert.equal(lastFrame(), 'Hello world, Ink!');
});
