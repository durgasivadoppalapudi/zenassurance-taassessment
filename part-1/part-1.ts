/**
 * @typedef Type IPrice
 * A blueprint of what Price Data might look like.
 */

type PriceData = {
  fee: number;
  premium: number;
  // For the simplicity of this task's context, let's assume that the industry was a part of price given.
  industry: 'legal' | 'food';
};

/**
 * @classdesc Price
 */
export class Price {
  fee: number;
  premium: number;
  industry: string;

  constructor(price: PriceData) {
    this.fee = price.fee;
    this.premium = price.premium;
    this.industry = price.industry;
  }
}

type IQuestionBank = {
  industry: 'legal' | 'food';
  industryActivities?: string[];
  worksOutsideOfCanada?: 'yes' | 'no';
  agreesWithTermsAndConds?: 'yes' | 'no';
};

type UserData = {
  firstName: string;
  lastName: string;
  questionBank: IQuestionBank;
  role: 'user' | 'broker';
};

/**
 * @classdesc User
 * is responsible for retreiving potential prices for its intance using PriceEngine Class.
 */
export class User {
  user: UserData;

  constructor(user: UserData) {
    this.user = user;
  }

  public getPrice(
    priceEngine: PriceEngine
  ): UserPriceResult | BrokerPriceResult {
    return priceEngine.getPrice(this);
  }

  public getQuestionBank(): IQuestionBank {
    return this.user.questionBank;
  }

  public isBroker(): boolean {
    return this.user.role === 'broker';
  }

  public isUser(): boolean {
    return this.user.role === 'user';
  }
}

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

type MissingPrice = { description: string };

const NO_PRICE: MissingPrice = { description: 'No price selected' };

type LowestAndHighestPrices = {
  lowestPrice: number;
  highestPrice: number;
};

type UserPriceResult = {
  priceResult: LowestAndHighestPrices | MissingPrice;
};

type BrokerPriceResult = {
  possiblePrices: Price[];
} & UserPriceResult;

/**
 * @classdesc PriceEngine
 * Responsible for getting the price based on the userset.
 * Ensure that the getPrice() provides the necessary business logic to retreive the expected outcomes.
 */
export class PriceEngine {
  constructor(private readonly priceBank: Price[] = []) {}

  /**
   * Given a list of prices (priceBank), and a user instance,
   * getPrice() calculates for the provided user set with given question banks and roles, based on the expected outcomes for each task.
   * Note that each user instance calls this method and expects the related outcomes, respectively.
   * Please feel free to use other helper methods to help you achieve the expected outcomes.
   */

  private getPossiblePrices(): Price[] {
    return this.priceBank;
  }
  /* For test purpose*/
  public getPriceList(): Price[] {
    return this.getPossiblePrices();
  }

  private userQualifies(user: User): boolean {
    const userQuestionBank = user.getQuestionBank();
    const agreesWithTermsAndConds = userQuestionBank.agreesWithTermsAndConds;

    if (agreesWithTermsAndConds) {
      return agreesWithTermsAndConds === 'yes';
    }

    return true;
  }
  /* For test purpose*/
  public isUserQualified(user: User): boolean {
    return this.userQualifies(user);
  }

  private getLowestAndHighestPrices(user: User): LowestAndHighestPrices | null {
    if (!this.userQualifies(user)) {
      return null;
    }

    const possiblePrices = this.getPossiblePrices();

    if (possiblePrices.length === 0) {
      return null;
    }

    const lowestAndHighestPrices = possiblePrices.reduce(
      (result: LowestAndHighestPrices, price: Price) => {
        return {
          lowestPrice: Math.min(result.lowestPrice, price.premium),
          highestPrice: Math.max(result.highestPrice, price.premium),
        };
      },
      { lowestPrice: Infinity, highestPrice: -Infinity }
    );

    return lowestAndHighestPrices;
  }
  /* For test purpose*/
  public getMinMaxPrices(user: User): LowestAndHighestPrices | null {
    return this.getLowestAndHighestPrices(user);
  }

