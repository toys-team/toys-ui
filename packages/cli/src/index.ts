import { InlineConfig } from 'vite';
export { useTeyConfig } from './command';

export interface TeyConfig extends InlineConfig {
  port?: number;
  server: {
    port: number;
  };
}
