// module.exports = (fn) => {
//   return function (req, res, next) {
//     if (typeof fn !== "function") {
//       return next(new Error("wrapAsync received non-function"));
//     }
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };
// };

module.exports = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};