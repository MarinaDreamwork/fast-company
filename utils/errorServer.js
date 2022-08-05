const errorServer = (res) => {
  res.status(500).json({
    message: 'На сервере произошла ошибка. Попробуйте позже.'
  })
};

module.exports = errorServer;