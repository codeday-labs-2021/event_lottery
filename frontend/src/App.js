import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from './pages/Home';
import { Create } from './pages/Create';
import { Events } from './pages/Events';
import { ViewEditEvent } from './pages/ViewEditEvent';
import { NoMatch } from './pages/NoMatch';
import { Layout } from './components/Layout';
import { NavBar } from './components/Nav';
import { SignUp } from './pages/SignUp';
import { SignIn } from './pages/SignIn';
import axios from "axios";
import { Occurrence } from './pages/Occurrences';
axios.defaults.withCredentials = true
const baseURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_BACKEND_API;

function App() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/user`)
      .then((response) => {
        console.log(response.data);
        setUsername(response.data.Username)
      })
      .catch((error) => {
        console.log(error);
      });
  })

    return (
      <React.Fragment>
        <NavBar username={username} setUsername={setUsername}/>
        <Layout>
          <Router>
            <Switch>
              <Route exact path="/" component={() => <Home username={username}/>} />
              <Route exact path="/create" component={() => <Create username={username}/>} />
              <Route exact path="/events" component={() => <Events username={username}/>} />
              <Route exact path="/event/:eventID" component={() => <ViewEditEvent username={username}/>} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/occurrences" component={Occurrence} />
              <Route exact path="/signin" component={() => <SignIn setUsername={setUsername}/>} />
              <Route component={NoMatch} />
            </Switch>
          </Router>
        </Layout>
      </React.Fragment>
    );
}

export default App;
