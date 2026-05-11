import cpy from 'cpy';

await cpy('source/*.js', 'dist', {flat: true});
