/*eslint-disable */
const httpStatus = require("http-status");
const Airdrop = require("../models/airdrop.model");

/**
 * get user Airdrops
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    let { page, perPage } = req.query;
    page = page ? Number(page) : 1;
    perPage = perPage ? Number(perPage) : 100;
    const userId = req.user._id;

    const airdropCount = await Airdrop.countAirdrops({ userId });

    const airdrops = await Airdrop.list({ userId: userId });
    const transformedAirdrops = airdrops.map(airdrop =>
      airdrop.transform()
    );

    res.status(httpStatus.OK);
    res.json({
      data: transformedAirdrops,
      page: page,
      totalPages: Math.ceil(airdropCount / perPage)
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST);
  }
};
