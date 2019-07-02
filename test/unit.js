var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;

var marketModel = require('../models/market');


describe('Market unit tests', () => {
    let market = 'ca';

    it('should return all markets', () => {
        let marketList = JSON.parse(marketModel.listMarkets());
        expect(marketList).not.to.be.empty;
        expect(marketList).to.have.property('markets');
    });
});