const success = (res, data = null, message = 'OK', status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

const error = (res, message = 'Error interno', status = 500, details = null) => {
  const body = { success: false, message };
  if (details) body.details = details;
  return res.status(status).json(body);
};

const created = (res, data = null, message = 'Creado exitosamente') => {
  return success(res, data, message, 201);
};

module.exports = { success, error, created };
