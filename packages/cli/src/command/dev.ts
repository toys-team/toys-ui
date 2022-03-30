import { createServer, FSWatcher, InlineConfig } from 'vite';
import { CWD, CONFIG_FILE_PATH } from '../shared/const';
import { merge } from 'lodash';
import fs from 'fs-extra';
import react from '@vitejs/plugin-react';
import chalk from 'chalk';

const { log } = console;
/**
 * tey dev 命令的执行文件
 */
export const dev = async () => {
  await startDevServer();
  log(chalk.blueBright('本地服务启用成功'));
};

/**
 * 启用本地服务
 */
const startDevServer = async () => {
  const customConfig = (await getCustomConfig()) || {};
  const baseConfig: InlineConfig = {
    // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    mode: 'development',
    configFile: false,
    root: CWD,
    publicDir: '../public',
    server: {
      port: 1337,
    },
    plugins: [react()],
  };
  const resultConfig = merge(customConfig, baseConfig);
  const server = await createServer(resultConfig);
  await server.listen();
  server.printUrls();
};

/**
 * 获取用户的自定义配置
 * 默认为根目录下的tye.config.js
 */
const getCustomConfig = async (): Promise<InlineConfig> => {
  const isExist = await fs.pathExists(CONFIG_FILE_PATH);
  let customConfig: InlineConfig = {};
  if (isExist) {
    // todo 提取配置
  }
  return customConfig;
};
