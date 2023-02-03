import { task1, task2, task3, task4, Price, PriceEngine, User } from './part-1';

describe('PriceEngine', () => {
  let priceEngine: PriceEngine;
  let user: User;

  beforeEach(() => {
    const foodPrice1 = new Price({
      premium: 100,
      fee: 10,
      industry: 'food',
    });

    const foodPrice2 = new Price({
      premium: 120,
      fee: 15,
      industry: 'food',
    });

    const priceBank = [foodPrice1, foodPrice2];
    priceEngine = new PriceEngine(priceBank);

    user = new User({
      firstName: 'John',
      lastName: 'Doe',
      questionBank: {
        industry: 'food',
        industryActivities: ['cooking'],
        worksOutsideOfCanada: 'no',
        agreesWithTermsAndConds: 'yes',
      },
      role: 'user',
    });
  });

  describe('getPossiblePrices', () => {
    it('should return the prices in the price bank', () => {
      expect(priceEngine.getPriceList()).toHaveLength(2);
    });
  });

  describe('userQualifies', () => {
    it('should return true if the user agrees with the terms and conditions', () => {
      expect(priceEngine.isUserQualified(user)).toBe(true);
    });

    it('should return false if the user does not agree with the terms and conditions', () => {
      user.user.questionBank.agreesWithTermsAndConds = 'no';
      expect(priceEngine.isUserQualified(user)).toBe(false);
    });

    it('should return true if the user has not specified their agreement with the terms and conditions', () => {
      user.user.questionBank.agreesWithTermsAndConds = undefined;
      expect(priceEngine.isUserQualified(user)).toBe(true);
    });
  });

  describe('getLowestAndHighestPrices', () => {
    it('should return the lowest and highest prices in the price bank', () => {
      expect(priceEngine.getMinMaxPrices(user)).toEqual({
        lowestPrice: 100,
        highestPrice: 120,
      });
    });

    it('should return null if the user does not qualify', () => {
      user.user.questionBank.agreesWithTermsAndConds = 'no';
      expect(priceEngine.getMinMaxPrices(user)).toBe(null);
    });

    it('should return null if there are no prices in the price bank', () => {
      priceEngine = new PriceEngine();
    });
  });
});
