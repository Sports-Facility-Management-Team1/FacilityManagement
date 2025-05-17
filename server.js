import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';


import userRoutes from './routes/users.js';
import notificationRoutes from './routes/notifications.js';
import bookingRoutes from './routes/bookings.js';
import issuesRoutes from './routes/issues.js';

dotenv.config();

console.log('Server is starting');
// const serviceAccountPath = path.resolve('../serviceAccountKey.json');
// const serviceAccountPath = path.resolve('./serviceAccountKey.json');



// if (!fs.existsSync(serviceAccountPath)) {
//   console.error(`serviceAccountKey.json not found at ${serviceAccountPath}`);
//   process.exit(1);
// }


// const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

const app = express();
import { fileURLToPath } from 'url';
import { get } from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: [
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5501',
    'http://localhost:3000'
  ],
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight


app.use(express.static(path.join(__dirname, 'public'))); 

app.use(express.json());

app.use(bodyParser.json());


//Routes--------------------------------------------------------------------------------------------

app.use('/', userRoutes(db, admin));

app.use('/', notificationRoutes(db, admin));

app.use('/', bookingRoutes(db, admin));

app.use('/', issuesRoutes(db, admin));


//Public Pages---------------------------------------------------------------------------------------

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register_page.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'login_page.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'login_page.html'));
});

app.use(express.static(__dirname));


//Error Handling--------------------------------------------------------------------------------------------

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

const PORT = process.env.PORT||3000;
// if (!process.env.PORT) {
//   console.error('PORT environment variable not set!');
//   process.exit(1);
// }
app.listen(PORT, () => {
  console.log(` Server running on port: ${PORT} :http://localhost:3000`);
});

  
