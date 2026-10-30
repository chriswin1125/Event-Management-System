const QRCode = require('qrcode');

const generateQRCode = async (data) => {
  try {
    const text = typeof data === 'string' ? data : JSON.stringify(data);
    const qrDataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      width: 256,
      color: {
        dark: '#1D1D1F',
        light: '#FFFFFF',
      },
    });
    return qrDataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    return '';
  }
};

module.exports = { generateQRCode };
