import { jsPDF } from 'jspdf';

/**
 * Generate official mine.skills Certificate PDF based on the official template image
 * @param {Object} studentData - Student record
 * @param {Object} activeProduct - Enrolled product details
 * @param {Number} currentLevel - Active or achieved level
 * @returns {Promise<void>}
 */
export async function downloadCertificatePdf(studentData = {}, activeProduct = null, currentLevel = 1) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1364;
  const ctx = canvas.getContext('2d');

  // Load background template
  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => {
      // Fallback if crossOrigin fails
      img.crossOrigin = null;
      img.src = '/images/certificate-bg.jpg';
      img.onload = resolve;
      img.onerror = reject;
    };
    img.src = '/images/certificate-bg.jpg';
  });

  // 1. Draw base background template (1024x682 scaled 2x to 2048x1364)
  ctx.drawImage(img, 0, 0, 2048, 1364);

  // 2. Draw Student Name (in the golden pill container)
  const studentName = (studentData.name || 'NAMA SISWA').toUpperCase();
  ctx.fillStyle = '#0a424e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Calculate font size to fit inside pill (pill width is ~1260px at 2048px canvas)
  let nameFontSize = 54;
  ctx.font = `bold ${nameFontSize}px "Playfair Display", "Times New Roman", Georgia, serif`;
  while (ctx.measureText(studentName).width > 1200 && nameFontSize > 28) {
    nameFontSize -= 2;
    ctx.font = `bold ${nameFontSize}px "Playfair Display", "Times New Roman", Georgia, serif`;
  }
  ctx.fillText(studentName, 1024, 680);

  // 3. Program & Level in the Ribbon
  const productName = activeProduct?.name || studentData.program || 'mine.swimming';
  const levelObj = activeProduct?.levels?.find(l => l.levelNumber === currentLevel);
  const levelTitle = levelObj?.title || studentData.currentLevelTitle || `Level ${currentLevel}`;
  const ribbonText = `${productName} — ${levelTitle}`.toUpperCase();

  // Background overlay for ribbon banner so dynamic text replaces default text cleanly
  ctx.fillStyle = '#0d4d5d';
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(460, 836, 1128, 62, 10);
    ctx.fill();
  } else {
    ctx.fillRect(460, 836, 1128, 62);
  }

  // Draw ribbon text in crisp white
  ctx.fillStyle = '#ffffff';
  let ribbonFontSize = 30;
  ctx.font = `bold ${ribbonFontSize}px "Plus Jakarta Sans", "Montserrat", Arial, sans-serif`;
  while (ctx.measureText(ribbonText).width > 1080 && ribbonFontSize > 18) {
    ribbonFontSize -= 2;
    ctx.font = `bold ${ribbonFontSize}px "Plus Jakarta Sans", "Montserrat", Arial, sans-serif`;
  }
  ctx.fillText(ribbonText, 1024, 867);

  // 4. Coach Name (left signature line)
  const coachName = studentData.assignedCoachName || studentData.coachName || 'Coach Pembina';
  ctx.fillStyle = '#0a424e';
  ctx.font = 'bold 28px "Plus Jakarta Sans", "Montserrat", Arial, sans-serif';
  ctx.fillText(coachName, 610, 1170);

  // 5. Management Signature (right signature line)
  ctx.fillText('Tim Manajemen mine.skills', 1470, 1170);

  // 6. Certificate Registry & Date (subtle footer watermark)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const now = new Date();
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  const rawId = String(studentData.id || '0891').replace(/\D/g, '').slice(-4) || '0891';
  const certReg = studentData.certificateId || `No: CERT/MS/${now.getFullYear()}/${rawId}`;

  ctx.fillStyle = '#527982';
  ctx.font = '500 18px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(`${certReg} • Diterbitkan Resmi pada ${dateStr}`, 1024, 1315);

  // 7. Generate PDF with jsPDF
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pdfDataUrl = canvas.toDataURL('image/jpeg', 0.95);
  doc.addImage(pdfDataUrl, 'JPEG', 0, 0, 297, 210);

  const cleanFilename = `Sertifikat_${studentName.replace(/[^A-Za-z0-9]/g, '_')}_Level_${currentLevel}.pdf`;
  doc.save(cleanFilename);
}
