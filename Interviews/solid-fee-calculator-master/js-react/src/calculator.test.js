import { Calculator } from './calculator';
import moment from 'moment';

const opts = {
  itemTypes: {
    'auction': 0,
    'buyNow': 1
  },
  userTypes: {
    'normal': 0,
    'company': 1
  }
}

describe("Calculator", () => {
  let calc = new Calculator(opts);
  it('Can calculate fee with userType 1 itemType 0 endDate Now', () => {
    const fee = calc.getFee({
      userType: 1,
      itemType: 0,
      price: 10,
      endDate: moment().format("YYYY-MM-DD")
    });

    expect(fee).toBe(20);
  });

  it('Can calculate fee with userType 0 itemType 1 endDate Now', () => {
    const fee = calc.getFee({
      userType: 0,
      itemType: 1,
      price: 10,
      endDate: moment().format("YYYY-MM-DD")
    });

    expect(fee).toBe(35);
  });

  it('Can calculate fee with userType 1 itemType 1 endDate Now', () => {
    const fee = calc.getFee({
      userType: 1,
      itemType: 1,
      price: 10,
      endDate: moment().format("YYYY-MM-DD")
    });

    expect(fee).toBe(30);
  });

  it('Can calculate fee with userType 0 itemType 0 endDate Now', () => {
    const fee = calc.getFee({
      userType: 0,
      itemType: 0,
      price: 10,
      endDate: moment().format("YYYY-MM-DD")
    });

    expect(fee).toBe(25);
  });


  it('Can calculate fee with userType 1 itemType 0 endDate Later', () => {
    const fee = calc.getFee({
      userType: 1,
      itemType: 0,
      price: 0,
      endDate: moment().add(4, 'day').format("YYYY-MM-DD")
    });

    expect(fee).toBe(20);
  });

  it('Can calculate fee with userType 0 itemType 1 endDate Later', () => {
    const fee = calc.getFee({
      userType: 0,
      itemType: 1,
      price: 0,
      endDate: moment().add(4, 'day').format("YYYY-MM-DD")
    });

    expect(fee).toBe(35);
  });

  it('Can calculate fee with userType 0 itemType 0 endDate Later', () => {
    const fee = calc.getFee({
      userType: 0,
      itemType: 0,
      price: 0,
      endDate: moment().add(4, 'day').format("YYYY-MM-DD")
    });

    expect(fee).toBe(25);
  });

  it('Can calculate fee with userType 1 itemType 1 endDate Later', () => {
    const fee = calc.getFee({
      userType: 1,
      itemType: 1,
      price: 0,
      endDate: moment().add(4, 'day').format("YYYY-MM-DD")
    });

    expect(fee).toBe(30);
  });
});
