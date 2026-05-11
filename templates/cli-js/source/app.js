import React from 'react';
import {Text} from 'ink';

export default function App({name = 'World'} = {}) {
  return React.createElement(Text, undefined, `Hello world, ${name}!`);
}
