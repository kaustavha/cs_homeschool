import React, { useState } from 'react';
import './App.css';
import { Calculator } from './calculator';
import { Cards } from './components/Cards';
import { Form } from './components/Form';

// Note - ordering of labels need to match
// ordering of values on corresponding type
const itemTypes = {
  'auction': 0,
  'buyNow': 1
}
const itemLabels = [
  'Auction',
  'Buy It Now'
]
const userTypes = {
  'normal': 0,
  'company': 1
}
const userLabels = [
  'Person',
  'Company'
]

const App = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const calc = new Calculator({
    itemTypes: itemTypes,
    userTypes: userTypes
  });

  const onSubmit = newItem => {
    const finalPrice = calc.getFee(newItem);
    setTotal(total + finalPrice)
    setItems(items => {
      items.push({ fee: finalPrice, ...newItem });
      return items;
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Welcome to Solid Fee Calculator</h1>
      </header>
      <div className="App-page">
        <h2>Items</h2>
        <Cards items={ items } />
        <p>Total fees: { total } </p>

        <h3>Register new item</h3>
        <Form
          onSubmit={ onSubmit }
          validSelections={ [0, 1] }
          itemLabels={ itemLabels }
          userLabels={ userLabels }
        />
      </div>
    </div>
  )
}

export default App;
