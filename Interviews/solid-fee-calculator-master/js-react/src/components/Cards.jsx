import React from 'react';

export const Cards = ({ items }) => {
    return (
        <div>
            { items.map(item => <Card key={ String(Object.values(item)) } item={ item } />) }
        </div>
    )
}

export const CardRow = ({ val, label }) => {
    const userReadableKeys = {
        'userType': "User Type",
        'endDate': "End Date",
        'itemType': "Item Type",
        'price': 'Price',
        'fee': 'Final Price'
    }
    return (
        <tr>
            <td>
                { userReadableKeys[label] || label }:
            </td>
            <td>
                { val }
            </td>
        </tr>
    )
}

export const Card = ({ item }) => {
    const style = {
        display: 'inline-block',
        margin: '1px',
        borderLeft: 'solid grey 4px'
    }
    return (
        <span className="item-card" style={ style }>
            <table>
                <tbody>
                    { Object.keys(item).map(key => <CardRow key={ key } label={ key } val={ item[key] } />) }
                </tbody>
            </table>
        </span>
    )
}
