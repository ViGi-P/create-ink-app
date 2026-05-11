import React from 'react';
import {Text} from 'ink';

export type AppProperties = {
  readonly name?: string;
};

const App: React.FC<AppProperties> = ({name = 'World'}) =>
  React.createElement(Text, undefined, `Hello world, ${name}!`);

export default App;
