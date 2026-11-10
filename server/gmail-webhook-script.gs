/**
 * ============================================================================
 * GOOGLE APPS SCRIPT RESMI: GMAIL BANK NOTIFICATION -> WEBHOOK MAIN.SKILL
 * 100% Aman (Berjalan di akun Google pribadi Anda sendiri, tanpa pihak ketiga)
 * ============================================================================
 *
 * CARA PASANG (2 MENIT):
 * 1. Buka https://script.google.com menggunakan akun Gmail yang menerima email notifikasi Bank.
 * 2. Klik tombol "+ Proyek Baru" (New Project).
 * 3. Hapus semua kode bawaan, lalu TEMPEL (Paste) seluruh kode di file ini.
 * 4. Pastikan variabel WEBHOOK_URL di bawah sesuai dengan alamat domain website Anda.
 * 5. Klik ikon Simpan (💾) di atas, lalu klik tombol "Jalankan" (Run) sekali untuk memberi izin (Review Permissions -> Allow).
 * 6. Di menu sebelah kiri, klik ikon Jam "Pemicu" (Triggers) -> "+ Tambahkan Pemicu" (Add Trigger):
 *    - Pilih fungsi: cekMutasiBankGmail
 *    - Pilih sumber acara: Dipicu waktu (Time-driven)
 *    - Pilih jenis pemicu waktu: Penghitung menit (Minutes timer)
 *    - Pilih interval menit: Setiap menit (Every minute)
 *    - Klik Simpan!
 */

const WEBHOOK_URL = 'https://main-skill.vercel.app/api/webhook/mutasi';
const LABEL_NAME  = 'Mutasi-Diproses';

function cekMutasiBankGmail() {
  // 1. Siapkan label penanda agar email yang sudah diproses tidak dikirim ulang
  let label = GmailApp.getUserLabelByName(LABEL_NAME);
  if (!label) {
    label = GmailApp.createLabel(LABEL_NAME);
  }

  // 2. Cari email mutasi bank 1 hari terakhir yang belum diberi label 'Mutasi-Diproses'
  const query = [
    'newer_than:1d',
    `-label:${LABEL_NAME}`,
    '(',
      'from:bca.co.id OR',
      'from:bankmandiri.co.id OR',
      'from:bri.co.id OR',
      'from:bni.co.id OR',
      'from:bsi.co.id OR',
      'from:gopay.co.id OR',
      'subject:"Transfer" OR',
      'subject:"Dana Masuk" OR',
      'subject:"QRIS" OR',
      'subject:"Bukti Transaksi"',
    ')'
  ].join(' ');

  const threads = GmailApp.search(query, 0, 10);
  if (!threads || threads.length === 0) {
    Logger.log('Belum ada email mutasi bank baru.');
    return;
  }

  for (let i = 0; i < threads.length; i++) {
    const thread = threads[i];
    const messages = thread.getMessages();

    for (let j = 0; j < messages.length; j++) {
      const msg = messages[j];
      const subject = msg.getSubject() || '';
      const sender  = msg.getFrom() || '';
      const body    = msg.getPlainBody() || '';

      const payload = {
        type: 'CR',
        bank: sender,
        sender: sender,
        title: subject,
        text: `${subject} ${body}`
      };

      try {
        const response = UrlFetchApp.fetch(WEBHOOK_URL, {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify(payload),
          muteHttpExceptions: true
        });
        Logger.log(`Terkirim ke Webhook (${response.getResponseCode()}): ${subject}`);
      } catch (err) {
        Logger.log(`Gagal mengirim ke Webhook: ${err.message}`);
      }
    }

    // 3. Tandai thread sudah diproses
    thread.addLabel(label);
  }
}

