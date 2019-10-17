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
  constructor(name, children){
    this.name = name;
    this.children = children;
  }
}

function TodoInput(props) {
  const [names, setNames] = useState([]);
  const [name, setName] = useState("");
  const spacing = props.spacing;
  const handleSubmit = (evt) => {
    evt.preventDefault();
    setNames(names => {
      console.log(names)
      names.push(new listItem(name));
      return names;
    });
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Add a todo item {props.under ? `Under ${props.under}` : ''}</label>
        <input type="text" value={name} onChange={e=>setName(e.target.value)} />
        <input type='submit' value="Submit" />
      </form>
      <div>
      {names.map(li => <TodoItem key={li.name} name={li.name} spacing={spacing} names={names} setNames={setNames}/>)}
      </div>
    </div>
  )
}

function UsernameInput(props) {
  const [username, setUsername] = useState('');
  const [seenUsernames, setSeenUsernames] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  // let loggedIn = false;
  console.log('login', loggedIn, username, loggedIn)

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

// todo - input and del
function TodoItem(props) {
  const name = props.name,
    spacing = props.spacing;
  const divStyle = {
    marginLeft: spacing
  }
  return (<div style={divStyle}>

    <DoneButton name={name} setNames={props.setNames} names={props.names} />
    <p>{name}</p>
    <TodoInput under={name} spacing={spacing+50}/>
  </div>)
}

function DoneButton(props) {
  let setNames = props.setNames;
  let curName = props.name;
  let names = props.names;
  const handleDone = (ev) => {
    ev.preventDefault();
    let savedI = null;
    names.forEach((name, i) => {
      if (name === curName) {
        savedI = i;
      }
    });
    names.splice(savedI, 1);
    setNames([...names]);
  }
  return (
    <form onSubmit={handleDone}>
    <input type='submit' value="Done" />
  </form>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <UsernameInput />
        {/* <TodoInput spacing={0}/> */}
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
