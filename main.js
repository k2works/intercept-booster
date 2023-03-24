const { exec } = require('child_process');

// gulpのdefaultタスクを実行するコマンドを定義する
const gulpCommand = 'npx gulp --gulpfile lib/gulpfile.js';

// child_processモジュールのexec関数を使用して、gulpコマンドを実行する
const child = exec(gulpCommand);

// gulpコマンドの出力をコンソールに表示する
child.stdout.on('data', (data) => {
  console.log(data);
});

// gulpコマンドのエラーをコンソールに表示する
child.stderr.on('data', (data) => {
  console.error(data);
});
