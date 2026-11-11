/**
 * ============================================================================
 * GOOGLE APPS SCRIPT RESMI: GMAIL BANK NOTIFICATION -> WEBHOOK MAIN.SKILL
 * 100% Aman, Idempotent, dan Bersih Tanpa Label (Menggunakan Memory Properties)
 * ============================================================================
 *
 * CARA PASANG (1 MENIT):
 * 1. Buka https://script.google.com menggunakan akun Gmail yang menerima notifikasi Bank.
 * 2. Buka proyek Anda (atau klik "+ Proyek Baru").
 * 3. Timpa/Paste seluruh kode di bawah ini.
 * 4. Klik ikon Simpan (💾).
 * 5. Pemicu (Trigger) tetap sama: jalan otomatis setiap 1 menit.
 * 6. (Opsional) Di Gmail Web, hapus label lama 'Mutasi-Diproses' agar inbox bersih 100%.
 */

const WEBHOOK_URL = 'https://main-skill.vercel.app/api/webhook/mutasi';

function cekMutasiBankGmail() {
  const props = PropertiesService.getUserProperties();

  // 1. Cari email mutasi bank 1 hari terakhir
  const query = [
    'newer_than:1d',
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

  const threads = GmailApp.search(query, 0, 15);
  if (!threads || threads.length === 0) {
    Logger.log('Belum ada email mutasi bank baru.');
    return;
  }

  for (let i = 0; i < threads.length; i++) {
    const thread = threads[i];
    const messages = thread.getMessages();

    for (let j = 0; j < messages.length; j++) {
      const msg = messages[j];
      const msgId = msg.getId();

      // Jika ID email ini sudah pernah diproses di memory internal, lewati!
      if (props.getProperty('MSG_' + msgId)) {
        continue;
      }

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

        // Tandai ID email ini sudah sukses diproses di memory internal Google
        props.setProperty('MSG_' + msgId, new Date().toISOString());
        Logger.log(`Terkirim (${response.getResponseCode()}): ${subject}`);
      } catch (err) {
        Logger.log(`Gagal mengirim ke Webhook: ${err.message}`);
      }
    }
  }
}

