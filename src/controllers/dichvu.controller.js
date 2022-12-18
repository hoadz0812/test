const { Op } = require('sequelize');
const { ErrorCodes } = require('../helpers/constants');
const { responseWithError } = require('../helpers/response-messages');
const { DichVu } = require('../models');

async function getAllController(req, res) {
    const dichvu = await DichVu.findAll();
    return res.json(dichvu);
}

async function createDichVuController(req, res) {
    // const dichvu = await DichVu.create(req.body);
    // return res.json(dichvu);
    const { madv } = req.body;
    const dichvu = await DichVu.findOne({
        where: {
            madv,
        },
    });

    if (dichvu) {
        return res
            .status(ErrorCodes.ERROR_CODE_INVALID_PARAMETER)
            .send(
                responseWithError(
                    ErrorCodes.ERROR_CODE_INVALID_PARAMETER,
                    'Ma DV da ton tai',
                ),
            );
    }

    const DVMoi = await DichVu.create({
        ...req.body,
        madv,
    });
    return res.json(DVMoi);
}

async function updateDichVuController(req, res) {
    const { id } = req.params;
    const {
        madv, tendv, dongia, mota,
    } = req.body;
    const dichvu = await DichVu.findOne({
        where: { id },
    });
    if (!dichvu) {
        return res
            .status(ErrorCodes.ERROR_CODE_UNAUTHORIZED)
            .send(
                responseWithError(
                    ErrorCodes.ERROR_CODE_UNAUTHORIZED,
                    'Invalid payload',
                ),
            );
    }

    const dichvutt = await DichVu.findOne({
        where: {
            madv,
            id: {
                [Op.not]: id,
            },
        },
    });

    if (dichvutt) {
        return res
            .status(ErrorCodes.ERROR_CODE_INVALID_PARAMETER)
            .send(
                responseWithError(
                    ErrorCodes.ERROR_CODE_INVALID_PARAMETER,
                    'Ma DV da ton tai',
                ),
            );
    }
    dichvu.madv = madv;
    dichvu.tendv = tendv;
    dichvu.dongia = dongia;
    dichvu.mota = mota;

    dichvu.save();
    return res.json(dichvu);
}

async function findDichVubyIDController(req, res) {
    const { id } = req.params;
    const dichvu = await DichVu.findOne({
        where: { id },
    });
    if (!dichvu) {
        return res
            .status(ErrorCodes.ERROR_CODE_INVALID_PARAMETER)
            .send(
                responseWithError(
                    ErrorCodes.ERROR_CODE_INVALID_PARAMETER,
                    'Khong ton tai id',
                ),
            );
    }

    return res.json(dichvu);
}

async function deleteDichVubyIDController(req, res) {
    const { id } = req.params;
    const dichvu = await DichVu.findOne({
        where: { id },
    });
    if (!dichvu) {
        return res
            .status(ErrorCodes.ERROR_CODE_INVALID_PARAMETER)
            .send(
                responseWithError(
                    ErrorCodes.ERROR_CODE_INVALID_PARAMETER,
                    'Khong ton tai id',
                ),
            );
    }
    dichvu.destroy();
    return res.json(dichvu);
}

async function findDichVuByNameController(req, res) {
    const { tendv } = req.query;
    const dichvu = await DichVu.findAll({
        where: {
            tendv: {
                [Op.like]: `%${tendv}%`,
            },
        },
    });
    console.log(dichvu);
    return res.json(dichvu);
}
module.exports = {
    getAllController,
    createDichVuController,
    updateDichVuController,
    findDichVubyIDController,
    deleteDichVubyIDController,
    findDichVuByNameController,
};
