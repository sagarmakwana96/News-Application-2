import React, { Component } from "react";
import { IoIosArrowUp, IoIosArrowDown} from 'react-icons/io';

class ToggleBox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			opened: false,
		};
		this.toggleBox = this.toggleBox.bind(this);
	}
  
	toggleBox() {
		console.log("toggle")
		localStorage.setItem('toggle', "close");
		const { opened } = this.state;
		this.setState({
			opened: !opened,
		});
	}
  
	render() {
		var { title, children } = this.props;
		const { opened } = this.state;
		// console.log(this.props.summary);
		var len = this.props.summary.length;
        if(len<1100){
            return(<div></div>);
        }
		if(localStorage.getItem("toggle") == "close"){
			if (opened){
				title =<IoIosArrowUp className="toggleButton"/>;
				setTimeout(() => {window.scrollTo({top: 10000, left: 0, behavior:"smooth"})}, 1);
			}

			else{
				title =<IoIosArrowDown className="toggleButton"/>;
				setTimeout(() => {window.scrollTo({top: 0, left: 0, behavior:"smooth"})}, 1);
			}
		}

		return (
			<div className="box">
				
				{opened && (					
					<div class="boxContent">
						{children}
					</div>
				)}
                <span style={{cursor:"pointer"}} className="boxTitle" style={{marginLeft:"98%"}} onClick={this.toggleBox}>
					{opened?<IoIosArrowUp className="toggleButton"/>:<IoIosArrowDown className="toggleButton"/>}
				</span>
			</div>
		);
	}
}

export default ToggleBox;