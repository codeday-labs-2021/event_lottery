import React, { Component } from 'react';
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
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar/>
        <Layout>
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/create" component={Create} />
              <Route exact path="/events" component={Events} />
              <Route exact path="/event/:eventID" component={ViewEditEvent} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/signin" component={SignIn} />
              <Route component={NoMatch} />
            </Switch>
          </Router>
        </Layout>
      </React.Fragment>
    )
  }
}

export default App;
