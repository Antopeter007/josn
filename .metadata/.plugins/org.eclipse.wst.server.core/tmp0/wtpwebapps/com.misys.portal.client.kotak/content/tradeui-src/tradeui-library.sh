npm install @types/yargs@17.0.12 --save
export NODE_OPTIONS="--max_old_space_size=8192"
npm run packagr
cd dist/tradeui-lib
npm pack