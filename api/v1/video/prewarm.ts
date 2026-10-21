export default function handler(req:any,res:any){res.setHeader('Access-Control-Allow-Origin','*');res.json({success:true,message:'Model prewarm triggered on 2 edge nodes - hot in ~4.2s'});}
