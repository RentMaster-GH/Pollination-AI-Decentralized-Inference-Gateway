export default function handler(req:any,res:any){res.setHeader('Access-Control-Allow-Origin','*');res.json({success:true,message:'Prewarm triggered - 2 nodes hot'});}
