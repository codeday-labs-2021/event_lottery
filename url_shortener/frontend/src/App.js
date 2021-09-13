import logo from './logo.svg';
import React, { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from './components/Header';
import Home from './components/Home';
import NewUrl from './components/NewUrl'
import UrlList from './components/UrlList';
import Vistors from './components/Vistors';
import Chart from './components/Chart'
import { SignUp } from './components/SignUp';
import SignIn from './components/SignIn'
import Codetest from './components/codetest'
import One from './components/One'
function App() {
  return (
    <Router>
      <Header/>
      <Switch>
      <Route exact path="/"component={() => <Home/>}/>
      <Route exact path="/links/:urlid"component={() => <Chart/>}/>
      <Route exact path="/links"component={() => <UrlList/>}/>
      <Route exact path="/chart"component={() => <Vistors/>}/>
      <Route exact path="/signup"component={() => <SignUp/>}/>
      <Route exact path="/signin"component={() => <SignIn/>}/>
      <Route exact path="/test"component={() => <Codetest/>}/>
      <Route exact path="/one"component={() => <One/>}/>
      </Switch>
    </Router>
  );
}

export default App;
