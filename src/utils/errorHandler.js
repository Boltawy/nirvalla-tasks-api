const asyncHandler = (fn) => {
    return async (req, res, next) => {
        fn(req, res, next).catch((err) => next(err));
    }
}

class responseError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode || 500;
        this.status = `${statusCode}`.startsWith("4") ? "Fail" : "Error";
    }
}

export { asyncHandler, responseError }