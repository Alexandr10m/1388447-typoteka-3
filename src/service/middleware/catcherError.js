'use strict';

module.exports = (cb) => async (req, res, next) =>{
  try {
    await cb(req, res);
  } catch (err) {
    next(err);
  }
};
