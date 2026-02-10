
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/config/mongodb.js';
import authrouter from './src/route/authroute.js';
import router from './src/route/reportroute.js';



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
connectDB();

//auth
app.use("/api/auth",authrouter);
app.use("/api/reports", router);


app.use('/',(req,res)=>{
  res.send("Hello world");
})

// app.get("/", (req, res) => {
//   res.json({ message: "API running" });
// });


const PORT=3000;



app.listen(PORT,'0.0.0.0',()=>{
  console.log(`http://localhost:${PORT}`);
})

