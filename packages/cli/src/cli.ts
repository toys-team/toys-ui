import { Command } from 'commander';
import { VERSION } from './shared/const';

const program = new Command();
program.version(VERSION);

// tye dev
program
  .command('dev')
  .description('启动本地服务')
  .action(async () => {
    const { dev } = await import('./dev');
    dev();
  });

// tye build
program
  .command('build')
  .description('打包项目')
  .action(async () => {
    const { build } = await import('./build');
    build();
  });

program.parse(process.argv);
