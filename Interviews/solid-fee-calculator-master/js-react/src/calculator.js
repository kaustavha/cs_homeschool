import moment from 'moment';
const adCostByType = {
  'auction': 25,
  'buyNow': 35
}
const userTypeError = 'Unknown user type';
const itemTypeError = 'Unknown item type';
/**
 * Fees calculator
 * Accepts an object mapping user types to values and a similiar itemTypes object
 */
export class Calculator {
  /**
   * Needs a mapping to know how UI elements are mapped to parse input and possible values to check against
   * @param {Object} param0 { userTypes, itemTypes }
   *  @requires userTypes.company Integer
   *  @requires itemTypes.auction Integer
   *  @requires itemTypes.buyNow Integer
   */
  constructor({ userTypes, itemTypes }) {
    this.itemTypes = itemTypes;
    this.userTypes = userTypes;
  }
  /**
   * Calculates the final price based on the incoming price, 
   * Subtracts a discount dependent on userType, endDate
   * Adds a cost dependent on itemType
   * @param {Object} param0 object containing {userType, itemType, price, endDate}
   */
  getFee({ userType, itemType, price, endDate }) {
    if (Object.values(this.userTypes).indexOf(userType) === -1) {
      throw new Error(userTypeError);
    }
    if (Object.values(this.itemTypes).indexOf(itemType) === -1) {
      throw new Error(itemTypeError);
    }
    const cost = price + this._getAdCost(itemType) - this._calcTotalDiscount(userType, endDate);
    return cost;
  }
  _getAdCost(itemType) {
    if (itemType === this.itemTypes.auction) return adCostByType.auction;
    if (itemType === this.itemTypes.buyNow) return adCostByType.buyNow;
  }
  _calcTotalDiscount(userType, endDate) {
    let discount = 0;
    if (userType === this.userTypes.company) discount += 5;
    discount += this._getEndDateDiscount(endDate);
    return discount;
  }
  _getEndDateDiscount(endDate) {
    const isToday = moment(endDate).isSame(moment(), 'day');
    if (isToday) return 10;
    return 0;
  }
}
