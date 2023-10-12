import { Router } from 'express';
import AlbumController from '../Controllers/AlbumController.js';

const albumRouter = Router();

albumRouter.get('/albums/create', AlbumController.createAlbumForm);
albumRouter.post('/albums/create', AlbumController.createAlbum);

export default albumRouter;
