import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

/**
 * listItems = [
 *  listItem: {name: 'x', children: [
 *    {listItem: ...},
 * ]}
 * ]
 */

class listItem {
  constructor(name){
    this.name = name;
  }
}

function TodoInput(props) {
  const [names, setNames] = useState([]);
  const [name, setName] = useState("");
  const spacing = props.spacing;
  const handleSubmit = (evt) => {
    evt.preventDefault();
    setNames(names => {
      names.push(new listItem(name));
      setName("");
      return names;
    });
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Add a todo item {props.under ? `under ${props.under}` : ''}</label>
        <input type="text" value={name} onChange={e=>setName(e.target.value)} />
        <input type='submit' value="Submit" />
      </form>
      <div>
      {names.map(li => <TodoItem under={props.under} key={li.name} name={li.name} spacing={spacing} setNames={setNames}/>)}
      </div>
    </div>
  )
}

function TodoItem(props) {
  const name = props.name,
        spacing = props.spacing+50,
        under = props.under ? props.under + '/' + name : name,
        divStyle = {
          marginLeft: spacing
        };
  return (<div style={divStyle}>
    <DoneButton name={name} setNames={props.setNames} />
    <p>{name}</p>
    <TodoInput under={under} spacing={spacing}/>
  </div>)
}

function DoneButton(props) {
  let setNames = props.setNames;
  let curName = props.name;
  const handleDone = (ev) => {
    ev.preventDefault();
    setNames(items => items.filter(item => item.name !== curName));
  }
  return (
    <form onSubmit={handleDone}>
    <input type='submit' value="Done" />
  </form>
  )
}

function UsernameInput(props) {
  const [username, setUsername] = useState('');
  const [seenUsernames, setSeenUsernames] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setLoggedIn(true);
    setSeenUsernames(users => {
      users.push(username);
      return users;
    })
  }

  const handleLogout = (evt) => {
    evt.preventDefault();
    setLoggedIn(false);
  }

  if (loggedIn) {
    return (
      <div>
      <form onSubmit={handleLogout}>
        <input type='submit' value="Logout" />
      </form>
      <h1> Hi {username}</h1>
      <TodoInput spacing={0} username={username}/>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
    <label>Hi whats your name? </label>
    <input type="text" value={username} onChange={e=>setUsername(e.target.value)} />
    <input type='submit' value="Submit" />
    </form>
  )
  
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <UsernameInput />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
