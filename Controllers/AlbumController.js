import Album from '../Models/Album.js';
import { rimrafSync } from 'rimraf';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import catchAsync from '../helpers/catchAsync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AlbumController = {};

AlbumController.albums = catchAsync(async (req, res) => {
  const albums = await Album.find();
  const data = {
    title: 'Mes Albums',
    albums,
    errors: req.flash('error'),
  };
  res.render('albums', data);
});

AlbumController.album = catchAsync(async (req, res) => {
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
});

AlbumController.addImage = catchAsync(async (req, res) => {
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
});

AlbumController.createAlbumForm = (req, res) => {
  const data = {
    title: 'Nouvel album',
    errors: req.flash('error'),
  };
  res.render('new-album', data);
};

AlbumController.createAlbum = catchAsync(async (req, res) => {
  const { albumTitle } = req.body;
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
});

AlbumController.deleteImage = catchAsync(async (req, res) => {
  const { id, index } = req.params;
  const album = await Album.findById(id);
  const image = album.images[index];
  if (!image) {
    res.redirect(`/albums/${id}`);
    return;
  }
  album.images.splice(index, 1);
  await album.save();
  const imagePath = join(__dirname, '../public/uploads/', id, image);
  fs.unlinkSync(imagePath);
  res.redirect(`/albums/${id}`);
});

AlbumController.deleteAlbum = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Album.findByIdAndDelete(id);
  const folderPath = join(__dirname, '../public/uploads/', id);
  rimrafSync(folderPath);
  res.redirect('/albums');
});

export default AlbumController;
