import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','style.css']) await copyFile(file,`dist/${file}`);
await cp('src','dist/src',{recursive:true});
await cp('public/themes/hot-wheels','dist/themes/hot-wheels',{recursive:true});
console.log('Built Hot Wheels release in dist');
