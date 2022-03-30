const path = require('path');
const { build, transformWithEsbuild } = require('vite');

const root = path.resolve(__dirname, '../');

(async () => {
  await build({
    root,
    base: './', // 开发环境是./, 生产环境 /
    mode: 'development',
    build: {
      rollupOptions: {
        // ...
      },
    },
  });
})();
