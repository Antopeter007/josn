REM setting the heap size to ~ 10 GB
set NODE_OPTIONS=--max_old_space_size=18000
npm install @types/yargs@17.0.12 --save
call npm run packagr
cd dist/fccui-lib
call npm pack
