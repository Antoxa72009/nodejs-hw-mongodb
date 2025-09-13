import createHttpError from "http-errors";

export const notFoundHandler = (req, res, next) => {
  next(createHttpError(404, "Resource not found"));
};

export const errorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: "Something went wrong",
    data: err.message,
  });
};