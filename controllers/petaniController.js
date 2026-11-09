const Petani = require('../models/petaniModel');

exports.create = async (req, res) => {
  try {
    const petani = await Petani.create(req.body);
    res.status(201).json(petani);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  res.json(await Petani.find());
};