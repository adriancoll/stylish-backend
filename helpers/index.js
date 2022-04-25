const file         = require("./file-upload");
const paginator    = require("./paginator");
const dbvalidators = require("./paginator");
const googleverify = require("./paginator");
const jwtgenerator = require("./generate-jwt");
const responses    = require("./api-response");

module.exports = {
    ...file,
    ...paginator,
    ...dbvalidators,
    ...googleverify,
    ...jwtgenerator,
    ...responses,
};
