/**
 * 城市数据处理脚本
 * 从 countries+states+cities.json 提取城市数据
 * 只保留：国家、州、城市
 * 
 * 运行方式: node scripts/process-cities.js
 */

const fs = require('fs');
const path = require('path');

// 读取原始数据
const inputPath = path.join(__dirname, '../src/data/countries+states+cities.json');
const outputPath = path.join(__dirname, '../src/data/cities-lite.json');

console.log('读取原始数据...');
const rawData = fs.readFileSync(inputPath, 'utf8');
const countries = JSON.parse(rawData);

console.log(`共 ${countries.length} 个国家`);

// 提取所有城市
const cities = [];

for (const country of countries) {
  const countryName = country.name;
  
  if (!country.states) continue;
  
  for (const state of country.states) {
    const stateName = state.name;
    
    if (!state.cities) continue;
    
    for (const city of state.cities) {
      cities.push({
        city: city.name,      // 城市
        state: stateName,     // 州/省
        country: countryName, // 国家
      });
    }
  }
}

console.log(`共提取 ${cities.length} 个城市`);

// 按城市名称排序
cities.sort((a, b) => a.city.localeCompare(b.city));

// 保存
const outputJson = JSON.stringify(cities);
fs.writeFileSync(outputPath, outputJson, 'utf8');

const fileSizeKB = (Buffer.byteLength(outputJson, 'utf8') / 1024).toFixed(2);
const fileSizeMB = (Buffer.byteLength(outputJson, 'utf8') / 1024 / 1024).toFixed(2);

console.log('');
console.log('=================================');
console.log(`输出文件: ${outputPath}`);
console.log(`城市数量: ${cities.length}`);
console.log(`文件大小: ${fileSizeKB} KB (${fileSizeMB} MB)`);
console.log('=================================');
console.log('');
console.log('完成！');
