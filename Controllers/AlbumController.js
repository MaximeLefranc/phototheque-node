import Album from '../Models/Album.js';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AlbumController = {};

AlbumController.albums = async (req, res) => {
  const albums = await Album.find();
  const data = {
    title: 'Mes Albums',
    albums,
    errors: req.flash('error'),
  };
  res.render('albums', data);
};

AlbumController.album = async (req, res) => {
  console.log('je suis dans la mauvaise méthode');
  const { id } = req.params;
  try {
    const album = await Album.findById(id);
    const data = {
      title: `Mon album: ${album.title}`,
      album,
      errors: req.flash('error'),
    };
    res.render('album', data);
  } catch (err) {
    req.flash(
      'error',
      "l'album avec l'id entré n'existe pas dans la base de donnés"
    );
    res.redirect('/albums');
  }
};

AlbumController.addImage = async (req, res) => {
  const { id } = req.params;
  const album = await Album.findById(id);
  if (!req?.files?.image) {
    req.flash('error', 'Aucun fichier sélectionné');
    res.redirect(`/albums/${id}`);
    return;
  }
  const { image } = req.files;
  if (
    image.mimetype !== 'image/jpeg' &&
    image.mimetype !== 'image/png' &&
    image.mimetype !== 'image/jpg'
  ) {
    req.flash('error', 'Seul les fichiers JPEG, PNG ou JPG sont acceptés.');
    res.redirect(`/albums/${id}`);
    return;
  }
  const localPathToFolder = join(__dirname, '../public/uploads', id);
  if (!fs.existsSync(localPathToFolder)) {
    fs.mkdirSync(localPathToFolder, { recursive: true });
  }
  const localPathToImage = join(localPathToFolder, image.name);
  await image.mv(localPathToImage);
  album.images.push(image.name);
  await album.save();

  res.redirect(`/albums/${id}`);
};

AlbumController.createAlbumForm = (req, res) => {
  console.log('je suis dans la bonne méthode');
  const data = {
    title: 'Nouvel album',
    errors: req.flash('error'),
  };
  res.render('new-album', data);
};

AlbumController.createAlbum = async (req, res) => {
  console.log('je suis dans la mauvaise méthode');
  const { albumTitle } = req.body;
  try {
    if (!albumTitle) {
      req.flash(
        'error',
        "Le titre ne doit pas être vide, merci d'indiquer un titre."
      );
      res.redirect('/albums/create');
      return;
    }
    await Album.create({
      title: albumTitle,
    });
    res.redirect('/albums');
  } catch (err) {
    req.flash('error', "Erreur lors de la création de l'album.");
    res.redirect('/albums/create');
  }
};

export default AlbumController;
