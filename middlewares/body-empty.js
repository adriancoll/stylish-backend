/**
 * Validate if body is not empty
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const { request, response } = require("express");
const { isEmpty } = require("lodash");
const { error } = require("../helpers");

module.isBodyEmpty = (req = request, res = response, next) => {
  if (isEmpty(req.body)) {
    return res.status(400).json(
      error("No se han enviado datos en el body", res.statusCode)
    );
  }

  next();
};
