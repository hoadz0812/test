const { Op } = require('sequelize');
const { ErrorCodes } = require('../helpers/constants');
const { responseWithError } = require('../helpers/response-messages');
const { KhachHang } = require('../models');

async function getAllController(req, res) {
    const khachhang = await KhachHang.findAll();
    return res.json(khachhang);
}

async function createKhachHangController(req, res) {
    // const khachhang = await KhachHang.create({
    // ...req.body,
    // cccd: req.body.cccd || null,
    // hochieu: req.body.hochieu || null,
    // });
    // return res.json(khachhang);

    const { makh } = req.body;
    const khachhang = await KhachHang.findOne({
        where: {
            makh,
        },
    });

    if (khachhang) {
        return res
            .status(ErrorCodes.ERROR_CODE_INVALID_PARAMETER)
            .send(
                responseWithError(
                    ErrorCodes.ERROR_CODE_INVALID_PARAMETER,
                    'Ma KH da ton tai',
                ),
            );
    }

    const khachhangMoi = await KhachHang.create({
        ...req.body,
        cccd: req.body.cccd || null,
        hochieu: req.body.hochieu || null,
    });
    return res.json(khachhangMoi);
}

async function updateKhachHangController(req, res) {
    const { id } = req.params;
    const { makh, tenkh, diachi, dob, sdt, quoctich, hochieu, cccd, gender } =
        req.body;
    const khachhang = await KhachHang.findOne({
        where: { id },
    });
    if (!khachhang) {
        return res
            .status(ErrorCodes.ERROR_CODE_UNAUTHORIZED)
            .send(
                responseWithError(
                    ErrorCodes.ERROR_CODE_UNAUTHORIZED,
                    'Invalid payload',
                ),
            );
    }
    const khachhangtt = await KhachHang.findOne({
        where: {
            makh,
            id: {
                [Op.not]: id,
            },
        },
    });
    if (khachhangtt) {
        return res
            .status(ErrorCodes.ERROR_CODE_INVALID_PARAMETER)
            .send(
                responseWithError(
                    ErrorCodes.ERROR_CODE_INVALID_PARAMETER,
                    'Ma KH ton tai',
                ),
            );
    }
    khachhang.makh = makh;
    khachhang.tenkh = tenkh;
    khachhang.diachi = diachi;
    khachhang.dob = dob;
    khachhang.sdt = sdt;
    khachhang.quoctich = quoctich;
    khachhang.hochieu = hochieu || null;
    khachhang.cccd = cccd || null;
    khachhang.gender = gender;

    khachhang.save();
    return res.json(khachhang);
}

async function findKhachHangbyIDController(req, res) {
    const { id } = req.params;
    const khachhang = await KhachHang.findOne({
        where: { id },
    });
    if (!khachhang) {
        return res
            .status(ErrorCodes.ERROR_CODE_INVALID_PARAMETER)
            .send(
                responseWithError(
                    ErrorCodes.ERROR_CODE_INVALID_PARAMETER,
                    'Khong ton tai id',
                ),
            );
    }

    return res.json(khachhang);
}

async function deleteKhachHangbyIDController(req, res) {
    const { id } = req.params;
    const khachhang = await KhachHang.findOne({
        where: { id },
    });
    if (!khachhang) {
        return res
            .status(ErrorCodes.ERROR_CODE_INVALID_PARAMETER)
            .send(
                responseWithError(
                    ErrorCodes.ERROR_CODE_INVALID_PARAMETER,
                    'Khong ton tai id',
                ),
            );
    }
    khachhang.destroy();
    return res.json(khachhang);
}

async function findKhachHangByNameController(req, res) {
    const { tenkh } = req.query;
    const khachhang = await KhachHang.findAll({
        where: {
            tenkh: {
                [Op.like]: `%${tenkh}%`,
            },
        },
    });
    console.log(khachhang);
    return res.json(khachhang);
}

module.exports = {
    getAllController,
    createKhachHangController,
    updateKhachHangController,
    findKhachHangbyIDController,
    deleteKhachHangbyIDController,
    findKhachHangByNameController,
};
