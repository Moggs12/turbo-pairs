import {mkdir,copyFile,cp,readFile,writeFile,readdir} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','style.css']) await copyFile(file,`dist/${file}`);
await cp('src','dist/src',{recursive:true});
await cp('public/themes/hot-wheels','dist/themes/hot-wheels',{recursive:true});
await cp('public/icons','dist/icons',{recursive:true});
await copyFile('public/manifest.webmanifest','dist/manifest.webmanifest');
console.log('Built Hot Wheels release in dist');

// Version deployed modules so a cached import cannot mix old and new releases.
const {version}=JSON.parse(await readFile('package.json','utf8'));
const index=await readFile('dist/index.html','utf8');
await writeFile('dist/index.html',index.replace("script.src='src/app.js'",`script.src='src/app.js?v=${version}'`));
async function versionModules(directory){
 for(const entry of await readdir(directory,{withFileTypes:true})){
  const path=`${directory}/${entry.name}`;
  if(entry.isDirectory())await versionModules(path);
  else if(entry.name.endsWith('.js')){
   const source=await readFile(path,'utf8');
   await writeFile(path,source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g,(_,quote,url)=>`from ${quote}${url}?v=${version}${quote}`));
  }
 }
}
await versionModules('dist/src');
