const { createServer } = require('vite');
const react = require('@vitejs/plugin-react');

const root = '../website';

// 启用本地服务
(async () => {
  const server = await createServer({
    // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    configFile: false,
    root,
    publicDir: '../public',
    server: {
      port: 1337,
    },
    plugins: [react()],
  });
  await server.listen();

  server.printUrls();
})();
