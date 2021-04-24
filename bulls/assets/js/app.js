// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.scss"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
//     import socket from "./socket"
//
import "phoenix_html"
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ch_join, ch_push, ch_reset } from './socket';

import { lives_left, new_secret, validate_guess, guesses_and_results } from './game';

function App() {
  const [secret, _setSecret] = useState(new_secret());
  const [guesses, setGuesses] = useState([]);
  const [guess, setGuess] = useState("");

  let lives = lives_left(guesses);

  function updateGuess(ev) {
    let text = ev.target.value;
    if (text.length > 4) {
      text = text.slice(0, 4);
    }
    setGuess(text);
  }

  function makeGuess() {
    if (!guesses.includes(guess) && validate_guess(guess)) {
      guesses.push(guess);
      setGuess("");
    }
  }


  function keypress(ev) {
    if (ev.key == "Enter") {
      makeGuess();
    }
  }

  if (guesses.includes(secret)) {
    return (
      <div className="App">
        <h1>Game Won</h1>
        <h1>Secret: {secret}</h1>
        <p>
          <button onClick={() => { setGuesses([]); _setSecret(new_secret()); }}>
            Reset
          </button>
        </p>
      </div>
    );
  }

  if (lives <= 0) {
    return (
      <div className="App">
        <h1>Game Over</h1>
        <h1>Secret: {secret}</h1>
        <p>
          <button onClick={() => { setGuesses([]); _setSecret(new_secret()); }}>
            Reset
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Guesses Left: {lives}</h1>
      <p>
        <input type="text"
          value={guess}
          onChange={updateGuess}
          onKeyPress={keypress} />
        <button onClick={makeGuess}>
          Guess
        </button>
      </p>
      <table>
        <tr>
          <th>Guess</th>
          <th>Result</th>
        </tr>
        {
          guesses_and_results(secret, guesses).map((elem => <tr><td>{elem.guess}</td><td>{elem.results}</td></tr>))
        }
      </table>
      <p>
        <button onClick={() => { setGuesses([]); _setSecret(new_secret()); }}>
          Reset
        </button>
      </p>
    </div>
  );
}

export default App;

function Demo(_) {
    const [count, setCount] = useState(0);
    return App();
    /*return (
        <div>
          <p>Count: {count}</p>
          <p><button onClick={() => setCount(count + 1)}>+1</button></p>
        </div>
    )*/
}

function EndScreen() {
  return (
    <div className="App">
      <h1>Game Over</h1>
    </div>
  );
}

function ActiveGame({state, setState}) {
  return (
    <div className="App">
      <h1>Game Not Over {state.gameOver.toString()}</h1>
    </div>
  );
}

function Demo2(_) {
  const [state, setState] = useState({
    guesses: [],
    gameOver: false,
    bulls: [],
    cows: [],
  });
  //alert(state.gameOver);
  useEffect(() => ch_join(setState));

  if (state.gameOver) {
    return (<EndScreen />);
  }
  else {
    return (<ActiveGame state={state}  setState={setState} />);
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>,
  document.getElementById('root')
);
