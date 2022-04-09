import path from 'path';

import { build } from 'esbuild';
import { InlineConfig } from 'vite';

export interface TeyConfig extends InlineConfig {
  port?: number;
}

export function defineConfig(config: TeyConfig): TeyConfig {
  return config;
}

/**
 * 打包配置文件
 * @param entry 入口文件地址
 * @param format bundle格式
 * @returns 打包后的code和dependencies
 */
export async function bundleConfigFile(entry: string, format: 'iife' | 'cjs' | 'esm' = 'cjs') {
  const output = await build({
    entryPoints: [entry],
    format,
    platform: 'node',
    bundle: true, // 将所有模块打包成一个文件
    metafile: true,
    write: false, // 不输出文件，将其写到缓存区
    outfile: 'out.js',
    plugins: [
      {
        name: 'externalize-deps',
        setup(build) {
          build.onResolve({ filter: /.*/ }, args => {
            const id = args.path;
            // 当文件路径是.开头时或者为相对路径时证明是本地文件，需要bundle
            // 否则就要设置为external
            if (id[0] !== '.' && !path.isAbsolute(id)) {
              return {
                external: true,
              };
            }
          });
        },
      },
    ],
  });
  const { text } = output.outputFiles[0];
  return {
    code: text,
    dependencies: output.metafile ? Object.keys(output.metafile.inputs) : [],
  };
}

interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): any;
}

export function loadConfigFromBundledFile(filePath: string, bundleCode: string) {
  // 获取扩展名
  const extension = path.extname(filePath);
  const defaultLoader = require.extensions[extension]!;

  require.extensions[extension] = (module, filename) => {
    if (filePath === filename) {
      (module as NodeModuleWithCompile)._compile(bundleCode, filename);
    } else {
      defaultLoader(module, filename);
    }
  };
  // 文件在导入之后就会放到缓存区，为了保证每次导入都是新的文件，需要清空缓存
  delete require.cache[require.resolve(filePath)];
  const raw = require(filePath);
  const config = raw.__esModule ? raw.default : raw;
  // 将扩展文件的loader恢复为默认的loader
  require.extensions[extension] = defaultLoader;
  return config;
}
