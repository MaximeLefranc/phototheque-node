import { Router } from 'express';
import AlbumController from '../Controllers/AlbumController.js';

const albumRouter = Router();

albumRouter.get('/albums', AlbumController.albums);
albumRouter.get('/albums/:id', AlbumController.album);
albumRouter.post('/albums/:id', AlbumController.addImage);
albumRouter.get('/albums/create', AlbumController.createAlbumForm);
albumRouter.post('/albums/create', AlbumController.createAlbum);

export default albumRouter;
