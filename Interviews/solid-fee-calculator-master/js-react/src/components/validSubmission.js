import moment from 'moment';

/**
 * validSubmission checks whether a submission is valid - sets a validity obj props to check results
 * @param {Object} item - the new incoming item
 * @param {Array} validSelections array of valid selections e.g. 0,1 in our case
 * @return {Object} returns object containing validity info
 */
export default function validSubmission(item, validSelections) {
    const isSelectionValid = num => validSelections.indexOf(num) !== -1;
    const isPriceValid = num => num >= 0 && !isNaN(num) && typeof num === 'number';
    const newInputValidity = {
        itemType: isSelectionValid(item.itemType),
        userType: isSelectionValid(item.userType),
        price: isPriceValid(item.price),
        endDate: moment(item.endDate).isValid()
    }
    newInputValidity.isValid = Object.values(newInputValidity).indexOf(false) === -1;
    return newInputValidity;
}
