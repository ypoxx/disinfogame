import sharp from 'sharp';
import fs from 'node:fs';
const dir='../../desinformation-network/public/assets/sheets/';
const ids=['audience_optimiererin','audience_macher','audience_bohemien','audience_besorgte_mitte','audience_zorniger','audience_idealistin','audience_eigenheimer','audience_liberale'];
const S=3, cw=96*S, ch=48*S, cols=2, pad=8;
const W=cols*cw+(cols+1)*pad, H=Math.ceil(ids.length/cols)*(ch+pad)+pad;
const comps=[];
for(let i=0;i<ids.length;i++){const buf=await sharp(dir+ids[i]+'.png').resize(cw,ch,{kernel:'nearest'}).png().toBuffer();const r=Math.floor(i/cols),c=i%cols;comps.push({input:buf,left:pad+c*(cw+pad),top:pad+r*(ch+pad)});}
fs.mkdirSync('runs/aud-check',{recursive:true});
await sharp({create:{width:W,height:H,channels:4,background:{r:0,g:170,b:90,alpha:1}}}).composite(comps).png().toFile('runs/aud-check/audience_contact2.png');
console.log('ok');
