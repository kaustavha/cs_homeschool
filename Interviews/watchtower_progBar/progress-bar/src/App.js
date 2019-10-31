import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

// create a progress bar using js
// 200px wide
// 20px tall 
// load from 0 -100% over 5 secs 
// time limit - <45 mins


const ProgressBar = (props) => {
  const [progress, setProgress] = useState(0);

  const [bar, setBar] = useState([])

  const barStyle = {
    width: {progress},
    height: '20px',
    maxWidth: '200px',
    overflow: 'hidden',
    left: '0px',
    backgroundColor: 'blue'
  }

  useEffect(() => {
    let timer = setTimeout(() => {
      if (progress >= 100) return false;
      setProgress(progress+1);
      setBar(bar => {
        bar.push('.');
        return bar;
      })
      return true;
    }, 50)
    return () => clearTimeout(timer);
  }, [progress])

  return (
    <div style={barStyle}>
      {bar.map(char => <span>{char}</span>)}
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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

        <div>

          <ProgressBar />
        </div>
      </header>

    </div>
  );
}

export default App;
