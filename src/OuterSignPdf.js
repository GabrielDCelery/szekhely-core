'use strict';

const _ = require('lodash');
const PdfGen = require('./PdfGen');

const NUM_OF_PAGES = 2;
const NUM_OF_COLUMNS_PER_PAGE = 3;
const PAGE_CONFIG = {
	layout: 'portrait',
	margins: {
		top: 6,
		bottom: 36,
		left: 6,
		right: 6
	}
};

const CELL_MAX_HEIGHT = 20;

class OuterSignPdf extends PdfGen {
	_calculateGridDimensions() {
		if(this.gridCellDimensions) {
			return;
		}

		const _numOfRowsNeeded = Math.ceil(this.numOfCompaniesPerPage / NUM_OF_COLUMNS_PER_PAGE);
		const _pageDimensions = this._getPageDimensions();

		const _cellWidth = (_pageDimensions.width - (PAGE_CONFIG.margins.left + PAGE_CONFIG.margins.right)) / NUM_OF_COLUMNS_PER_PAGE;
		const _cellHeight = Math.floor(_pageDimensions.height - (PAGE_CONFIG.margins.top + PAGE_CONFIG.margins.bottom) / _numOfRowsNeeded);

		this.gridCellDimensions = {
			width: _cellWidth,
			height: _cellHeight > CELL_MAX_HEIGHT ? CELL_MAX_HEIGHT : _cellHeight

		}
	}

	_generateGrid(_companyNames) {
		let _columnIndex = 0;

		_.forEach(_companyNames, (_companyName, _index) => {
			const _offsetX = (_index % NUM_OF_COLUMNS_PER_PAGE) * this.gridCellDimensions.width + PAGE_CONFIG.margins.left;
			const _offsetY = _columnIndex * this.gridCellDimensions.height + PAGE_CONFIG.margins.top;

			this.pdf.fontSize(this.gridCellDimensions.height);
			this.pdf.text(_companyName, _offsetX, _offsetY);
			this.pdf.rect(_offsetX, _offsetY, this.gridCellDimensions.width, this.gridCellDimensions.height).stroke();

			if(_index % NUM_OF_COLUMNS_PER_PAGE === NUM_OF_COLUMNS_PER_PAGE - 1) {
				++_columnIndex;
			}
		});
	}

	_paginateCompanyNames(_companyNames) {
		this.numOfCompaniesPerPage = Math.ceil(_companyNames.length / NUM_OF_PAGES);
		this.paginatedCompanyNames = [];

		for(let _i = 0, _iMax = NUM_OF_PAGES; _i < _iMax; _i++) {
			this.paginatedCompanyNames.push(
				_companyNames.slice(_i * this.numOfCompaniesPerPage, (_i + 1) * this.numOfCompaniesPerPage));
		}
	}

	_generatePdf(_companyNames) {
		this._paginateCompanyNames(_companyNames);

		for(let _i = 0, _iMax = NUM_OF_PAGES; _i < _iMax; _i++) {
			this.pdf.addPage(PAGE_CONFIG);
			this.pdf.switchToPage(_i);
			this._calculateGridDimensions();
			this._generateGrid(this.paginatedCompanyNames[_i]);
		}
	}
}

module.exports = OuterSignPdf;