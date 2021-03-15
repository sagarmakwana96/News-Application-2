import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { FaRegBookmark } from 'react-icons/fa';
import { FaBookmark } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import Switch from 'react-switch';
import AsyncSelect from 'react-select/lib/Async'
import './MyNavbar.css'
import _ from "lodash"
import { withRouter } from "react-router";
import ReactTooltip from 'react-tooltip'
import { NavLink } from 'react-router-dom'

class MyNavbar extends React.Component{
  constructor() {
    super();
    this.state = { checked: localStorage.getItem('source')==null?"gd":localStorage.getItem('source'), 
                    check: localStorage.getItem('source')=='ny'?false:true,
                    search_value: ""
                  };
    // this.handleChange = this.handleChange.bind(this);
    if(localStorage.getItem('keyword')==null){
      var keyword = "";
      // console.log(this.state.source);
      localStorage.setItem('keyword', keyword);
      // console.log(localStorage.getItem('source'));
    }
  }
  
  async getOptions(search_value){
    if(!search_value){
      var arr = []
      return arr;
    }
    // console.log(search_value);
    
    var url='https://sagar-makwana.cognitiveservices.azure.com/bing/v7.0/suggestions?q='+search_value;
    // console.log(url);
    const response = await fetch(url, {
      method: 'get',
      headers: {
        'Ocp-Apim-Subscription-Key':''
      }
    });
    const result = await response.json();
    // console.log(result);
    let options = [{value: search_value, label: search_value}];
    // console.log(options);
    

    if(result.suggestionGroups !== null){
      // console.log(result.suggestionGroups);
      result.suggestionGroups[0].searchSuggestions.map((suggestion) => {
        options.push({value: suggestion.displayText, label: suggestion.displayText})
      })
      // console.log(options);
      return options;
    }
  }

  handleInputChange = (newValue) =>{
    const valueInput = newValue;
    this.setState({valueInput});
    return valueInput;
  }

  handleSearchChange = (output_data) =>{
    localStorage.setItem('keyword', output_data.value);
    this.setState({
      search_value: output_data.value
    },() =>{
      var news = localStorage.getItem('source')==null?"gd":localStorage.getItem('source');
      // console.log(news);
      var push_search = this.props.history;
      // console.log(push_search);
      if(news == "gd" && output_data.value!=null){
        // console.log(news);
        push_search.push('/Search?gd='+output_data.value);
      }
      else if(news == "ny" && output_data.value!=null){
        // console.log(news);
        push_search.push('/Search?ny='+output_data.value);
      }
    })
  }
 
  handleChange=(check)=> {  
    this.setState( {check} );
    var source=localStorage.getItem('source');
    if(check == true){
      source = "gd";
    }
    else{
      source = "ny";
    }
    localStorage.setItem('source', source);
    if(check == true)
      this.props.callback("gd");
    else
      this.props.callback("ny");
  }

  showSwitch = () => {
    if(window.location.href.includes('/expandedarticle'))
      return false;
    if(window.location.href.includes('/Search'))
      return false;
    if(window.location.href.includes('/Bookmark'))
      return false;
    return true;
  }

  faBookmark = () =>{
    if(window.location.href.includes('/Bookmark'))
      return true;
    return false;
  }

  faRegBookmark = () =>{
    if(window.location.href.includes('/Bookmark'))
      return false;
    return true;
  }

  render(){
      return(
        <div>
          <Navbar className='gradient' collapseOnSelect expand='lg' bg="primary" variant="dark">
            <AsyncSelect
              className='search'
              noOptionsMessage={() => "No Match"}
              loadOptions={_.debounce(this.getOptions,1000, {leading: true})}
              placeholder={"Enter Keyword .."}
              defaultInputValue={localStorage.getItem('keyword')}
              onInputChange={this.handleInputChange}
              onChange={this.handleSearchChange}
              />
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <NavLink className="nav-link" activeStyle={{color: "#d7d7d7"}} exact to="/">Home</NavLink>
                <NavLink className="nav-link" activeStyle={{color: "#d7d7d7"}} to="/World">World</NavLink>
                <NavLink className="nav-link" activeStyle={{color: "#d7d7d7"}} to="/Politics">Politics</NavLink>
                <NavLink className="nav-link" activeStyle={{color: "#d7d7d7"}} to="/Business">Business</NavLink>
                <NavLink className="nav-link" activeStyle={{color: "#d7d7d7"}} to="/Technology">Technology</NavLink>
                <NavLink className="nav-link" activeStyle={{color: "#d7d7d7"}} to="/Sports">Sports</NavLink>
              </Nav>
              <Nav className="switchSource">
              {this.faRegBookmark()?
                <>
                  <NavLink to="/Bookmark" className="nav-link">
                  <IconContext.Provider value={{ color: "white"}}>
                    <FaRegBookmark data-tip="Bookmark"/>
                  </IconContext.Provider>
                  </NavLink>
                </>: null
              }
              {this.faBookmark()?
                <>
                  <NavLink to="/" className="nav-link">
                  <IconContext.Provider value={{ color: "white"}}>
                    <FaBookmark data-tip="Bookmark"/>
                  </IconContext.Provider>
                  </NavLink>
                </>: null
              }
              <ReactTooltip place="bottom" effect="solid" />
              {this.showSwitch()?
              <>
              <Nav.Link style={{color:"white",cursor:"default"}}>NYTimes</Nav.Link>
              <label htmlFor="material-switch">
              <Switch
                checked={this.state.check}
                onChange={this.handleChange}
                onColor="#2486d1"
                onHandleColor="#ffffff"
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 6px rgba(0, 0, 0, 0.2)"
                handleDiameter={25}
                uncheckedIcon={false}
                checkedIcon={false}
                height={25}
                width={50}
                className="react-switch"
                id="material-switch"
              />
              </label>
                <Nav.Link style={{color:"white",cursor:"default"}}>Guardian</Nav.Link>
              </>: null
              }
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      );
  }
}

export default withRouter(MyNavbar);
