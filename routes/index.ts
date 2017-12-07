import * as express from 'express';
import {getRelics, getItems} from "../QRPInstanceManager";

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
        res.render('index', { title: 'QRP' });
});

export = router;