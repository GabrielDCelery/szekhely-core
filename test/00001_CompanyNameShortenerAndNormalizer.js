'use strict';

const chai = require('chai');
const expect = chai.expect;
const CompanyNameShortenerAndNormalizer = require('../src/companyHelperClasses/CompanyNameShortenerAndNormalizer');

describe('process({})', () => {
	const companyNameShortener = new CompanyNameShortenerAndNormalizer();

	it('Converts a name to capital case version', () => {
		expect(companyNameShortener.process('100 SZÁL VIRÁG Kft.')).to.eql('100 Szál Virág Kft.');
		expect(companyNameShortener.process('4 ÉP-SZAK 2000 Kft.')).to.eql('4 Ép Szak 2000 Kft.');
	});

	it('Removes braced extra values', () => {
		expect(companyNameShortener.process('Prezo Invest Kft.(mód. előtt Chameleon Events & Tr...'))
			.to.eql('Prezo Invest Kft.');
	});

	it('Shortens names', () => {
		expect(companyNameShortener.process('Alkaloida & Azulén Vegyészeti Kft.'))
			.to.eql('Alkaloida & Azulén Kft.');
		expect(companyNameShortener.process('BARANYAI GENERÁLKIVITELEZŐ ÉS VAGYONKEZELŐ ZRT'))
			.to.eql('Baranyai Zrt.');
		expect(companyNameShortener.process('VÁL-ING  Ingatlanforgalmazó- és Építtető Kft.'))
			.to.eql('Vál Ing Kft.');
		expect(companyNameShortener.process('VE-TISZ Fuvarozási és Szolgáltató Kft.'))
			.to.eql('Ve Tisz Fuvarozási Kft.');
	});

	it('Removes extra spaces', () => {
		expect(companyNameShortener.process('FOXCOM  MARKETING  KFT'))
			.to.eql('Foxcom Marketing Kft.')
	});

	it('Replaces different company types with their shorthand value', () => {
		expect(companyNameShortener.process('Bajorné Kollár Angéla egyéni vállalkozó'))
			.to.eql('Bajorné Kollár Ev.');
		expect(companyNameShortener.process('Tanoda-Tudás-Tanulás Alapítvány'))
			.to.eql('Tanoda Tudás Tanulás Ap.');
		expect(companyNameShortener.process('INTER MOBIL TRUCK KFT'))
			.to.eql('Inter Mobil Truck Kft.');
		expect(companyNameShortener.process('ePolisher Team Szociális Szövetkezet'))
			.to.eql('Epolisher Team Szsz.');
		expect(companyNameShortener.process('DRDF Pályázati Direktmarketing Közvetítő és Tanács...'))
			.to.eql('Drdf Pályázati');
	});

	it('Appends missing dots to the shortened company names', () => {
		expect(companyNameShortener.process('Mehr Zaker Kft'))
			.to.eql('Mehr Zaker Kft.');
		});
});