  private getPriceForUser(user: User): UserPriceResult {
    const lowestAndHighestPrices = this.getLowestAndHighestPrices(user);

    // the spread operator was used here so future changes to the returned result
    // from getPriceForUser would not affect NO_PRICE
    return {
      priceResult: lowestAndHighestPrices
        ? lowestAndHighestPrices
        : { ...NO_PRICE },
    };
  }

  private getPriceForBroker(user: User): BrokerPriceResult {
    const possiblePrices = this.getPossiblePrices();
    return {
      ...this.getPriceForUser(user),
      possiblePrices,
    };
  }

  public getPrice(user: User): UserPriceResult | BrokerPriceResult {
    switch (true) {
      case user.isBroker():
        return this.getPriceForBroker(user);
      case user.isUser():
        return this.getPriceForUser(user);
    }

    throw new Error('invalid user type');
  }
}

/**
 * TASK 1
 * The food user's getPrice() method returns a user response.
 * A user response consists of a priceResult property with highest and lowest prices.
 * 
 * Example Expected Outcome:
 * 
 *  {
      priceResult: { lowestPrice: 20, highestPrice: 500 }
    }
 * 
 */
const priceEngine = new PriceEngine(priceBank);

export function task1() {
  const foodUser = new User({
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    questionBank: {
      industry: 'food',
      industryActivities: ['Wine'],
    },
  });

  const returnedPrice = foodUser.getPrice(priceEngine);
  return returnedPrice;
}

/**
 * TASK 2
 * The food user's getPrice() method returns a broker response.
 * A broker response consists of a priceResult property that has
 * the lowest and highest price available. Additionally, all the other prices available for the customer. (In this part 2 case, let's assume that there will be prices.)
 *
 * Example Expected Outcome:
 *
 *  {
 *    priceResult: { lowestPrice: 20, highestPrice: 500 },
 *    possiblePrices: [
 *      Price { fee: 10, premium: 500, industry: 'food' },
 *       Price { fee: 15, premium: 200, industry: 'food' }
 *     ]
 *   }
 *
 */
export function task2() {
  const foodUser = new User({
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'broker',
    questionBank: {
      industry: 'food',
      industryActivities: ['FoodDelivery'],
    },
  });

  const returnedPrice = foodUser.getPrice(priceEngine);
  return returnedPrice;
}

/**
 * The food user's disqualification message returns a user response. The reason is that the user has responded to a question that blocked them from getting a price, in this case, that is "agreesWithTermsAndConds" with a value of "no".
 * A user response consists of a priceResult property with a description property with the value of 'No price selected'.
 * 
 * Example Expected Outcome:
 * 
 *  {
      priceResult: { desciption: 'No price selected' },
    }
 * 
 */

export function task3() {
  const foodUser = new User({
    firstName: 'John',
    lastName: 'Smith',
    role: 'user',
    questionBank: {
      industry: 'food',
      industryActivities: ['BarLounge', 'FoodDelivery'],
      agreesWithTermsAndConds: 'no',
    },
  });

  const returnedPrice = foodUser.getPrice(priceEngine);
  return returnedPrice;
}

/**
 * The food user's disqualification message returns a broker response. The reason is that the user has responded to a question that blocked them from getting a price, in this case, that is "agreesWithTermsAndConds" with a value of "no".
 * A broker response consists of a priceResult property along with
 * the lowest and highest price available if any.
 * 
 * Example Expected Outcome:
 * 
 *  {
      priceResult: { desciption: 'No price selected' },
      possiblePrices: [
        Price { fee: 10, premium: 500, industry: 'food' },
        Price { fee: 15, premium: 200, industry: 'food' }
      ]
    }
 * 
 */

export function task4() {
  const foodUser = new User({
    firstName: 'John',
    lastName: 'Smith',
    role: 'broker',
    questionBank: {
      industry: 'food',
      industryActivities: ['CoffeeShop'],
      agreesWithTermsAndConds: 'no',
    },
  });

  const returnedPrice = foodUser.getPrice(priceEngine);
  return returnedPrice;
}
