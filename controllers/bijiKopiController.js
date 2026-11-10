const BijiKopi = require('../models/bijiKopiModel');
const Petani = require('../models/petaniModel');
const { errorHttp } = require('../middlewares/errorHandler');

const LIMIT_DEFAULT = 10;
const LIMIT_MAKS = 50;
const FIELD_SORT = ['kodeLot', 'varietas', 'beratKg', 'proses', 'createdAt'];
const FIELD_BOLEH_DIPILIH = ['kodeLot', 'varietas', 'beratKg', 'proses', 'asal', 'petaniId', 'createdAt'];

// Mengubah bilangan dari query string menjadi bilangan bulat yang aman
function angkaAman(nilai, bawaan, min, maks) {
  const n = parseInt(nilai, 10);
  if (Number.isNaN(n)) return bawaan;
  return Math.min(Math.max(n, min), maks);
}

exports.create = async (req, res) => {
  try {
    const bijiKopi = await BijiKopi.create(req.body);
    res.status(201).json(bijiKopi);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.proses) {
      filter.proses = String(req.query.proses);
    }
    if (req.query.petaniId) {
      filter.petaniId = String(req.query.petaniId);
    }

    const page = angkaAman(req.query.page, 1, 1, Number.MAX_SAFE_INTEGER);
    const limit = angkaAman(req.query.limit, LIMIT_DEFAULT, 1, LIMIT_MAKS);

    const sortParam = String(req.query.sort || '-createdAt');
    const arah = sortParam.startsWith('-') ? -1 : 1;
    const sortField = sortParam.replace(/^-/, '');
    if (!FIELD_SORT.includes(sortField)) {
      throw errorHttp(400, `sort hanya boleh: ${FIELD_SORT.join(', ')}`);
    }

    let select = '';
    if (req.query.fields) {
      const fields = String(req.query.fields).split(',').map((f) => f.trim());
      if (!fields.every((f) => FIELD_BOLEH_DIPILIH.includes(f))) {
        throw errorHttp(400, `fields hanya boleh: ${FIELD_BOLEH_DIPILIH.join(', ')}`);
      }
      select = fields.join(' ');
    }

    const query = BijiKopi.find(filter)
      .select(select)
      .sort({ [sortField]: arah, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!select || select.split(' ').includes('petaniId')) {
      query.populate('petaniId', 'kode nama');
    }

    const [data, total] = await Promise.all([query, BijiKopi.countDocuments(filter)]);

    res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res) => {
  const data = await BijiKopi.findById(req.params.id).populate('petaniId');
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await BijiKopi.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: 'after', runValidators: true }
  );
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};

exports.remove = async (req, res) => {
  const data = await BijiKopi.findByIdAndDelete(req.params.id);
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.status(204).send();
};