'use strict';

const fs = require('fs');
const PDFDocument = require('pdfkit');

class PdfGen {
	_initPdf() {
		this.pdf = new PDFDocument({ 
			autoFirstPage: false,
			bufferPages: true
		});
	}

	_savePdf(_savePath) {
		this.pdf.pipe(fs.createWriteStream(_savePath));
		this.pdf.end();
	}

	_generatePdf() {
		throw new Error('_generatePdf should be overwritten!');
	}

	_getPageDimensions() {
		return {
			width: this.pdf.page.width,
			height: this.pdf.page.height
		}
	}

	create(_savePath, _data) {
		this._initPdf();
		this._generatePdf(_data);
		this._savePdf(_savePath);
	}
}

module.exports = PdfGen;