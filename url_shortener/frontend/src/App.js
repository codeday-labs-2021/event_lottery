import logo from './logo.svg';
import React, { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from './components/Header';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Header/>
      <Switch>
      <Route exact path="/"component={() => <Home/>}/>
      </Switch>
    </Router>
  );
}

export default App;
