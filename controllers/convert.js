const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');


const htmlFilePath = path.join(__dirname, '../template.html');
console.log(htmlFilePath);

const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
const options = {
    format: 'A4',       
    orientation: 'portrait', 
    border: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
    }
};
const outputDir = path.join(__dirname, '../output_pdfs');
const outputFilePath = path.join(outputDir, 'output.pdf');
pdf.create(htmlContent, options).toFile(outputFilePath, (err, res) => {
    if (err) {
        console.error('Error creating PDF:', err);
        return;
    }
    console.log('PDF created successfully:', res.filename);
});
