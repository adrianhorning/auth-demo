import * as React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Landing from './components/Landing';
// Also tried this but it didn't render the svg
// https://webpack.js.org/guides/typescript/#importing-other-assets
// const logo = require("./logo.svg") as string;

const App = () => (
  <BrowserRouter>
    <div>
      <Route exact path="/" component={Landing} />
      <Route exact path="/home" component={Home} />
    </div>
  </BrowserRouter>
)

export default App;
