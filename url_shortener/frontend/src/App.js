import logo from './logo.svg';
import React, { useState ,useEffect} from "react";
import './App.css';
import axios from 'axios'
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
import SigninSignup from './components/Aouth/LoginSignup'
import One from './components/One'
function App() {
   
  const [username, setUsername] = useState("");
  const[id, setId] =useState(0)

  useEffect(() => {
    axios
      .get('/user',{withCredentials: false} )
      .then((response) => {
        console.log(response.data);
        setUsername(response.data.username)
        setId(response.data.id)
      })
      .catch((error) => {
        console.log(error);
      });
  });
  return (
    <Router>
      <Header id={id} setId={setId}/>
      <Switch>
      <Route exact path="/"component={() => <Home  username={username} />}/>
      <Route exact path="/links/:urlid"component={() => <Chart/>}/>
      <Route exact path="/links"component={() => <UrlList/>}/>
      <Route exact path="/chart"component={() => <Vistors/>}/>
      <Route exact path="/signup"component={() => <SignUp/>}/>
      <Route exact path="/signin"component={() => <SignIn setId={setId} setUsername={setUsername}  />}/>
      <Route exact path="/test"component={() => <Codetest/>}/>
      <Route exact path="/one"component={() => <One/>}/>
       
      </Switch>
    </Router>
  );
}

export default App;