# setting the heap size to ~ 10 GB 
set NODE_OPTIONS=--max_old_space_size=10240
call npm run packagr
cd dist/tradeui-lib
call npm pack
