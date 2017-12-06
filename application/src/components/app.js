import React, { Component } from 'react';
import logo from 'images/logo.svg';

class App extends Component {
  render() {
    return (
      <section data-react-wrapper="app">
        <img src={logo} className="App-logo" alt="logo" />
      </section>
    );
  }
}

export default App;
