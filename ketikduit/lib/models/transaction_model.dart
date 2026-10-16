import 'package:cloud_firestore/cloud_firestore.dart';

class TransactionModel {
  final String id;
  final String deskripsi;
  final int nominal;
  final String tipe;
  final DateTime tanggal;

  TransactionModel({
    required this.id,
    required this.deskripsi,
    required this.nominal,
    required this.tipe,
    required this.tanggal,
  });

  // Mengubah data dari Firestore (Map) menjadi objek Flutter
  factory TransactionModel.fromDoc(DocumentSnapshot doc) {
    return TransactionModel(
      id: doc.id,
      deskripsi: doc['deskripsi'] ?? '',
      nominal: doc['nominal'] ?? 0,
      tipe: doc['tipe'] ?? 'pengeluaran',
      tanggal: (doc['tanggal'] as Timestamp).toDate(),
    );
  }
}
