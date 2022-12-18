const router = require('express').Router();
const {
    getAllController,
    loginController,
    refreshTokenController,
    changePasswordController,
    createTaiKhoanController,
} = require('../controllers/taikhoan.controller');
const {
    validateGetAll,
    loginMiddleware,
    refreshTokenMiddleware,
    changePasswordMiddleware,
    authMiddleware,
    createTaiKhoanMiddleware,
} = require('../middlewares/taikhoan.middleware');

router.route('/').get(validateGetAll, getAllController);

router
    .route('/')
    .post(authMiddleware, createTaiKhoanMiddleware, createTaiKhoanController);

router.route('/login').post(loginMiddleware, loginController);

router
    .route('/refresh-token')
    .post(refreshTokenMiddleware, refreshTokenController);

router
    .route('/password')
    .patch(changePasswordMiddleware, changePasswordController);

module.exports = router;
