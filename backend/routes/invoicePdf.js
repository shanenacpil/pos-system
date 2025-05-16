const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/:saleId', async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}/print/invoice/${req.params.saleId}`;

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${req.params.saleId}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).send('Failed to generate PDF.');
  }
});

module.exports = router;
