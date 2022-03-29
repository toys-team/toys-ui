import { Command } from 'commander';

const program = new Command();

program
  .command('dev')
  .description('启动本地服务')
  .action((source, destination) => {
    console.log('source, destination');
  });

program.parse(process.argv);

console.log(1);
