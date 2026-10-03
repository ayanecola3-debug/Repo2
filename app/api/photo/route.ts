import {getStore} from '@netlify/blobs';
import {NextResponse} from 'next/server';
export const runtime='nodejs';
const MAX=4*1024*1024;
export async function POST(req:Request){try{const type=req.headers.get('content-type')||'';if(!/^image\/(jpeg|png|webp|gif)$/.test(type))return NextResponse.json({error:'Invalid photo type.'},{status:400});const buf=await req.arrayBuffer();if(!buf.byteLength)return NextResponse.json({error:'Empty photo.'},{status:400});if(buf.byteLength>MAX)return NextResponse.json({error:'This photo is too large.'},{status:413});const id=crypto.randomUUID().replaceAll('-','').slice(0,16);await getStore('birthday-photos').set(id,buf,{metadata:{type}});return NextResponse.json({id})}catch{return NextResponse.json({error:'Could not upload the photo. Please try again.'},{status:500})}}
