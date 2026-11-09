import { jsPDF } from 'jspdf';

/**
 * Generate an official, professional A4 PDF invoice with tabular layout and red "LUNAS" stamp.
 * @param {Object} trx - Transaction record containing invoice details
 * @param {Object} brand - Brand details (name, address, phone, email)
 * @returns {jsPDF} doc instance
 */
export function generateInvoicePdf(trx, brand = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2); // 174mm

  const brandName = brand.name || 'mine.skills';
  const brandAddress = brand.addressFull || 'Graha Kresna Pratama, Pondok Gede, Kota Bekasi, Jawa Barat 17411';
  const brandPhone = brand.callCenter || '0852-8627-4726';
  const brandEmail = brand.officialEmail || 'halo@mineskills.id';

  // 1. TOP HEADER BANNER
  doc.setFillColor(13, 77, 93); // Dark Teal #0d4d5d
  doc.rect(margin, 16, contentWidth, 2.5, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(13, 77, 93);
  doc.text(brandName, margin, 27);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Platform Peningkatan Skill Terpadu & Terstruktur (Akademi Resmi)', margin, 32);
  doc.text(`${brandAddress} • WA: ${brandPhone} • Email: ${brandEmail}`, margin, 36.5);

  // Document Title Pill (Right Aligned)
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(pageWidth - margin - 62, 21, 62, 16, 2, 2, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(13, 77, 93);
  doc.text('BUKTI PEMBAYARAN', pageWidth - margin - 31, 27.5, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('OFFICIAL RECEIPT / INVOICE', pageWidth - margin - 31, 32, { align: 'center' });

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, 42, pageWidth - margin, 42);

  // 2. METADATA TWO-COLUMNS BOX
  const metaY = 47;
  const colWidth = (contentWidth - 6) / 2;

  // Box Left: Invoice Info
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, metaY, colWidth, 32, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, metaY, colWidth, 32, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(13, 77, 93);
  doc.text('INFORMASI TAGIHAN', margin + 5, metaY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  doc.text('No. Invoice', margin + 5, metaY + 12);
  doc.text(`:  ${trx.id}`, margin + 30, metaY + 12);

  doc.text('Tanggal Terbit', margin + 5, metaY + 17);
  doc.text(`:  ${trx.created_at || 'Terdaftar Otomatis'}`, margin + 30, metaY + 17);

  doc.text('Metode Bayar', margin + 5, metaY + 22);
  doc.text(`:  ${trx.paymentMethodName || 'QRIS Dinamis ASPI'}`, margin + 30, metaY + 22);

  doc.text('Waktu Lunas', margin + 5, metaY + 27);
  doc.text(`:  ${trx.paidAt || 'Telah Diverifikasi'}`, margin + 30, metaY + 27);

  // Box Right: Customer Info
  const rightX = margin + colWidth + 6;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(rightX, metaY, colWidth, 32, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(rightX, metaY, colWidth, 32, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(13, 77, 93);
  doc.text('DATA PESERTA & WALI MURID', rightX + 5, metaY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  doc.text('Nama Siswa', rightX + 5, metaY + 12);
  doc.setFont('helvetica', 'bold');
  doc.text(`:  ${trx.studentName || '-'}`, rightX + 30, metaY + 12);
  doc.setFont('helvetica', 'normal');

  doc.text('Nama Wali', rightX + 5, metaY + 17);
  doc.text(`:  ${trx.parentName || '-'}`, rightX + 30, metaY + 17);

  doc.text('No. WhatsApp', rightX + 5, metaY + 22);
  doc.text(`:  ${trx.phone || '-'}`, rightX + 30, metaY + 22);

  doc.text('Status Sesi', rightX + 5, metaY + 27);
  doc.text(`:  Aktif (Siap Terjadwal)`, rightX + 30, metaY + 27);

  // 3. TABULAR INVOICE PARTICULARS
  const tableY = 86;
  
  // Table Header
  doc.setFillColor(13, 77, 93); // Dark teal
  doc.rect(margin, tableY, contentWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('NO', margin + 4, tableY + 5.5);
  doc.text('DESKRIPSI PROGRAM & PAKET BIMBINGAN', margin + 18, tableY + 5.5);
  doc.text('SESI', margin + 105, tableY + 5.5);
  doc.text('BIAYA', margin + 125, tableY + 5.5);
  doc.text('TOTAL', pageWidth - margin - 4, tableY + 5.5, { align: 'right' });

  // Table Row 1
  const rowY = tableY + 8;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, rowY, contentWidth, 18, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, rowY + 18, pageWidth - margin, rowY + 18);

  // Borders for table outer
  doc.rect(margin, tableY, contentWidth, 26, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('1', margin + 5, rowY + 6);

  doc.setFont('helvetica', 'bold');
  doc.text(trx.productName || 'Program Peningkatan Skill', margin + 18, rowY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Paket: ${trx.packageName || 'Small Group Class'}`, margin + 18, rowY + 11);
  doc.text(`Catatan: ${trx.notes || 'Pendaftaran resmi dan alokasi coach'}`, margin + 18, rowY + 15);

  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('4 Sesi', margin + 105, rowY + 6);

  const amountStr = trx.formattedAmount || `Rp ${(trx.amount || 0).toLocaleString('id-ID')}`;
  doc.text(amountStr, margin + 125, rowY + 6);
  doc.setFont('helvetica', 'bold');
  doc.text(amountStr, pageWidth - margin - 4, rowY + 6, { align: 'right' });

  // Summary Table Bottom
  const summaryY = rowY + 20;

  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal Tagihan:', pageWidth - margin - 60, summaryY + 4);
  doc.text(amountStr, pageWidth - margin - 4, summaryY + 4, { align: 'right' });

  // Biaya Layanan & Admin
  doc.text('Biaya Administrasi & Pajak (0%):', pageWidth - margin - 60, summaryY + 9);
  doc.text('Rp 0', pageWidth - margin - 4, summaryY + 9, { align: 'right' });

  // Total Dibayar Highlight Box
  doc.setFillColor(240, 253, 244); // Soft Green
  doc.roundedRect(pageWidth - margin - 75, summaryY + 13, 75, 10, 1.5, 1.5, 'F');
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(pageWidth - margin - 75, summaryY + 13, 75, 10, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(22, 101, 52);
  doc.text('TOTAL DIBAYAR:', pageWidth - margin - 70, summaryY + 19.5);
  doc.setFontSize(11);
  doc.text(amountStr, pageWidth - margin - 4, summaryY + 19.5, { align: 'right' });

  // 4. OFFICIAL "LUNAS" RUBBER STAMP (STEMPEL RESMI DIGITAL MERAH/GREEN)
  const stampX = margin + 35;
  const stampY = summaryY + 16;

  // Outer border & inner circle
  doc.setDrawColor(220, 38, 38); // Crimson Red #dc2626
  doc.setLineWidth(1.2);
  doc.roundedRect(stampX - 22, stampY - 14, 44, 22, 3, 3, 'S');
  
  doc.setLineWidth(0.4);
  doc.roundedRect(stampX - 20.5, stampY - 12.5, 41, 19, 2, 2, 'S');

  doc.setTextColor(220, 38, 38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('★ MINE.SKILLS INDONESIA ★', stampX, stampY - 8.5, { align: 'center' });

  doc.setFontSize(17);
  doc.text('L U N A S', stampX, stampY - 0.5, { align: 'center' });

  doc.setFontSize(6.5);
  doc.text(`VERIFIED • ${trx.paidAt || 'Telah Diverifikasi'}`, stampX, stampY + 5, { align: 'center' });

  // 5. LEGAL NOTICE & DIGITAL SIGNATURE
  const legalY = 160;
  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(0.5);
  doc.line(margin, legalY, pageWidth - margin, legalY);

  // Left Note
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(13, 77, 93);
  doc.text('CATATAN KETENTUAN RESMI:', margin, legalY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('1. Dokumen ini merupakan bukti pelunasan sah yang diterbitkan oleh sistem manajemen mine.skills.', margin, legalY + 10.5);
  doc.text('2. Paket mencakup 4 sesi bimbingan bersama instruktur terverifikasi sesuai jadwal yang disepakati.', margin, legalY + 14.5);
  doc.text('3. Konfirmasi berhalangan hadir (sakit/izin) wajib dilakukan minimal 24 jam sebelum jadwal latihan.', margin, legalY + 18.5);
  doc.text('4. Raport perkembangan ananda dapat diakses melalui portal wali murid di https://main-skill.vercel.app/login', margin, legalY + 22.5);

  // Right Signature
  const signX = pageWidth - margin - 35;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Bekasi, ' + (new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })), signX, legalY + 6, { align: 'center' });
  doc.text('Departemen Keuangan & Billing', signX, legalY + 10, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 77, 93);
  doc.setFontSize(8.5);
  doc.text('YAYASAN MINE SKILLS', signX, legalY + 24, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('(Digital Verified Receipt)', signX, legalY + 28, { align: 'center' });

  return doc;
}

/**
 * Build WhatsApp click-to-chat URL with prefilled formal Indonesian receipt message.
 * @param {Object} trx
 * @param {Object} brand
 * @returns {string} WhatsApp direct URL
 */
export function buildInvoiceWhatsAppUrl(trx, brand = {}) {
  const rawPhone = trx.phone || '';
  let cleanPhone = rawPhone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('62') && cleanPhone.length > 5) {
    cleanPhone = '62' + cleanPhone;
  }

  const brandName = brand.name || 'mine.skills';
  const amountStr = trx.formattedAmount || `Rp ${(trx.amount || 0).toLocaleString('id-ID')}`;
  const paidTime = trx.paidAt || new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });

  const message = 
`*BUKTI PEMBAYARAN RESMI (LUNAS) — ${brandName.toUpperCase()}*
--------------------------------------------------
Yth. Bapak/Ibu *${trx.parentName || 'Wali Murid'}*,
Wali dari Ananda *${trx.studentName || 'Siswa'}*

Alhamdulillah, pembayaran tagihan program bimbingan ananda telah *BERHASIL DIVERIFIKASI (LUNAS)* oleh Tim Keuangan ${brandName}.

📄 *Rincian Tanda Terima Resmi:*
• *No. Invoice:* ${trx.id}
• *Program:* ${trx.productName || 'Skill Academy'}
• *Paket Bimbingan:* ${trx.packageName || 'Small Group (4 Sesi)'}
• *Nominal Dibayar:* *${amountStr}*
• *Metode Bayar:* ${trx.paymentMethodName || 'QRIS Dinamis ASPI'}
• *Status Verifikasi:* ✅ *LUNAS (VERIFIED)*
• *Waktu Verifikasi:* ${paidTime}

🎯 *Langkah Selanjutnya:*
Jadwal bimbingan, presensi harian, dan raport evaluasi berkala ananda dapat dipantau langsung melalui Portal Siswa:
👉 https://main-skill.vercel.app/login
*(Gunakan email Bapak/Ibu terdaftar untuk masuk)*

File Invoice resmi ber-cap LUNAS telah diterbitkan oleh sistem manajemen. Terima kasih atas kepercayaan Bapak/Ibu mendampingi tumbuh kembang ananda bersama ${brandName}.

Salam hangat,
*Tim Administrasi & Keuangan ${brandName}*
📞 Call Center: ${brand.callCenter || '0852-8627-4726'}
🌐 https://main-skill.vercel.app/`;

  return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}
