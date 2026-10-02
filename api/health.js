module.exports = (req, res) => {
  res.status(200).json({ ok: true, service: "aulas-barbara", time: new Date().toISOString() });
};
