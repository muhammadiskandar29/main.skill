import { jsPDF } from 'jspdf';
import { MINE_SKILLS_LOGO_BASE64 } from './logoBase64.js';

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

  // Extract City from brand address dynamically (fallback to Bekasi)
  let dynamicCity = 'Bekasi';
  if (brandAddress.toLowerCase().includes('jakarta')) dynamicCity = 'Jakarta';
  else if (brandAddress.toLowerCase().includes('bekasi')) dynamicCity = 'Bekasi';
  else if (brandAddress.toLowerCase().includes('depok')) dynamicCity = 'Depok';
  else if (brandAddress.toLowerCase().includes('bogor')) dynamicCity = 'Bogor';
  else if (brandAddress.toLowerCase().includes('tangerang')) dynamicCity = 'Tangerang';

  // 1. TOP HEADER BANNER
  doc.setFillColor(13, 77, 93); // Dark Teal #0d4d5d
  doc.rect(margin, 16, contentWidth, 2.5, 'F');

  // Insert Official Logo Image (Ukuran pas & proporsional: 27mm x 18mm)
  let textStartX = margin;
  try {
    if (MINE_SKILLS_LOGO_BASE64) {
      doc.addImage(MINE_SKILLS_LOGO_BASE64, 'PNG', margin, 21, 27, 18);
      textStartX = margin + 30; // 48mm from left edge
    }
  } catch (e) {
    textStartX = margin;
  }

  // Document Title Pill (Right Aligned, diposisikan tepat di sisi kanan: width 50mm)
  const pillWidth = 50;
  const pillHeight = 15;
  const pillX = pageWidth - margin - pillWidth; // 210 - 18 - 50 = 142mm
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(pillX, 22, pillWidth, pillHeight, 2, 2, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(13, 77, 93);
  doc.text('BUKTI PEMBAYARAN', pillX + (pillWidth / 2), 28, { align: 'center' });

  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('OFFICIAL RECEIPT / INVOICE', pillX + (pillWidth / 2), 33, { align: 'center' });

  // Area Teks Tengah: Dihitung presisi agar PASTI TIDAK AKAN MENABRAK KOTAK PILL KANAN
  // Batas maksimum lebar = pillX - textStartX - 5mm buffer
  const maxCenterTextWidth = pillX - textStartX - 5; // ~89mm

  // Subtitle / Slogan (Di-split otomatis jika font melebihi batas)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(13, 77, 93);
  const sloganLines = doc.splitTextToSize('Platform Peningkatan Skill Terpadu & Terstruktur (Akademi Resmi)', maxCenterTextWidth);
  doc.text(sloganLines, textStartX, 26);

  // Address & Contacts (Wrapped rapi di bawah slogan)
  const addressStartY = 26 + (sloganLines.length * 4.2);
  const contactLine = `${brandAddress} • WA: ${brandPhone}`;
  const splitAddress = doc.splitTextToSize(contactLine, maxCenterTextWidth);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.3);
  doc.setTextColor(100, 116, 139);
  doc.text(splitAddress, textStartX, addressStartY);

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, 44, pageWidth - margin, 44);

  // 2. METADATA TWO-COLUMNS BOX
  const metaY = 48;
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
  const cleanMethod = (trx.paymentMethodName || 'QRIS Dinamis ASPI').replace(/<[^>]+>/g, '').trim();
  doc.text(`:  ${cleanMethod}`, margin + 30, metaY + 22);

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

  // 4. OFFICIAL "LUNAS" RUBBER STAMP (STEMPEL RESMI DIGITAL MERAH/GREEN DENGAN LEBAR CUKUP)
  const stampX = margin + 35;
  const stampY = summaryY + 18;
  const stampW = 54; // Wider stamp box so text never clips outer border
  const stampH = 24;

  // Outer border & inner border
  doc.setDrawColor(220, 38, 38); // Crimson Red #dc2626
  doc.setLineWidth(1.2);
  doc.roundedRect(stampX - (stampW / 2), stampY - (stampH / 2), stampW, stampH, 3, 3, 'S');
  
  doc.setLineWidth(0.4);
  doc.roundedRect(stampX - (stampW / 2) + 1.5, stampY - (stampH / 2) + 1.5, stampW - 3, stampH - 3, 2, 2, 'S');

  doc.setTextColor(220, 38, 38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('MINE.SKILLS INDONESIA', stampX, stampY - 5.5, { align: 'center' });

  doc.setFontSize(15);
  doc.text('L U N A S', stampX, stampY + 1.5, { align: 'center' });

  doc.setFontSize(6);
  doc.text(`VERIFIED • ${trx.paidAt || 'Telah Diverifikasi'}`, stampX, stampY + 6.8, { align: 'center' });

  // 5. LEGAL NOTICE & DIGITAL SIGNATURE (Tim Manajemen Resmi)
  const legalY = 168;
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
  const legalNotes = [
    '1. Dokumen ini merupakan bukti pelunasan sah yang diterbitkan oleh sistem manajemen mine.skills Indonesia.',
    '2. Paket mencakup 4 sesi bimbingan bersama instruktur terverifikasi sesuai jadwal yang disepakati.',
    '3. Konfirmasi berhalangan hadir (sakit/izin) wajib dilakukan minimal 24 jam sebelum jadwal latihan.',
    '4. Raport perkembangan ananda dapat diakses melalui portal wali murid di https://main-skill.vercel.app'
  ];
  const maxLegalNoteWidth = contentWidth - 65;
  let curNoteY = legalY + 10.5;
  legalNotes.forEach(note => {
    const wrapped = doc.splitTextToSize(note, maxLegalNoteWidth);
    doc.text(wrapped, margin, curNoteY);
    curNoteY += (wrapped.length * 4);
  });

  // Right Signature (Tim Manajemen mine.skills)
  const signX = pageWidth - margin - 32;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`${dynamicCity}, ` + (new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })), signX, legalY + 6, { align: 'center' });
  doc.text('Departemen Keuangan & Billing', signX, legalY + 10.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 77, 93);
  doc.setFontSize(8.5);
  doc.text('TIM MANAJEMEN MINE.SKILLS', signX, legalY + 28, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('(Official Verified Receipt)', signX, legalY + 32, { align: 'center' });

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

[RINCIAN TANDA TERIMA RESMI]
• No. Invoice: ${trx.id}
• Program: ${trx.productName || 'Skill Academy'}
• Paket Bimbingan: ${trx.packageName || 'Small Group (4 Sesi)'}
• Nominal Dibayar: *${amountStr}*
• Metode Bayar: ${trx.paymentMethodName || 'QRIS Dinamis ASPI'}
• Status Verifikasi: *LUNAS (TERVERIFIKASI SISTEM)*
• Waktu Verifikasi: ${paidTime}

[INFORMASI AKSES PORTAL SISWA]
Jadwal bimbingan, presensi harian, serta raport evaluasi berkala siswa dapat dipantau langsung melalui Portal Siswa:
Tautan Portal: https://main-skill.vercel.app/login
(Silakan masuk menggunakan email terdaftar)

File Invoice resmi ber-cap LUNAS telah diterbitkan oleh sistem manajemen. Terima kasih atas kepercayaan Bapak/Ibu mendampingi perkembangan ananda bersama ${brandName}.

Hormat kami,
*Manajemen Administrasi & Keuangan ${brandName}*
Layanan Pelanggan: ${brand.callCenter || '0852-8627-4726'}
Situs Resmi: https://main-skill.vercel.app/`;

  return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}
