const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.telegramWebhook = functions.https.onRequest(async (req, res) => {
  const message = req.body.message;

  if (message && message.text) {
    const chatId = message.from.id;
    const text = message.text;

    // Logika pengenalan: "Makan siang 25000"
    const match = text.match(/(.+)\s(\d+)/);

    if (match) {
      const deskripsi = match[1].trim();
      const nominal = parseInt(match[2], 10);

      try {
        await db.collection("transactions").add({
          chatId,
          deskripsi,
          nominal,
          tanggal: admin.firestore.FieldValue.serverTimestamp(),
          sumber: "telegram",
        });

        // Pesan Berhasil
        const successMsg = `✅ *Berhasil Dicatat!*\n\n📝 Item: ${deskripsi}\n` +
          `💰 Nominal: Rp ${nominal.toLocaleString("id-ID")}\n` +
          `📅 Waktu: ${new Date().toLocaleString("id-ID")}\n\n` +
          "Terima kasih sudah mencatat!";

        res.status(200).send({
          method: "sendMessage",
          chat_id: chatId,
          text: successMsg,
          parse_mode: "Markdown",
        });
      } catch (error) {
        console.error("Firestore Error:", error);
        // Pesan Gagal (Internal Server/Database)
        const errorMsg = "❌ *Gagal Menyimpan!*\n\n" +
          "Terjadi kesalahan saat menyimpan ke database. " +
          "Silakan coba lagi nanti.";

        res.status(200).send({
          method: "sendMessage",
          chat_id: chatId,
          text: errorMsg,
          parse_mode: "Markdown",
        });
      }
    } else {
      // Pesan Gagal (Format Salah)
      const formatMsg = "⚠️ *Format Salah!*\n\nSilakan gunakan format:\n" +
        "`[Nama Barang] [Harga]`\n\nContoh: `Nasi Goreng 15000`";

      res.status(200).send({
        method: "sendMessage",
        chat_id: chatId,
        text: formatMsg,
        parse_mode: "Markdown",
      });
    }
  } else {
    res.sendStatus(400);
  }
});
