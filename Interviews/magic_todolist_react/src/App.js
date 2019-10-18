import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

/**
 * Users = {
 *  username: {
 *    identifier: [listItem]
  * }
 * }
 * top level identifier is root. All child identifiers are recursively generated as `root/{parent}/child`
 */

class listItem {
  constructor(name){
    this.name = name;
  }
}

function UsernameInput(props) {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userDataStore, setUserDataStore] = useState({});

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setLoggedIn(true);
    setUserDataStore(users => {
      users[username] = users[username] ? users[username] : {};
      return users;
    });
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
      <TodoInput spacing={0} username={username} userDataStore={userDataStore} setUserDataStore={setUserDataStore}/>
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

function TodoInput(props) {
  const [names, setNames] = useState([]);
  const [name, setName] = useState("");
  const spacing = props.spacing;
  const userDataStore = props.userDataStore ? props.userDataStore : [];
  const setUserDataStore = props.setUserDataStore;
  const username = props.username;
  const under = props.under;
  const identifier = props.under ? `root/${props.under}` : 'root';

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setNames(names => {
      names.push(new listItem(name));
      setName("");
      return names;
    });
  }

  useEffect(() => {
    if (userDataStore[username].todoList && userDataStore[username].todoList[identifier]) {
      setNames([...userDataStore[username].todoList[identifier]]);
    }
  }, []);

  useEffect(() => {
    setUserDataStore(users => {
      if (!users[username] || !users[username].todoList) users[username].todoList = {};
      users[username].todoList[identifier] = names;
      return users;
    });
  }, [names])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Add a todo item {under ? `under ${under}` : ''}</label>
        <input type="text" value={name} onChange={e=>setName(e.target.value)} />
        <input type='submit' value="Submit" />
      </form>
      <div>
      {names.map(li => <TodoItem username={username} userDataStore={userDataStore} setUserDataStore={setUserDataStore} under={under} key={li.name} name={li.name} spacing={spacing} setNames={setNames}/>)}
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
    <TodoInput username={props.username} under={under} spacing={spacing} setUserDataStore={props.setUserDataStore} userDataStore={props.userDataStore}/>
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
