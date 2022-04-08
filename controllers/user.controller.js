const { response, request } = require('express');


const userGet = (req = request, res = response) => {

    const {nombre = 'No Name', apikey, page = 1, limit = 10} = req.query;

    res.json({
        ok: true,
        msg: 'get API - controlador',
        nombre,
        apikey,
        page,
        limit
    });
}

const userPost = (req = request, res) => {

    const {nombre, edad} = req.body;

    res.status(201).json({
        ok: true,
        msg: 'post API - controlador',
        nombre,
        edad
    });
}

const userPut = (req = request, res) => {

    const { id } = req.params;

    res.json({
        ok: true,
        msg: 'put API - controlador',
        id
    });
}

const userDelete = (req, res) => {
    res.json({
        ok: true,
        msg: 'delete API - controlador'
    });
}

const userPatch = (req, res) => {
    res.json({
        ok: true,
        msg: 'patch API - controlador'
    });
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete,
    userPatch
}