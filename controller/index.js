'use strict';

const   express     = require('express'),
        router      = express.Router(),
        users       = require('../domain/interactors/service-user');

router.get('/users/', users.GetAll);
router.get('/users/:id', users.GetById);
router.post('/users/', users.Store);
router.delete('/users/:id', users.DeleteById);
router.patch('/users/:id', users.UpdateById);

module.exports = router;