import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import World from './components/World';
import Politics from './components/Politics';
import Business from './components/Business';
import Technology from './components/Technology';
import Sports from './components/Sports';
import Search from './components/Search/Search';
import Bookmark from './components/Bookmark/Bookmark';
import ExpandedArticle from './components/ExpandedArticle/ExpandedArticle';

class App extends React.Component{
  render(){
    return(
      <div>
      <main>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/World' component={World}/>
            <Route exact path='/Politics' component={Politics}/>
            <Route exact path='/Business' component={Business}/>
            <Route exact path='/Technology' component={Technology}/>
            <Route exact path='/Sports' component={Sports}/>
            <Route exact path='/Search' component={Search}/>
            <Route exact path='/expandedarticle' component={ExpandedArticle}/>
            <Route exact path='/Bookmark' component={Bookmark}/>
          </Switch>
        </BrowserRouter>
      </main>
      </div>   
    );
  }
  
}

render(<App />, document.getElementById("root"));
export default App;
