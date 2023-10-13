import { Router } from 'express';
import AlbumController from '../Controllers/AlbumController.js';

const albumRouter = Router();

albumRouter.get('/', AlbumController.albums);
albumRouter.post('/create', AlbumController.createAlbum);
albumRouter.get('/create', AlbumController.createAlbumForm);
albumRouter.get('/:id', AlbumController.album);
albumRouter.post('/:id', AlbumController.addImage);

export default albumRouter;
