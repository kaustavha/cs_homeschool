import React, { useState } from 'react';
import validSubmission from './validSubmission'
import moment from 'moment';

export const Form = props => {
    const { itemLabels, userLabels, validSelections } = props;
    const onSubmit = props.onSubmit ? props.onSubmit : function () { };

    const [item, setItem] = useState({
        itemType: -1,
        userType: -1,
        price: 100,
        endDate: moment().format("YYYY-MM-DD"),
    });

    const [inputValidity, setInputValidity] = useState({
        userType: true,
        itemType: true,
        price: true,
        endDate: true,
        isValid: true
    });

    const onNewItemSubmit = event => {
        event.preventDefault();
        const newInputValidity = validSubmission(item, validSelections);
        setInputValidity(newInputValidity);
        if (newInputValidity.isValid) {
            return onSubmit(item);
        }
    }

    return (
        <form className="New-item-form" onSubmit={ onNewItemSubmit }>
            <Select
                label="You are"
                error={ !inputValidity.userType }
                errTip="Try selecting an option"
                value={ item.userType }
                onChange={ val => setItem({ ...item, userType: val }) }
                options={ userLabels } />

            <Select
                label="Item Type"
                error={ !inputValidity.itemType }
                errTip="Try selecting an option"
                value={ item.itemType }
                onChange={ val => setItem({ ...item, itemType: val }) }
                options={ itemLabels } />

            <Input
                label="Price"
                error={ !inputValidity.price }
                errTip="price must be a number >= 0"
                htmlFor="itemType"
                type="number"
                value={ item.price }
                onChange={ val => setItem({ ...item, price: parseInt(val) }) } />

            <Input
                label="End date"
                error={ !inputValidity.endDate }
                errTip="a valid date is required"
                htmlFor="itemType"
                type="text"
                value={ item.endDate }
                onChange={ val => setItem({ ...item, endDate: val }) } />

            <input type="submit" className="btn btn-primary" value="Submit" />
        </form>
    )
}

export const FormWrapper = ({ htmlFor, label, children, error, errTip, value }) => {
    const errStyle = { backgroundColor: 'beige' }
    return (
        <div className="form-group">
            <label htmlFor={ htmlFor }>{ label }</label>
            { children }
            { error && <span style={ errStyle }>{ `Wrong input to "${label}": {${value}} | Tip: ${errTip}` }</span> }
        </div>
    )
}

export const Select = props => {
    const { value, options, onChange } = props;
    return (
        <FormWrapper { ...props }>
            <select
                className="form-control"
                id="itemType"
                value={ value }
                onChange={ evt => onChange(parseInt(evt.target.value, 10)) }>
                <option value="-1">Select</option>
                { options.map((opt, i) => <option key={ `${opt}${i}` } value={ i }>{ opt }</option>) } />
            </select>
        </FormWrapper>
    )
}

export const Input = props => {
    const { type, value, onChange } = props;
    return (
        <FormWrapper { ...props }>
            <input
                className="form-control"
                type={ type }
                value={ value }
                onChange={ e => onChange(e.target.value) } />
        </FormWrapper>
    )
}
