module.exports = (cb) => async (req, res, next) =>{
  try {
    await cb();
  } catch (err) {
    next(err);
  }
}
