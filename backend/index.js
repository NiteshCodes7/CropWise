import { app } from './app.js';
import dotenv from 'dotenv';   
import connectDb from './db/index.js';
import './utils/regionalAlert.js';

dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT || 5001;

connectDb()
  .then(() => { 
    console.log('Database connected successfully');
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
})
  })
  .catch((err) => {
    console.log('Database connection failed:', err);
  });
