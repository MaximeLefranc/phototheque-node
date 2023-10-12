const AlbumController = {};

AlbumController.createAlbumForm = (req, res) => {
  res.render('new-album', { title: 'Nouvel album' });
};

AlbumController.createAlbum = (req, res) => {
  res.send('OK');
};

export default AlbumController;
