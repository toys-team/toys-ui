import { CWD } from './const';
import react from '@vitejs/plugin-react';
import { TeyConfig } from '../index';

export const defaultDevConfig: TeyConfig = {
  // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
  configFile: false,
  root: CWD,
  publicDir: '../public',
  server: {
    port: 2333,
  },
  plugins: [react()],
};
