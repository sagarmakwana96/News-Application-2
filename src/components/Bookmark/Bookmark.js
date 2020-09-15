import React from 'react';
import { MdDelete } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyNavbar from '.././MyNavbar/MyNavbar';
import './Bookmark.css'
import { FacebookShareButton, EmailShareButton, TwitterShareButton } from 'react-share';
import { FacebookIcon, EmailIcon, TwitterIcon} from 'react-share';
import Modal from 'react-bootstrap/Modal';
import { IoMdShare } from 'react-icons/io';
import {Zoom} from 'react-toastify';
import {Link} from "react-router-dom";

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

function newsSource(source){
    if(source==true){
        return "GUARDIAN";
    }
    else{
        return "NYTIMES";
    }
}

function articleUrl(articleId){
    // console.log(articleId);
    var page_url = "expandedarticle"+articleId;
    return page_url;
}

function articleTitle(title){
    var title = title;
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
    return title;
}

function MyModal(article) {
    const [show, setShow] = React.useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    // console.log(article);
    const twitterTag = ['CSCI_571_NewsApp'];
    return (
      <>
      <IoMdShare onClick={handleShow}/>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title><h4 style={{marginBottom:"0", fontWeight:"650"}}>{article.source}</h4>{article.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h4 style={{textAlign:"center"}}>Share Via</h4>
                <FacebookShareButton style={{float:"left", marginLeft:"8%"}} url={article.shareUrl} quote={article.title} hashtag="#CSCI_571_NewsApp">
                    <FacebookIcon size={55} round />
                </FacebookShareButton>
                <TwitterShareButton url={article.shareUrl} quote={article.title} hashtags={twitterTag}>
                    <TwitterIcon size={55} round />
                </TwitterShareButton>
                <EmailShareButton style={{float:"right", marginRight:"8%"}} url={article.shareUrl} subject = "#CSCI_571_NewsApp" >
                    <EmailIcon size={55} round />
                </EmailShareButton>
        </Modal.Body>
        </Modal>
      </>
    );
}


class Bookmark extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            articles : JSON.parse(localStorage.getItem('articleArr'))
        };
        var keyword = "";
        localStorage.setItem('keyword', keyword);
    }
    

    modalClick(event){
        event.preventDefault();
    }

    notify = article => (event)=>{
        event.preventDefault();
        this.state.articles = JSON.parse(localStorage.getItem('articleArr'));
        for(var i = 0; i < this.state.articles.length; i ++){
            if(this.state.articles[i].title == article.title){
                toast("Removing "+article.title,{className:'black-text'});
                this.state.articles.splice(i,1);
                break;
            }
        }
        localStorage.setItem('articleArr', JSON.stringify(this.state.articles));
        if(this.state.articles.length==0)
            setTimeout(() =>{this.forceUpdate()}, 1200 );
        else
            setTimeout(() =>{this.forceUpdate()}, 1000 );
        // setTimeout(this.updatePage();
    }

    render(){
        if(this.state.articles == null || this.state.articles.length == 0){
            return(
            <div>
                <MyNavbar/>
                <h5 style={{fontWeight:"600", marginTop:"5px",textAlign:"center"}}>You have no saved articles</h5> 
            </div>
            );
        }
        else{
        return(
            <div>
            <MyNavbar/>
                <h4 className="headerText">Favorites</h4>
                <div className="rowContent"> 
                {
                    this.state.articles.map(article => (
                        <Link className='news-articles' to= {articleUrl(article.articleId)}>
                            <div >
                                <div className="article_header">
                                    <b><i>{articleTitle(article.title)}</i> </b>
                                    <span onClick={this.modalClick}><MyModal title={article.title} shareUrl={article.shareUrl} source = {newsSource(article.source)}/></span>
                                    <span><MdDelete onClick={this.notify(article)}/>
                                    <ToastContainer transition= {Zoom} autoClose={1700} hideProgressBar={true} position="top-center" />
                                    </span>
                                </div>
                                <div className='articleImage'>
                                    <img src={article.image}/>
                                </div>
                                <div className='articleFooter'>
                                    <p><i>{article.date}</i> 
                                    <span className={newsSource(article.source)} style={{marginLeft:"5px"}}>{newsSource(article.source)}</span>
                                    <span className={sectionColor(article.section).toLowerCase()}>{article.section}</span>
                                    </p>
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

export default Bookmark;