import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import router from './router';

const app = express();
app.use(express.json())
app.use(router);

app.listen(3000, () => {
    console.log("🚀 Server is up on http://localhost:3000")
})