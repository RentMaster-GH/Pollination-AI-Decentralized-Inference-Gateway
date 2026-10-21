import express from 'express';
const app = express();
app.get('/api/health', (_,res)=> res.json({status:'ok', gateway:'pollination-ai'}));
app.listen(3000, ()=> console.log('Gateway running on 3000'));
