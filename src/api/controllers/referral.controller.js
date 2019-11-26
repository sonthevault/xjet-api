/*eslint-disable */
const httpStatus = require("http-status");
const Referral = require("../models/referral.model");

/**
 * get user referrals
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    let { page, perPage } = req.query;
    page = page ? Number(page) : 1;
    perPage = perPage ? Number(perPage) : 100;
    const userId = req.user._id;

    const referralCount = await Referral.countReferrals({ userId });

    const referrals = await Referral.list({ userId: userId });
    const transformedReferrals = referrals.map(referral =>
      referral.transform()
    );

    res.status(httpStatus.OK);
    res.json({
      data: transformedReferrals,
      page: page,
      totalPages: Math.ceil(referralCount / perPage)
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST);
  }
};
