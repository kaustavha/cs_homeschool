import React from 'react';
import ReactDOM from 'react-dom';
import { Cards } from './Cards';
import moment from 'moment';

it('renders without crashing', () => {
    const defaultItem = {
        itemType: 0,
        userType: 0,
        price: 100,
        endDate: moment().format("YYYY-MM-DD"),
    }
    const div = document.createElement('div');
    ReactDOM.render(<Cards items={ [defaultItem] } />, div);
    expect(div.children.length).toBe(1)
    // Test card is rendered
    expect(div.children[0].children[0].classList[0]).toBe('item-card')
    // Test right number of card rows are rendered 
    expect(div.firstChild.firstChild.firstChild.firstChild.children.length).toBe(Object.keys(defaultItem).length);

    ReactDOM.unmountComponentAtNode(div);
});
// todo 