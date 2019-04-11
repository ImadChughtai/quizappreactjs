import React, { Component } from 'react';
// import logo from './logo.svg';
import ButtonAppBar from './Navbar'
import './App.css';
import Mainquiz from './mainquiz'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Mainquiz />
      </div>
    );
  }
}

export default App;
