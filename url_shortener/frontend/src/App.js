import logo from './logo.svg';
import React, { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from './components/Header';
import Home from './components/Home';
import NewUrl from './components/NewUrl'
import UrlList from './components/UrlList';
import Vistors from './components/Vistors';
function App() {
  return (
    <Router>
      <Header/>
      <Switch>
      <Route exact path="/"component={() => <Home/>}/>
      <Route exact path="/links/:urlid"component={() => <Vistors/>}/>
      <Route exact path="/links"component={() => <UrlList/>}/>
      </Switch>
    </Router>
  );
}

export default App;
