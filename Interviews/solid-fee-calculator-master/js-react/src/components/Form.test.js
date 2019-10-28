import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Select } from './Form';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Form
        itemLabels={ ['1', '2'] }
        userLabels={ ['admin', 'user'] }
        validSelections={ [0, 1] }
    />, div);
    ReactDOM.unmountComponentAtNode(div);
})

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Select options={ ['admin', 'user'] } />, div);
    ReactDOM.unmountComponentAtNode(div);
})
