export NODE_OPTIONS="--max_old_space_size=18000"
npm install @types/yargs@17.0.12 --save
npm run packagr
cd dist/fccui-lib
npm pack
