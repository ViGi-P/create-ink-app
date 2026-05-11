import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import {render} from 'ink-testing-library';
import App from '../dist/app.js';

test('renders hello world', () => {
  const {lastFrame} = render(React.createElement(App));

  assert.equal(lastFrame(), 'Hello world');
});
