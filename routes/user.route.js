const express = require('express');
const {
    getUserBySiteId,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/user.controller');

const router = express.Router();

router.get('/:siteId', getUserBySiteId);
router.post('/', createUser);
router.patch('/:siteId', updateUser);
router.delete('/:siteId', deleteUser);

module.exports = router;
