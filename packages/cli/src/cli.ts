import { Command } from 'commander';
import { dev, build } from './command';
import { VERSION } from './shared/const';

const program = new Command();
program.version(VERSION);

// tye dev
program.command('dev').description('启动本地服务').action(dev);

// tye build
program.command('build').description('打包项目').action(build);

program.parse(process.argv);
