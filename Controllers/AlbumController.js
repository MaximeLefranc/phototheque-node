import Album from '../Models/Album.js';

const AlbumController = {};

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
    res.redirect('/');
  } catch (err) {
    req.flash('error', "Erreur lors de la création de l'album.");
    res.redirect('/albums/create');
  }
};

export default AlbumController;
