import React from 'react';
import MyNavbar from './MyNavbar/MyNavbar';
import './Home.css';
import { FacebookShareButton, EmailShareButton, TwitterShareButton } from 'react-share';
import { FacebookIcon, EmailIcon, TwitterIcon} from 'react-share';
import Modal from 'react-bootstrap/Modal';
import { IoMdShare } from 'react-icons/io';
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";
import {Link} from "react-router-dom";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: black;
`;

function MyModal(article) {
    const [show, setShow] = React.useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    console.log(article);
    const twitterTag = ['CSCI_571_NewsApp'];
    return (
      <>
      <IoMdShare onClick={handleShow}/>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>{article.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h4 style={{textAlign:"center", fontSize:"20px"}}>Share Via</h4>
                <FacebookShareButton style={{float:"left", marginLeft:"8%"}} url={article.shareUrl} quote={article.title} hashtag="#CSCI_571_NewsApp">
                    <FacebookIcon size={52} round />
                </FacebookShareButton>
                <TwitterShareButton url={article.shareUrl} quote={article.title} hashtags={twitterTag}>
                    <TwitterIcon size={52} round />
                </TwitterShareButton>
                <EmailShareButton style={{float:"right", marginRight:"8%"}} url={article.shareUrl} subject = "#CSCI_571_NewsApp">
                    <EmailIcon size={52} round />
                </EmailShareButton>
        </Modal.Body>
        </Modal>
      </>
    );
  }

function imageSrc(article,source){
    if(source=="gd"){
        // Guardian
        try{
            if(article.blocks.main.elements[0].assets.length!=0){
                var len =article.blocks.main.elements[0].assets.length;
                var imageSrc = article.blocks.main.elements[0].assets[len-1].file;
            }
            else{
                var imageSrc = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
            }
        }
        catch(err){
            var imageSrc = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
        }
    } 
    else{ 
        // NYTimes
        try{
            if(article.multimedia.length!=0){
                for(var i = 0; i < article.multimedia.length; i ++){
                    if(article.multimedia[i].width>=2000){
                        var imageSrc = article.multimedia[i].url;
                        console.log(article.multimedia[i].width);
                        return imageSrc;
                    
                    }
                }
                imageSrc = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
            }
            else{
                imageSrc = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
            }
        }
        catch(err){
            var imageSrc = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
        }
    }
    return imageSrc;
}

function articleTitle(article,source){
    var title;
    if(source=='gd'){
        title=article.webTitle;
    }
    else{
        title=article.title;
    }
    return title;
}

function articlePageUrl(element,source){
    var url;
    if(source=='ny'){
        url="/expandedarticle?ny="+element.url;
    }
    else{
        url="/expandedarticle?gd="+element.id;
    }
    console.log(url);
    return url;
}

function articleDescription(article,source){
    var description;
    if(source=='gd'){
        try{
            description=article.blocks.body[0].bodyTextSummary;
            if(description.length < 297){
                description = description;
            }
            else{
                description = description.substring(0,300);
                var counter = 299;
                while(description.charAt(counter)!=" ")
                    counter--;
                description=description.substring(0,counter);
                description+="...";
            }
        }
        catch(err){
        }
    }
    else{
        try{
            if(article.abstract!=null)
                description=article.abstract;
            if(description.length < 297){
                description = description;
            }
            else{
                description = description.substring(0,300);
                var counter = 299;
                while(description.charAt(counter)!=" ")
                    counter--;
                description=description.substring(0,counter);
                description+="...";
            }
        }
        catch(err){
        }
    }
    return description;
}

function articleDate(article,source){
    var date;
    if(source=='gd'){
        try{
            date=article.webPublicationDate.substring(0,10);
        }
        catch(err){
        }
    }
    else{
        try{
            date=article.published_date.substring(0,10);
        }
        catch(err){
        }
    }
    return date;
}

function shareUrl(article,source){
    var url;
    if(source=='gd'){
        url=article.webUrl;
    }
    else{
        url=article.url;
    }
    return url;
}

class World extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            error : null,
            isLoaded : false,
            source : localStorage.getItem('source')==null?"gd":localStorage.getItem('source'),
            articles : []        
        };
        var keyword = "";
        localStorage.setItem('keyword', keyword);
    }

    modalClick(event){
        event.preventDefault();
    }

    componentDidMount() {
        var section = "world";
        var url="";
        if(this.state.source == 'ny')
        {
            url = "http://newsapp-sagarmakwana96.us-east-1.elasticbeanstalk.com/section/"+false+"/sectionName/"+section;
            fetch(url)
            .then( response => response.json())
            .then(
                // handle the result
                (result) => {
                    this.setState({
                        isLoaded : true,
                        articles : result.data.results
                    });
                },
                
                // Handle error 
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                },
            )
        }
        else{
            var url = "http://newsapp-sagarmakwana96.us-east-1.elasticbeanstalk.com/section/"+true+"/sectionName/"+section;
            fetch(url)
            .then( response => response.json())
            .then(
                // handle the result
                (result) => {
                    this.setState({
                        isLoaded : true,
                        articles : result.data.response.results
                    });
                },
                
                // Handle error 
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                },
            )
        }
    }

    componentDidUpdate(prevProps,prevState) {
        console.log(this.state);
        console.log(prevState);
        var url;
        var section = "world";
        if(this.state.source !== prevState.source)
        {
            if(this.state.source == 'ny')
            {
                url = "http://newsapp-sagarmakwana96.us-east-1.elasticbeanstalk.com/section/"+false+"/sectionName/"+section;
                fetch(url)
                .then( response => response.json())
                .then(
                    // handle the result
                    (result) => {
                        this.setState({
                            isLoaded : true,
                            articles : result.data.results
                        });
                    },
                    
                    // Handle error 
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        })
                    },
                )
            }
            else{
                console.log(this.state);
                url = "http://newsapp-sagarmakwana96.us-east-1.elasticbeanstalk.com/section/"+true+"/sectionName/"+section;
                fetch(url)
                .then( response => response.json())
                .then(
                    // handle the result
                    (result) => {
                        this.setState({
                            isLoaded : true,
                            articles : result.data.response.results
                        });
                    },
                    
                    // Handle error 
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        })
                    },
                )
            }
        }
    }

    getChecked=(checked)=>{
        this.setState({source:checked});
        this.setState({isLoaded:false});
    }
    
    render(){
        const {error, isLoaded, articles} = this.state;
        if(error){
            return <div>Error in loading</div>
        }else if (!isLoaded) {
            return(
                <>
                <MyNavbar callback = {this.getChecked}/>
                <div className="load">
                    <BounceLoader
                    css={override}
                    size={30}
                    color={"#123abc"}
                    loading={this.state.loading}
                    />
                    <center>Loading</center>
                </div>
                </>
            )
        }else{
            return(
                <div>
                    <MyNavbar callback = {this.getChecked}/>
                        <div className="justify-content-center">   
                        {
                            articles.slice(0,10).map(article => (
                                <div className = 'news_articles'>
                                    <Link className='cardAnchor' to= {articlePageUrl(article,this.state.source)}>
                                        <div style={{padding:"15px"}}>
                                            <div className='article_image'>
                                                <img src= {imageSrc(article,this.state.source)}/>
                                            </div>
                                            <div className='article_description'>
                                                <b style={{fontSize: "17px"}}><i>{articleTitle(article,this.state.source)}</i></b>
                                                <span onClick={this.modalClick}><MyModal title={articleTitle(article,this.state.source)} shareUrl={shareUrl(article,this.state.source)}/></span>
                                                <p style={{marginTop: "4px"}}>
                                                    {articleDescription(article,this.state.source)}
                                                </p>
                                                <p><i>{articleDate(article,this.state.source)}</i><span className="world">WORLD</span></p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>             
                            ))
                        }
                        </div>
                </div>
            );
        }
    }
}

export default World;