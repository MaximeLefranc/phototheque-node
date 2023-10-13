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
  console.log(__dirname);
  res.render('albums', data);
};

AlbumController.album = async (req, res) => {
  const { id } = req.params;
  try {
    const album = await Album.findById(id);
    res.render('album', { title: 'Album', album });
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
  const { image } = req.files;
  try {
    const album = await Album.findById(id);
    if (image) {
      const localPathToFolder = join(__dirname, '../public/uploads', id);
      if (!fs.existsSync(localPathToFolder)) {
        fs.mkdirSync(localPathToFolder);
      }
      const localPathToImage = join(localPathToFolder, image.name);
      await image.mv(localPathToImage);
      album.images.push(image.name);
      await album.save();
    }
  } catch (err) {
    req.flash(
      'error',
      "Une erreur s'est produite à l'insertion de votre photo. Merci de réessayer ultérieurement."
    );
    res.redirect('/albums');
  }
  res.redirect(`/albums/${id}`);
};

AlbumController.createAlbumForm = (req, res) => {
  const data = {
    title: 'Nouvel album',
    errors: req.flash('error'),
  };
  res.render('new-album', data);
};

AlbumController.createAlbum = async (req, res) => {
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
