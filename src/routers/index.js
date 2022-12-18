const { Router } = require('express');
const { authMiddleware } = require('../middlewares/taikhoan.middleware');
const nhanvienRouter = require('./nhanvien.routes');
const taikhoanRouter = require('./taikhoan.routes');
const dichvuRouter = require('./dichvu.routes');
const khachhangRouter = require('./khachhang.routes');
const phongRouter = require('./phong.routes');
const dichvusdRouter = require('./dichvusudung.routes');
const hddichvuRouter = require('./hddichvu.routes');
const hoadonRouter = require('./hoadon.routes');

const router = Router();

router.use('/status', (req, res) => {
    res.send({
        message: 'Hello World',
    });
});
router.use('/taikhoan', taikhoanRouter);
router.use('/nhanvien', authMiddleware, nhanvienRouter);
router.use('/dichvu', authMiddleware, dichvuRouter);
router.use('/khachhang', authMiddleware, khachhangRouter);
router.use('/phong', authMiddleware, phongRouter);
router.use('/dichvusd', authMiddleware, dichvusdRouter);
router.use('/hddichvu', authMiddleware, hddichvuRouter);
router.use('/hoadon', authMiddleware, hoadonRouter);

module.exports = router;
