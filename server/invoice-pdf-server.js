import { jsPDF } from 'jspdf';
import { MINE_SKILLS_LOGO_BASE64 } from './logo-base64-server.js';

/**
 * Server-side Official Invoice PDF Generator with Red "LUNAS" Stamp
 * Compatible with Node.js & Vercel Serverless Functions
 */
export function generateServerInvoicePdf(trx, brand = {}) {
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

  // Extract City dynamically from address
  let dynamicCity = 'Bekasi';
  if (brandAddress.toLowerCase().includes('jakarta')) dynamicCity = 'Jakarta';
  else if (brandAddress.toLowerCase().includes('bekasi')) dynamicCity = 'Bekasi';
  else if (brandAddress.toLowerCase().includes('depok')) dynamicCity = 'Depok';
  else if (brandAddress.toLowerCase().includes('bogor')) dynamicCity = 'Bogor';
  else if (brandAddress.toLowerCase().includes('tangerang')) dynamicCity = 'Tangerang';

  // 1. TOP HEADER BANNER
  doc.setFillColor(13, 77, 93); // Dark Teal
  doc.rect(margin, 16, contentWidth, 2.5, 'F');

  // Insert Logo Image if available
  let textStartX = margin;
  try {
    if (MINE_SKILLS_LOGO_BASE64) {
      doc.addImage(MINE_SKILLS_LOGO_BASE64, 'PNG', margin, 21, 14, 14);
      textStartX = margin + 18;
    }
  } catch (e) {
    textStartX = margin;
  }

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(13, 77, 93);
  doc.text(brandName, textStartX, 27);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Platform Peningkatan Skill Terpadu & Terstruktur (Akademi Resmi)', textStartX, 31.5);

  // Address & Contacts (Wrapped cleanly so it never overlaps right pill)
  const maxHeaderLeftWidth = contentWidth - 68;
  const contactLine = `${brandAddress} • WA: ${brandPhone}`;
  const splitAddress = doc.splitTextToSize(contactLine, maxHeaderLeftWidth);
  doc.text(splitAddress[0] || brandAddress, textStartX, 35.5);
  if (splitAddress.length > 1) {
    doc.text(splitAddress[1], textStartX, 39.5);
  }

  // Document Title Pill
  const pillWidth = 56;
  const pillHeight = 15;
  const pillX = pageWidth - margin - pillWidth;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(pillX, 21, pillWidth, pillHeight, 2, 2, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(13, 77, 93);
  doc.text('BUKTI PEMBAYARAN', pillX + (pillWidth / 2), 27, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('OFFICIAL INVOICE & RECEIPT', pillX + (pillWidth / 2), 32, { align: 'center' });

  // 2. METADATA SECTION BOX
  const metaY = 46;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, metaY, contentWidth, 34, 3, 3, 'FD');

  // Left Column: Invoice Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('INFORMASI TAGIHAN', margin + 8, metaY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  doc.text('Nomor Invoice', margin + 8, metaY + 15);
  doc.setFont('helvetica', 'bold');
  doc.text(`: ${trx.id || '-'}`, margin + 36, metaY + 15);

  doc.setFont('helvetica', 'normal');
  doc.text('Tanggal Terbit', margin + 8, metaY + 21);
  doc.text(`: ${trx.created_at || new Date().toLocaleDateString('id-ID')}`, margin + 36, metaY + 21);

  doc.text('Status Bayar', margin + 8, metaY + 27);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 163, 74); // Green
  doc.text(': LUNAS (VERIFIED / AUTO-MUTASI)', margin + 36, metaY + 27);

  // Right Column: Student & Parent Details
  const rightColX = margin + 96;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('DATA SISWA & WALI MURID', rightColX, metaY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  doc.text('Nama Siswa', rightColX, metaY + 15);
  doc.setFont('helvetica', 'bold');
  doc.text(`: ${trx.studentName || '-'}`, rightColX + 28, metaY + 15);

  doc.setFont('helvetica', 'normal');
  doc.text('Orang Tua / Wali', rightColX, metaY + 21);
  doc.text(`: ${trx.parentName || '-'}`, rightColX + 28, metaY + 21);

  doc.text('Kontak WhatsApp', rightColX, metaY + 27);
  doc.text(`: ${trx.phone || '-'}`, rightColX + 28, metaY + 27);

  // 3. TABLE OF PARTICULARS
  const tableY = 84;
  doc.setFillColor(13, 77, 93);
  doc.rect(margin, tableY, contentWidth, 9, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('NO', margin + 4, tableY + 6);
  doc.text('DESKRIPSI RINCIAN PEMBAYARAN', margin + 18, tableY + 6);
  doc.text('QTY / SESI', margin + 104, tableY + 6);
  doc.text('SUBTOTAL (RP)', pageWidth - margin - 4, tableY + 6, { align: 'right' });

  // Table Row 1: Course Package
  let rowY = tableY + 9;
  const rowHeight = 16;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, rowY, contentWidth, rowHeight, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('1', margin + 5, rowY + 6.5);
  doc.text(trx.packageName || 'Paket Kursus Akademi', margin + 18, rowY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Program: ${trx.productName || 'Skill Renang / Tari'} • Pendampingan Intensif Coach`, margin + 18, rowY + 11.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('4 Sesi Rutin', margin + 104, rowY + 8);

  const baseAmount = Number(trx.baseAmount || trx.amount || 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rp ${baseAmount.toLocaleString('id-ID')}`, pageWidth - margin - 4, rowY + 8, { align: 'right' });

  // Table Row 2: 3-Digit Unique Code (If applied)
  if (trx.uniqueCode) {
    rowY += rowHeight;
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, rowY, contentWidth, 12, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('2', margin + 5, rowY + 6.5);
    doc.text('Kode Unik Verifikasi Otomatis Sistem (3 Digit)', margin + 18, rowY + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Kode identifikasi unik untuk rekonsiliasi mutasi bank otomatis', margin + 18, rowY + 10);

    doc.text('1 Trx', margin + 104, rowY + 7);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rp ${Number(trx.uniqueCode).toLocaleString('id-ID')}`, pageWidth - margin - 4, rowY + 7, { align: 'right' });
    rowY += 12;
  } else {
    rowY += rowHeight;
  }

  // 4. TOTAL SUMMARY BOX
  const summaryY = rowY + 6;
  const summaryBoxWidth = 82;
  const summaryBoxX = pageWidth - margin - summaryBoxWidth;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(summaryBoxX, summaryY, summaryBoxWidth, 36, 2, 2, 'FD');

  const totalAmount = Number(trx.totalAmount || trx.amount || 0);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Subtotal Kursus', summaryBoxX + 6, summaryY + 8);
  doc.text(`Rp ${baseAmount.toLocaleString('id-ID')}`, pageWidth - margin - 6, summaryY + 8, { align: 'right' });

  if (trx.uniqueCode) {
    doc.text('Kode Unik Otomasi', summaryBoxX + 6, summaryY + 14);
    doc.text(`+ Rp ${Number(trx.uniqueCode).toLocaleString('id-ID')}`, pageWidth - margin - 6, summaryY + 14, { align: 'right' });
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(summaryBoxX + 6, summaryY + 18, pageWidth - margin - 6, summaryY + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(13, 77, 93);
  doc.text('TOTAL PEMBAYARAN', summaryBoxX + 6, summaryY + 25);
  doc.setFontSize(12);
  doc.setTextColor(22, 163, 74);
  doc.text(`Rp ${totalAmount.toLocaleString('id-ID')}`, pageWidth - margin - 6, summaryY + 25, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Metode: ${trx.paymentMethodName || 'QRIS Dinamis / Bank Transfer'}`, summaryBoxX + 6, summaryY + 31);

  // 5. OFFICIAL RED "LUNAS" RUBBER STAMP (WIDE WITH NO TEXT CLIPPING)
  const stampX = margin + 12;
  const stampY = summaryY + 4;
  const stampW = 72;
  const stampH = 26;

  doc.saveGraphicsState();
  doc.setDrawColor(220, 38, 38); // Vivid Red
  doc.setLineWidth(1.3);
  doc.roundedRect(stampX, stampY, stampW, stampH, 3.5, 3.5, 'D');

  doc.setLineWidth(0.4);
  doc.roundedRect(stampX + 1.6, stampY + 1.6, stampW - 3.2, stampH - 3.2, 2.2, 2.2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(220, 38, 38);
  doc.text('MINE.SKILLS INDONESIA', stampX + (stampW / 2), stampY + 6.5, { align: 'center' });

  doc.setFontSize(15);
  doc.text('L U N A S', stampX + (stampW / 2), stampY + 14.5, { align: 'center' });

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`VERIFIKASI RESMI: ${trx.paidAt || new Date().toLocaleDateString('id-ID')}`, stampX + (stampW / 2), stampY + 20, { align: 'center' });
  doc.restoreGraphicsState();

  // 6. LEGAL NOTES & SIGNATURE
  const notesY = summaryY + 44;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('CATATAN KETENTUAN & LEGALITAS:', margin, notesY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('1. Bukti pembayaran ini adalah dokumen tanda terima sah yang diterbitkan secara elektronik oleh manajemen mine.skills Indonesia.', margin, notesY + 5);
  doc.text('2. Siswa berhak mengikuti seluruh sesi latihan terjadwal dengan pendampingan pelatih resmi bersertifikasi.', margin, notesY + 9);
  doc.text('3. Sistem ini terproteksi verifikasi otomatis mutasi perbankan & QRIS berlisensi Bank Indonesia.', margin, notesY + 13);

  // Digital Signature (Tim Manajemen mine.skills)
  const signX = pageWidth - margin - 35;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`${dynamicCity}, ` + (new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })), signX, notesY + 2, { align: 'center' });
  doc.text('Departemen Keuangan & Billing', signX, notesY + 6.5, { align: 'center' });
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 77, 93);
  doc.text('TIM MANAJEMEN MINE.SKILLS', signX, notesY + 22, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('(Official Verified Receipt)', signX, notesY + 26, { align: 'center' });

  return doc;
}
