const debug = require("../utils/debug");

const paginatedResults = (SchemaModel) => {
  return async (req, res, next) => {
    const { options } = req.body;

    if (!options) {
      return next();
    }

    const page = parseInt(options.page);
    const limit = parseInt(options.limit);
    const skipIndex = (page - 1) * limit;

    try {
      const [results, total] = await Promise.all([
        SchemaModel.find({ status: true })
          .sort({ _id: 1 })
          .limit(limit)
          .skip(skipIndex)
          .exec(),
        SchemaModel.count({ status: true }),
      ]);

      res.paginatedResults = {results, total};
      
      next();
    } catch (e) {
      debug(`Ha habido un error en la paginación => ${e.message}`, "error");
      res.status(500).json({ message: "Error Occured", e });
    }
  };
};

module.exports = { paginatedResults };
