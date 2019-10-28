import validSubmission from './validSubmission';
import moment from 'moment';

describe("Valid Submission", () => {
    const validSelections = [0, 1];
    it('Can validate fields', () => {
        const input = {
            userType: 1,
            itemType: 0,
            price: 10,
            endDate: moment().format("YYYY-MM-DD")
        }
        let isValid = validSubmission(input, validSelections).isValid;
        expect(isValid).toBe(true);
    })

    it('Can validate fields and detect invalid userType', () => {
        const input = {
            userType: -1,
            itemType: 0,
            price: 10,
            endDate: moment().format("YYYY-MM-DD")
        }
        let isValid = validSubmission(input, validSelections).isValid;
        expect(isValid).toBe(false);
    })

    it('Can validate fields and detect invalid itemType', () => {
        const input = {
            userType: 1,
            itemType: -1,
            price: 10,
            endDate: moment().format("YYYY-MM-DD")
        }
        let isValid = validSubmission(input, validSelections).isValid;
        expect(isValid).toBe(false);
    })

    it('Can validate fields and detect invalid price', () => {
        const input = {
            userType: 1,
            itemType: 0,
            price: "a",
            endDate: moment().format("YYYY-MM-DD")
        }
        let validity = validSubmission(input, validSelections);
        expect(validity.isValid).toBe(false);
        expect(validity.price).toBe(false);
    })

    it('Can validate fields and detect invalid date', () => {
        const input = {
            userType: 1,
            itemType: 0,
            price: 10,
            endDate: "date"
        }
        let validity = validSubmission(input, validSelections);
        expect(validity.isValid).toBe(false);
        expect(validity.endDate).toBe(false);
    })
})
