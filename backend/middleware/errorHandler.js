const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.name === 'UnauthorizedError' || err.code === 'INVALID_TOKEN') {
    return res.status(401).json({ success: false, message: 'No autorizado' });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({ success: false, message: err.message || 'No encontrado' });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
};

class AppError extends Error {
  constructor(message, status = 400, name = 'AppError') {
    super(message);
    this.name = name;
    this.status = status;
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404, 'NotFoundError');
  }
}

class ValidationError extends AppError {
  constructor(message = 'Datos inválidos') {
    super(message, 400, 'ValidationError');
  }
}

module.exports = { errorHandler, AppError, NotFoundError, ValidationError };
