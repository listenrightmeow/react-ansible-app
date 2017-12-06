import React, { Component } from 'react';

import logo from 'images/logo.svg';
import 'stylesheets/app.css';

class App extends Component {
  render() {
    return (
      <section data-react-wrapper="app">
        <img src={logo} className="app-logo" alt="logo" />
      </section>
    );
  }
}

export default App;
