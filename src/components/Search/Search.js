import React from 'react';
import MyNavbar from '.././MyNavbar/MyNavbar';
import './Search.css';
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
    // options.log(article);
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

function sectionColor(element){
    if(element == "WORLD")
        return "world";
    else if(element == "POLITICS")
        return "politics";
    else if(element == "BUSINESS")
        return "business";
    else if(element == "TECHNOLOGY")
        return "technology";
    else if(element == "SPORTS")
        return "sports";
    else
        return "other";
}

function imageSrc(article,source){
    if(source==true){
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
        console.log(article.multimedia)
        try{
            if(article.multimedia.length!=0){
                for(var i = 0; i < article.multimedia.length; i ++){
                    if(article.multimedia[i].width>=2000){
                        var imageSrc ="https://www.nytimes.com/"+ article.multimedia[i].url;
                        console.log(imageSrc);
                        //options.log(article.multimedia[i].width);
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
    if(source==true){
        title=article.webTitle;
        if(title.length < 67){
            title = title;
        }
        else{
            title = title.substring(0,70);
            var counter = 69;
            while(title.charAt(counter)!=" ")
                counter--;
            title=title.substring(0,counter);
            title+="...";
        }
    }
    else{
        title=article.headline.main;
        if(title.length < 67){
            title = title;
        }
        else{
            title = title.substring(0,70);
            var counter = 69;
            while(title.charAt(counter)!=" ")
                counter--;
            title=title.substring(0,counter);
            title+="...";
        }
    }
    return title;
}

function articlePageUrl(element,source){
    var url;
    if(source==false){
        url="/expandedarticle?ny="+element.web_url;
    }
    else{
        url="/expandedarticle?gd="+element.id;
    }
    // console.log(url);
    return url;
}


function articleDate(article,source){
    var date;
    if(source==true){
        try{
            date=article.webPublicationDate.substring(0,10);
        }
        catch(err){
        }
    }
    else{
        try{
            date=article.pub_date.substring(0,10);
        }
        catch(err){
        }
    }
    return date;
}

function articleSection(article,source){
    var section;
    if(source==true){
        try{
            section=article.sectionId.toUpperCase();
        }
        catch(err){}
    }
    else{
        try{
            section=article.section_name.toUpperCase();
        }
        catch(err){}
    }
    if(section=="SPORT")
        section="SPORTS";
    // console.log(section);
    return section;
}

function shareUrl(article,source){
    var url;
    if(source==true){
        url=article.webUrl;
    }
    else{
        url=article.web_url;
    }
    return url;
}

var source;
class Search extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            error : null,
            isLoaded : false,
            articles : []        
        };
    }

    modalClick(event){
        event.preventDefault();
    }

    componentDidMount() {
        var searchKeyword = this.props.location.search;
        var url = "";
        var newsSource = localStorage.getItem('source');
        var keyword = searchKeyword.substring(4).replace(/%20/g, " ");
        localStorage.setItem('keyword', keyword);
        if(newsSource=="ny")
        {
            source=false;
            url = "http://newsapp-sagarmakwana96.us-east-1.elasticbeanstalk.com/searchResults/"+searchKeyword.substring(4)+"/source/"+source;
            // console.log(url);
            fetch(url)
            .then( response => response.json())
            .then(
                // handle the result
                (result) => {
                    this.setState({
                        isLoaded : true,
                        articles : result.data.response.docs
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
            source=true;
            var searchKeyword = this.props.location.search;
            url = "http://newsapp-sagarmakwana96.us-east-1.elasticbeanstalk.com/searchResults/"+searchKeyword.substring(4)+"/source/"+source;
            // console.log(url);
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
        var searchKeyword = this.props.location.search;
        var url="";
        this.state.isLoaded=false;
        var keyword = searchKeyword.substring(4).replace(/%20/g, " ");
        localStorage.setItem('keyword', keyword);
        if(this.props.location.search !== prevProps.location.search)
        {
            var newsSource = localStorage.getItem('source');
            if(newsSource=="ny"){
                source=false;
                url = "http://newsapp-sagarmakwana96.us-east-1.elasticbeanstalk.com/searchResults/"+searchKeyword.substring(4)+"/source/"+source;
                // console.log(url);
                fetch(url)
                .then( response => response.json())
                .then(
                    // handle the result
                    (result) => {
                        this.setState({
                            isLoaded : true,
                            articles : result.data.response.docs
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
                source=true;
                var searchKeyword = this.props.location.search;
                url = "http://newsapp-sagarmakwana96.us-east-1.elasticbeanstalk.com/searchResults/"+searchKeyword.substring(4)+"/source/"+source;
                // console.log(url);
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

    render(){
        const {error, isLoaded, articles} = this.state;
        if(error){
            return <div>Error in loading</div>
        }
        else if (!isLoaded) {
            return(
                <>
                <MyNavbar/>
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
        }else if(this.state.articles == null || this.state.articles.length == 0){
            return(
            <div>
                <MyNavbar/>
                <h5 style={{fontWeight:"600", marginTop:"5px",textAlign:"center"}}>No Articles Found</h5> 
            </div>
            );
        }else{
            return(
                <div>
                    <MyNavbar/>
                    <h4 className="headerText">Results</h4>
                    <div className="rowContent"> 
                    {
                        articles.map(article => (
                            <Link className='news-articles' to= {articlePageUrl(article,source)}>
                                <div >
                                    <div className="article_header">
                                        <b><i>{articleTitle(article,source)}</i></b>
                                        <span onClick={this.modalClick}><MyModal title={articleTitle(article,source)} shareUrl={shareUrl(article,source)}/></span>
                                    </div>
                                    <div className='articleImage'>
                                        <img src={imageSrc(article,source)}/>
                                    </div>
                                    <div className='articleFooter'>
                                        <p><i>{articleDate(article,source)}</i> <span className={sectionColor(articleSection(article,source))}>{articleSection(article,source)}</span></p>
                                    </div>
                                </div>
                            </Link>           
                        ))
                    }
                    </div>
                </div>
            );
        }
    }
}

export default Search;