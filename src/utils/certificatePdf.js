import { jsPDF } from 'jspdf';

/**
 * Render official mine.skills Certificate on a high-resolution 2048x1364 canvas
 * based on the official background template
 * @param {Object} studentData - Student record
 * @param {Object} activeProduct - Enrolled product details
 * @param {Number} currentLevel - Active or achieved level
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function renderCertificateCanvas(studentData = {}, activeProduct = null, currentLevel = 1) {
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
  const pName = activeProduct?.name || studentData.program || 'mine.swimming';
  const cleanProg = (pName.toLowerCase().includes('renang') || pName.toLowerCase().includes('swim'))
    ? 'mine.swimming'
    : (pName.split('(')[0].trim() || 'mine.skills');
  const levelObj = activeProduct?.levels?.find(l => l.levelNumber === currentLevel);
  const cleanLevel = levelObj?.title || studentData.currentLevelTitle || `Level ${currentLevel}`;
  const ribbonText = `${cleanProg} — ${cleanLevel}`.toUpperCase();

  // Draw ribbon text in crisp white directly on the pristine ribbon
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;
  let ribbonFontSize = 30;
  ctx.font = `bold ${ribbonFontSize}px "Plus Jakarta Sans", "Montserrat", Arial, sans-serif`;
  while (ctx.measureText(ribbonText).width > 880 && ribbonFontSize > 18) {
    ribbonFontSize -= 2;
    ctx.font = `bold ${ribbonFontSize}px "Plus Jakarta Sans", "Montserrat", Arial, sans-serif`;
  }
  ctx.fillText(ribbonText, 1024, 863);
  ctx.restore();

  // 4. Coach Name (left signature line, sits directly on line at Y=1210)
  const coachName = studentData.assignedCoachName || studentData.coachName || 'Coach Pembina';
  ctx.fillStyle = '#0a424e';
  ctx.textBaseline = 'bottom';
  ctx.font = 'bold 27px "Plus Jakarta Sans", "Montserrat", Arial, sans-serif';
  ctx.fillText(coachName, 612, 1205);

  // 5. Management Signature (right signature line, sits directly on line at Y=1210)
  ctx.fillText('Tim Manajemen mine.skills', 1432, 1205);

  // 6. Certificate Registry & Date (subtle footer watermark)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const now = new Date();
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  const rawId = String(studentData.id || '0891').replace(/\D/g, '').slice(-4) || '0891';
  const certReg = studentData.certificateId || `No: CERT/MS/${now.getFullYear()}/${rawId}`;

  ctx.fillStyle = '#476a73';
  ctx.font = '600 19px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(`${certReg} • Diterbitkan Resmi pada ${dateStr}`, 1024, 1310);

  return canvas;
}

/**
 * Generate official mine.skills Certificate PDF based on the official template image
 * @param {Object} studentData - Student record
 * @param {Object} activeProduct - Enrolled product details
 * @param {Number} currentLevel - Active or achieved level
 * @returns {Promise<void>}
 */
export async function downloadCertificatePdf(studentData = {}, activeProduct = null, currentLevel = 1) {
  const canvas = await renderCertificateCanvas(studentData, activeProduct, currentLevel);
  const studentName = (studentData.name || 'NAMA SISWA').toUpperCase();

  // Generate PDF with jsPDF
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

/**
 * Download certificate as high-resolution PNG image
 * @param {Object} studentData
 * @param {Object} activeProduct
 * @param {Number} currentLevel
 * @returns {Promise<void>}
 */
export async function downloadCertificateImage(studentData = {}, activeProduct = null, currentLevel = 1) {
  const canvas = await renderCertificateCanvas(studentData, activeProduct, currentLevel);
  const studentName = (studentData.name || 'NAMA SISWA').toUpperCase();
  const cleanFilename = `Sertifikat_${studentName.replace(/[^A-Za-z0-9]/g, '_')}_Level_${currentLevel}.png`;

  const link = document.createElement('a');
  link.download = cleanFilename;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}
