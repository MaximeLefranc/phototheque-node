import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import fileUpload from 'express-fileupload';
import flash from 'connect-flash';
import path, { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import albumRouter from './routes/album.js';

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/phototheque');

app.set('trust proxy', 1);
app.use(
  session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));
app.use('/static', express.static(join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use('/albums', albumRouter);

app.get('/', (req, res) => {
  res.redirect('/albums');
});

// Not Found 404
app.use((req, res) => {
  res.status(404);
  res.send('Pange non trouvée | Not found error 404');
});

// Error 500 catched from the wrapper function catchAsync
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
  res.send('Erreur interne du serveur');
});

app.listen(port, () => {
  console.log(`Le serveur est lancé et il écoute sur le port ${port}`);
});
