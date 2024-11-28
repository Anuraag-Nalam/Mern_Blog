//custom error handler when we want to throw the error on our own
export const errorHandler = (StatusCode, message) => {
    const error = new Error()
    error.StatusCode = StatusCode
    error.message = message
    return error
}