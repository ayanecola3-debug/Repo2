import {getStore} from '@netlify/blobs';
import {NextResponse} from 'next/server';
export const runtime='nodejs';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;if(!/^[a-f0-9]{16}$/.test(id))return NextResponse.json({error:'Not found'},{status:404});const data=await getStore('birthday-experiences').get(id,{type:'json'});if(!data)return NextResponse.json({error:'Not found'},{status:404});return NextResponse.json(data)}catch{return NextResponse.json({error:'Not found'},{status:404})}}