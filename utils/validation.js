exports.limitPage = (limit, p) => {
  if (!Number(limit) || !Number(p) || limit % 1 !== 0 || p % 1 !== 0)
    return Promise.reject({
      status: 400,
      message: "Limit/Page must be a non-decimal integer",
    });
};
