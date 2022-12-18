const { ErrorCodes } = require('../helpers/constants');
const { responseWithError } = require('../helpers/response-messages');
const { TaiKhoan, NhanVien } = require('../models');
const {
    comparePassword,
    createAccessToken,
    decodeToken,
    createRefreshToken,
    hashPassword,
} = require('../services/taikhoan.service');

async function loginController(req, res) {
    const { username, password } = req.body;
    const existed = await TaiKhoan.findOne({
        where: {
            username,
        },
    });
    if (!existed) {
        return res
            .status(ErrorCodes.ERROR_CODE_UNAUTHORIZED)
            .send(
                responseWithError(
                    ErrorCodes.ERROR_CODE_UNAUTHORIZED,
                    'Invalid username',
                ),
            );
    }
    if (!comparePassword(password, existed.password)) {
        return res
            .status(ErrorCodes.ERROR_CODE_UNAUTHORIZED)
            .send(
                responseWithError(
                    ErrorCodes.ERROR_CODE_UNAUTHORIZED,
                    'Invalid password',
                ),
            );
    }
    return res.status(ErrorCodes.ERROR_CODE_SUCCESS).send({
        accessToken: createAccessToken({
            username,
            userId: existed.id,
        }),
        expiresIn: new Date(Date.now() + 3600 * 1000).getTime(),
        refreshToken: createRefreshToken({
            username,
            userId: existed.id,
        }),
        refreshExpiresIn: new Date(Date.now() + 3600 * 1000 * 24 * 7).getTime(),
    });
}

async function refreshTokenController(req, res) {
    const { refreshToken } = req.body;
    try {
        const decoded = decodeToken(refreshToken, process.env.JWT_RF_SECRET);
        console.log(decoded);
        const existed = await TaiKhoan.findOne({
            where: {
                username: decoded.username,
                id: decoded.userId,
            },
        });
        if (!existed) {
            return res
                .status(ErrorCodes.ERROR_CODE_UNAUTHORIZED)
                .send(
                    responseWithError(
                        ErrorCodes.ERROR_CODE_UNAUTHORIZED,
                        'Invalid payload',
                    ),
                );
        }
        return res.status(ErrorCodes.ERROR_CODE_SUCCESS).send({
            accessToken: createAccessToken({
                username: decoded.username,
                userId: decoded.userId,
            }),
            expiresIn: new Date(Date.now() + 3600 * 1000).getTime(),
        });
    } catch (error) {
        return res
            .status(ErrorCodes.ERROR_CODE_UNAUTHORIZED)
            .send(
                responseWithError(
                    ErrorCodes.ERROR_CODE_UNAUTHORIZED,
                    'Invalid refresh token',
                ),
            );
    }
}

async function changePasswordController(req, res) {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
        return res
            .status(ErrorCodes.ERROR_CODE_UNAUTHORIZED)
            .send(
                responseWithError(
                    ErrorCodes.ERROR_CODE_UNAUTHORIZED,
                    'Invalid access token',
                ),
            );
    }
    try {
        const decoded = decodeToken(accessToken, process.env.JWT_AT_SECRET);
        const existed = await TaiKhoan.findOne({
            where: {
                username: decoded.username,
                id: decoded.userId,
            },
        });
        if (!existed) {
            return res
                .status(ErrorCodes.ERROR_CODE_UNAUTHORIZED)
                .send(
                    responseWithError(
                        ErrorCodes.ERROR_CODE_UNAUTHORIZED,
                        'Invalid payload',
                    ),
                );
        }
        const { currentPassword, newPassword } = req.body;
        if (!comparePassword(currentPassword, existed.password)) {
            return res
                .status(ErrorCodes.ERROR_CODE_UNAUTHORIZED)
                .send(
                    responseWithError(
                        ErrorCodes.ERROR_CODE_UNAUTHORIZED,
                        'Invalid current password',
                    ),
                );
        }
        existed.password = hashPassword(newPassword);
        await existed.save();
        return res.status(ErrorCodes.ERROR_CODE_SUCCESS).send({
            message: 'Password changed successfully',
        });
    } catch (error) {
        return res
            .status(ErrorCodes.ERROR_CODE_UNAUTHORIZED)
            .send(
                responseWithError(
                    ErrorCodes.ERROR_CODE_UNAUTHORIZED,
                    'Invalid access token',
                ),
            );
    }
}

async function getAllController(req, res) {
    const taikhoan = await TaiKhoan.findAll();
    return res.json(taikhoan);
}

async function createTaiKhoanController(req, res) {
    const { username, password, nhanvienId } = req.body;
    const [nhanvien, nhanvienHasTaikhoan, taikhoanHasUsername] =
        await Promise.all([
            NhanVien.findOne({
                where: {
                    id: nhanvienId,
                },
            }),
            TaiKhoan.findOne({
                where: {
                    nhanvienId,
                },
            }),
            TaiKhoan.findOne({
                where: {
                    username,
                },
            }),
        ]);
    if (!nhanvien) {
        return res
            .status(ErrorCodes.ERROR_CODE_INVALID_PARAMETER)
            .json(
                responseWithError(
                    ErrorCodes.ERROR_CODE_INVALID_PARAMETER,
                    'Nhanvien khong ton tai',
                ),
            );
    }
    if (nhanvienHasTaikhoan) {
        return res
            .status(ErrorCodes.ERROR_CODE_INVALID_PARAMETER)
            .json(
                responseWithError(
                    ErrorCodes.ERROR_CODE_INVALID_PARAMETER,
                    'Nhanvien nay da co tai khoan roi',
                ),
            );
    }
    if (taikhoanHasUsername) {
        return res
            .status(ErrorCodes.ERROR_CODE_INVALID_PARAMETER)
            .json(
                responseWithError(
                    ErrorCodes.ERROR_CODE_INVALID_PARAMETER,
                    'Username da ton tai',
                ),
            );
    }

    await TaiKhoan.create({
        username,
        password: hashPassword(password),
        nhanvienId,
    });

    return res.json({
        message: 'Tao tai khoan thanh cong!',
    });
}

module.exports = {
    loginController,
    refreshTokenController,
    changePasswordController,
    getAllController,
    createTaiKhoanController,
};
