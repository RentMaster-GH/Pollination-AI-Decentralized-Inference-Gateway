export default function handler(req:any,res:any){res.setHeader('Access-Control-Allow-Origin','*');res.json({success:true,node:{id:'node-'+Date.now(),name:req.body?.name||'New Node'}});}
