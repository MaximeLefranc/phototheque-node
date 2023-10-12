import Album from '../Models/Album.js';

const AlbumController = {};

AlbumController.createAlbumForm = (req, res) => {
  res.render('new-album', { title: 'Nouvel album' });
};

AlbumController.createAlbum = async (req, res) => {
  const { albumTitle } = req.body;
  try {
    await Album.create({
      title: albumTitle,
    });
    res.redirect('/');
  } catch (err) {
    res.redirect('/albums/create');
  }
};

export default AlbumController;
