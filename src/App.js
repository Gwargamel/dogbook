import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Start from './components/Start';
import Create from './components/Create';
import Profile from './components/Profile';
import Edit from './components/Edit';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Start} />
        <Route path="/create" component={Create} />
        <Route path="/profile/:id" component={Profile} />
        <Route path="/edit/:id" component={Edit} />
      </Switch>
    </Router>
  );
}

export default App;
