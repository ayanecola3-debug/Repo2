import {NextResponse} from 'next/server';
import {readFileSync,existsSync} from 'fs';
import {join} from 'path';
export const runtime='nodejs';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;if(!/^[a-f0-9]{16}$/.test(id))return NextResponse.json({error:'Not found'},{status:404});const STORAGE_DIR=join(process.cwd(),'public','experiences');const filePath=join(STORAGE_DIR,`${id}.json`);if(!existsSync(filePath))return NextResponse.json({error:'Not found'},{status:404});const data=JSON.parse(readFileSync(filePath,'utf-8'));return NextResponse.json(data)}catch{return NextResponse.json({error:'Not found'},{status:404})}}