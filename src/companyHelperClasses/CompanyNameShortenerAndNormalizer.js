'use strict';

const _ = require('lodash');
const UPPERCASE_AFTER_CHARACTER = [' ', '-', '_'];

const COMPANY_TYPE_SHORTHAND_LOOKUP = {
	'Kft': 'Kft',
	'Bt': 'Bt',
	'Zrt': 'Zrt',
	'Ev': 'Ev',
	'Egyéni Vállalkozó': 'Ev',
	'Alapítvány': 'Ap',
	'Szociális Szövetkezet': 'Szsz'
};

const COMPANY_NAME_MAX_LENGTH = 20;

const TO_REPLACE_STRING_PATTERNS = {
	bracedContent: {
		regExp: new RegExp(/\(.*/g),
		replaceWith: ''
	},
	extraSpaces: {
		regExp: new RegExp(/\s+/g),
		replaceWith: ' '
	}
};

class CompanyNameShortenerAndNormalizer {
	process(_companyNameToNormalize) {
		this._startProcess(_companyNameToNormalize);
		this._replacePatterns();
		this._upperCaseFirstLetters();
		this._removeCompanyType();
		this._shortenCompanyName();
		this._appendCompanyTypeShortVersion();

		return this.companyName;
	}

	_startProcess(_companyNameToNormalize) {
		this.companyName = _companyNameToNormalize.trim();
		this.companyTypeShortVersion = null;
	}

	_replacePatterns() {
		_.forEach(TO_REPLACE_STRING_PATTERNS, _toReplaceStringPattern => {
			this.companyName = this.companyName
				.replace(_toReplaceStringPattern.regExp, _toReplaceStringPattern.replaceWith);
		});

		return this.companyName;
	}

	_upperCaseFirstLetters() {
		const _characters = [];

		for(let _i = 0, _iMax = this.companyName.length; _i < _iMax; _i++) {
			if(_i === 0 || UPPERCASE_AFTER_CHARACTER.indexOf(this.companyName[_i - 1]) !== -1) {
				_characters.push(this.companyName[_i].toUpperCase());

				continue;
			}

			_characters.push(this.companyName[_i].toLowerCase());
		}

		this.companyName = _characters.join('');
	}

	_removeCompanyType() {
		const _companyTypes = Object.keys(COMPANY_TYPE_SHORTHAND_LOOKUP);

		for(let _i = 0, _iMax = _companyTypes.length; _i < _iMax; _i++) {
			const _pattern = new RegExp(`\\s${_companyTypes[_i]}.?`);

			if(_pattern.test(this.companyName) === true) {
				this.companyTypeShortVersion = COMPANY_TYPE_SHORTHAND_LOOKUP[_companyTypes[_i]];
				this.companyName = this.companyName.replace(_pattern, '').trim();

				break;
			}
		}
	}

	_appendCompanyTypeShortVersion() {
		if(_.isNull(this.companyTypeShortVersion)) {
			return;
		}

		this.companyName = `${this.companyName} ${this.companyTypeShortVersion}.`;
	}

	_shortenCompanyName() {
		let _shortenedCompanyName = '';
		const _words = _.words(this.companyName, /[^, -]+/g);

		for(let _i = 0, _iMax = _words.length; _i < _iMax; _i++) {
			if(_shortenedCompanyName.length + _words[_i].length > COMPANY_NAME_MAX_LENGTH) {
				break;
			}

			_shortenedCompanyName = `${_shortenedCompanyName} ${_words[_i]}`;
		}

		this.companyName = _shortenedCompanyName.trim();
	}
}

module.exports = CompanyNameShortenerAndNormalizer;