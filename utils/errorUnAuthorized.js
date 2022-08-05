const errorUnAuthorized = (response) => {
  return response.status(401).send({
    error: {
      message: 'Unauthorized'
    }
  })
};

module.exports = errorUnAuthorized;