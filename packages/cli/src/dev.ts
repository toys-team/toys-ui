import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import { merge } from 'lodash';
import { createServer } from 'vite';
import { bundleConfigFile, loadConfigFromBundledFile, TeyConfig } from './config';
import { CONFIG_FILE_NAME, CWD } from './shared/const';
import { defaultDevConfig } from './shared/defaultConfig';

/**
 * tey dev 命令的执行文件
 */
export const dev = async () => {
  await startDevServer();
};

/**
 * 启用本地服务
 */
const startDevServer = async () => {
  const options = (await resolveOptions()) || {};
  const server = await createServer(options);
  await server.listen();
  server.printUrls();
};

/**
 * 处理配置
 * @param configPath 配置文件路径
 * @returns 用户自定义配置
 */
export async function resolveOptions(configPath?: string): Promise<TeyConfig | undefined> {
  let resolvedPath: string | undefined;
  // TODO 这里需要区分dev和build环境，然后导出不同的默认配置
  const defaultConfig = defaultDevConfig;
  // 1. 获取用户配置文件地址
  if (configPath) {
    resolvedPath = path.resolve(CWD, configPath);
  } else {
    // 查看默认的用户配置文件，分为js和ts
    const jsConfigPath = path.resolve(CWD, CONFIG_FILE_NAME.js);
    if (fs.existsSync(jsConfigPath)) {
      resolvedPath = jsConfigPath;
    } else {
      const tsConfigPath = path.resolve(CWD, CONFIG_FILE_NAME.ts);
      resolvedPath = tsConfigPath;
    }
  }

  // 2. 到这里如果resolvedPath为undefined，说明用户没有配置文件，直接返回默认配置
  if (!resolvedPath) {
    return defaultConfig;
  }

  const isTs = resolvedPath.endsWith('.ts');

  try {
    let userConfig: TeyConfig | undefined;
    if (!isTs) {
      try {
        userConfig = require(resolvedPath);
      } catch (e) {
        // 如果是这几种错误就忽略掉，继续往下走
        const ignored =
          /Cannot use import statement|Unexpected token 'export'|Must use import to load ES Module/;
        if (!ignored.test((e as Error).message)) {
          throw e;
        }
      }
    }

    if (!userConfig) {
      // 走到这里的话又两种情况：1. ts文件； 2. js文件中出现了 import或者export等ES Module语法
      // 所以这里需要打包为cmj格式
      const output = await bundleConfigFile(resolvedPath);
      userConfig = loadConfigFromBundledFile(resolvedPath, output.code);
    }

    if (userConfig?.port && defaultConfig.server) {
      defaultConfig.server.port = userConfig?.port;
      delete userConfig.port;
    }

    const config = merge(userConfig, defaultConfig);
    return config;
  } catch (e) {
    console.error(chalk.red(`[tey] 加载配置文件失败${resolvedPath}`));
    console.error(e);
    process.exit(1);
  }
}
