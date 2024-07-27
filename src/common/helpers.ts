export const successResponse = (data, message, code) => {
  return {
    statusCode: code,
    data: data,
    message: message,
  };
};
