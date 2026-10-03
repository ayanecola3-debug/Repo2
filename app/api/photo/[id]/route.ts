import {getStore} from '@netlify/blobs';
export const runtime='nodejs';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;if(!/^[a-f0-9]{16}$/.test(id))return new Response('Not found',{status:404});const res=await getStore('birthday-photos').getWithMetadata(id,{type:'arrayBuffer'});if(!res)return new Response('Not found',{status:404});return new Response(res.data,{headers:{'Content-Type':String(res.metadata?.type||'image/jpeg'),'Cache-Control':'public, max-age=31536000, immutable'}})}catch{return new Response('Not found',{status:404})}}
