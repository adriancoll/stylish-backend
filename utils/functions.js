/**
 * Removes duplicates form array of any type
 * @param {*} array 
 * @returns 
 */
module.exports.clearDuplicates = array => [...new Set(array)]