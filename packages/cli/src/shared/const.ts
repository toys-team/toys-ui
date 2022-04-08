import path from 'path';
import { cwd } from 'process';

const packageInfo = require('../../package.json');
// 版本号
export const VERSION: string = packageInfo.version;
// 当前命令行执行根路径
export const CWD = cwd();
// cli配置文件
export enum CONFIG_FILE_NAME {
  js = 'tey.config.js',
  ts = 'tey.config.ts',
}
