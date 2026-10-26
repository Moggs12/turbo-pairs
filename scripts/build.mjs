import {mkdir,copyFile,cp,readFile,writeFile,readdir,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const file of ['index.html','style.css']) await copyFile(file,`dist/${file}`);
await cp('src','dist/src',{recursive:true});
// Ship the small WebP copies of the card art. The approved PNG originals stay
// in public/themes/hot-wheels/ but are left out of the release.
await cp('public/themes/hot-wheels/web','dist/themes/hot-wheels/web',{recursive:true});
const deck=JSON.parse(await readFile('public/themes/hot-wheels/deck.json','utf8'));
await writeFile('dist/themes/hot-wheels/deck.json',JSON.stringify({...deck,web:'web/'},null,2));
await cp('public/icons','dist/icons',{recursive:true});
await cp('public/audio','dist/audio',{recursive:true});
await copyFile('public/manifest.webmanifest','dist/manifest.webmanifest');

// Version deployed modules so a cached import cannot mix old and new releases.
const {version}=JSON.parse(await readFile('package.json','utf8'));
const index=await readFile('dist/index.html','utf8');
await writeFile('dist/index.html',index
 .replace("script.src='src/app.js'",`script.src='src/app.js?v=${version}'`)
 .replace('themes/hot-wheels/00-card-back.png','themes/hot-wheels/web/00-card-back.webp'));
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

// Offline support: list every shipped file (except audio, which phones stream)
// and name the cache after a hash of their contents.
async function listFiles(directory){
 const files=[];
 for(const entry of await readdir(directory,{withFileTypes:true})){
  const path=`${directory}/${entry.name}`;
  if(entry.isDirectory())files.push(...await listFiles(path));else files.push(path);
 }
 return files;
}
const shipped=(await listFiles('dist')).map(path=>path.slice('dist/'.length)).filter(path=>!path.startsWith('audio/')).sort();
const hash=createHash('sha256');
for(const path of shipped){hash.update(path);hash.update(await readFile(`dist/${path}`));}
const release=hash.digest('hex').slice(0,12);
const precache=['./',...shipped.filter(path=>path!=='index.html').map(path=>/^src\/.*\.js$/.test(path)?`${path}?v=${version}`:path),'index.html'];
const template=await readFile('scripts/sw-template.js','utf8');
await writeFile('dist/sw.js',template.replace("'__RELEASE__'",JSON.stringify(release)).replace('__PRECACHE__',JSON.stringify(precache,null,1)));
console.log(`Built Hot Wheels release ${release} in dist (${shipped.length} files kept for offline play)`);
