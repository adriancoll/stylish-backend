/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {object | array} results
 * @param   {number} statusCode @default 200
 */
exports.success = (message, results, statusCode = 200) => ({
    message,
    error: false,
    code: statusCode,
    results,
})

/**
 * @desc    Send any error response
 *
 * @param   {string} message
 * @param   {number} statusCode
 */
exports.error = (message, statusCode, errors = null) => {
    // List of common HTTP request code
    const codes = [200, 201, 400, 401, 404, 403, 422, 500]

    // Get matched code
    const findCode = codes.find((code) => code == statusCode)

    if (!findCode) statusCode = 500
    else statusCode = findCode

    return {
        message,
        code: statusCode,
        error: true,
        ...errors,
    }
}
