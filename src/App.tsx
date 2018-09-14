import * as React from 'react';
import './App.css';
// Also tried this but it didn't render the svg
// https://webpack.js.org/guides/typescript/#importing-other-assets
const logo = require("./logo.svg") as string;

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
