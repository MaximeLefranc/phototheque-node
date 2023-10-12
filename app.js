import express from 'express';
import mongoose from 'mongoose';
import path, { join } from 'path';
import { fileURLToPath } from 'url';

import albumRouter from './routes/album.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/phototheque');

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));
app.use('/static', express.static(join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', albumRouter);

app.get('/', (req, res) => {
  res.render('album', { title: 'Photothèque' });
});

app.use((req, res) => {
  res.status(404);
  res.send('Pange non trouvée | Not found error 404');
});

app.listen(port, () => {
  console.log(`Le serveur est lancé et il écoute sur le port ${port}`);
});
