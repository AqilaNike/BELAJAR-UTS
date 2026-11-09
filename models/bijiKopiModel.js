const mongoose = require('mongoose');

const asalSchema = new mongoose.Schema({
  jalan: String,
  kota: String,
}, { _id: false });

const bijiKopiSchema = new mongoose.Schema({
  kodeLot : { type: String, required: [true, 'kode lot wajib diisi'], trim: true },
  varietas : { type: String, required: [true, 'varietas wajib diisi'], unique: true, trim: true },
  beratKg : { type: Number, required: [true, 'berat wajib diisi'], min: [0, 'berat tidak boleh negatif'] },
  proses : { type: String, enum: ['washed', 'natural', 'honey'], required: [true, 'proses wajib diisi'] },
  asal: asalSchema,
  petaniId : { type: mongoose.Schema.Types.ObjectId, ref: 'Petani' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Biji Kopi', bijiKopiSchema);