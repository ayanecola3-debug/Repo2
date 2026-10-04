import {NextResponse} from 'next/server';
import {readFileSync,existsSync} from 'fs';
import {join} from 'path';
export const runtime='nodejs';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;const STORAGE_DIR=join(process.cwd(),'public','uploads');const filePath=join(STORAGE_DIR,id);if(!existsSync(filePath))return new Response('Not found',{status:404});const ext=id.split('.').pop()||'jpg';const contentType=`image/${ext==='jpg'?'jpeg':ext}`;const buffer=readFileSync(filePath);return new Response(buffer,{headers:{'Content-Type':contentType,'Cache-Control':'public, max-age=31536000, immutable'}})}catch{return new Response('Not found',{status:404})}}
