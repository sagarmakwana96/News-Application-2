import React, { Component } from 'react';
import { FacebookShareButton, EmailShareButton, TwitterShareButton } from 'react-share';
import { FacebookIcon, EmailIcon, TwitterIcon} from 'react-share';
import './ExpandedArticle.css';
import { FaRegBookmark } from 'react-icons/fa';
import { FaBookmark } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import ToggleBox from "./ToggleBox";
import FullContent from "./FullContent";
import CommentBox from '.././CommentBox/CommentBox';
import MyNavbar from '.././MyNavbar/MyNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";
import ReactTooltip from 'react-tooltip'
import {Zoom} from 'react-toastify';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: black;
`;

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
        try{
            if(article.multimedia.length!=0){
                // console.log(article.multimedia);
                for(var i = 0; i < article.multimedia.length; i ++){
                    if(article.multimedia[i].width>=2000){
                        var imageSrc = "https://www.nytimes.com/"+ article.multimedia[i].url;
                        // console.log(article.multimedia[i].width);
                        return imageSrc;
                    }
                }
                imageSrc = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
            }
            else{
                var imageSrc = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
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
    }
    else{
        title=article.headline.main;
    }
    return title;
}

function articleDescription(article,source,flag){
    var firstDescription="";
    var secondDescription="";
    var res;
    var fullDescription="";
    if(source==true){
        try{
            fullDescription = article.blocks.body[0].bodyTextSummary;
            res = article.blocks.body[0].bodyTextSummary.split(". ");
        }
        catch(err){
        }
    }
    else{
        try{
            if(article.abstract!=null)
            {
                fullDescription=article.abstract;
                res=article.abstract.split(". ");
            }
        }
        catch(err){
        }
    }
    if(flag==1){
        if(res.length<4){
            for(var i = 0; i<res.length-1; i++){
                firstDescription+=res[i]+". ";
            }
            firstDescription+=res[i];
        }
        else{
            for(var i = 0; i<4; i++){
                firstDescription+=res[i]+". ";
            }
        }
        return firstDescription;
    }
    else if(flag==2){
        return fullDescription;
    }
    else{
        for(var i = 4; i<res.length-1; i++){
            secondDescription+=res[i]+". ";
        }
        secondDescription+=res[i];
        return secondDescription;
    }
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
    return section;
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
var url;
var articleId;
var articleUrl;
class ExpandedArticle extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            error : null,
            isLoaded : false,
            loading:true,
            articleArr: [],
            article : []        
        };
        // localStorage.setItem('keyword', "Enter Keyword .."); 
        var keyword = "";
        localStorage.setItem('keyword', keyword);
        localStorage.setItem('toggle', "close");
        if(localStorage.getItem('articleArr')==null){
            localStorage.setItem('articleArr', JSON.stringify(this.state.articleArr));
        }
    }

    componentDidMount() {
        articleId = this.props.location.search;
        articleUrl = this.props.location.search;
        // console.log(articleUrl.substring(4))
        if(articleId.substring(1,3)=="ny")
        {
            source=false;
            articleId = this.props.location.search;
            articleId =articleId.substring(4).replace(/\//g, "_");
            url = "http://newsapp-sagarmakwana96.us-east-1.elasticbeanstalk.com/fullArticle/"+articleId+"/source/"+source;
            fetch(url)
            .then( response => response.json())
            .then(
                // handle the result
                (result) => {
                    this.setState({
                        isLoaded : true,
                        article : result.data.response.docs[0]
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
            articleId = this.props.location.search;
            articleId = articleId.substring(4).replace(/\//g, "_");
            url = "http://newsapp-sagarmakwana96.us-east-1.elasticbeanstalk.com/fullArticle/"+articleId+"/source/"+source;
            fetch(url)
            .then( response => response.json())
            .then(
                // handle the result
                (result) => {
                    this.setState({
                        isLoaded : true,
                        article : result.data.response.content
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

    notify = article => (event)=>{
        var toggleClick = "open";
        localStorage.setItem("toggle", toggleClick);

        console.log("notify");
        var flag = 0;
        event.preventDefault();
        var articleArr = JSON.parse(localStorage.getItem('articleArr'));
        var articleObj = {'title':articleTitle(article,source), 'image':imageSrc(article,source), 
                        'date': articleDate(article,source), 'section': articleSection(article,source), 
                        'source': source, 'shareUrl' : shareUrl(article,source), 'articleId' : articleUrl};
        if(articleArr.length == 0){
            articleArr.push(articleObj);
            toast("Saving "+articleTitle(article,source),{className:'black-text'});
        }
        else{
            for(var i = 0; i < articleArr.length; i ++){
                if(articleArr[i].title == articleObj.title){
                    toast("Removing "+articleTitle(article,source),{className:'black-text'});
                    articleArr.splice(i,1);
                    flag = 1;
                    break;
                }
            }
            if(flag == 0){
                articleArr.push(articleObj);
                toast("Saving "+articleTitle(article,source),{className:'black-text'});
            }
        }
        this.forceUpdate();
        
        localStorage.setItem('articleArr', JSON.stringify(articleArr));
    }


    // bookmark = article => (evt)=>{
    bookmark(article){
        console.log("bookmark")
        var articleArr = JSON.parse(localStorage.getItem('articleArr'));
        if(articleArr == null || articleArr.lenght == 0){
            return "FaRegBookmark"
        }
        else{
            for(var i = 0; i < articleArr.length; i ++){
                if(articleArr[i].title == articleTitle(article,source)){
                    return "FaBookmark";
                }
            }
        }
        return "FaRegBookmark";
    }

    render(){
        const {error, isLoaded, article} = this.state;
        const twitterTag = ['CSCI_571_NewsApp'];
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
                    <MyNavbar/>
                    <div className="expandedArticle">
                        <div className="articleHeader">
                            <h4 style={{fontWeight:"550"}}><i>{articleTitle(article,source)}</i></h4>
                            <p style={{fontSize:"16px", marginBottom: "12px"}}><i style={{marginLeft:"8px"}}>{articleDate(article,source)}</i>
                                <span className="shareButton">
                                <FacebookShareButton data-for="Facebook" data-tip="Facebook" url={shareUrl(article,source)} quote={articleTitle(article,source)}hashtag="#CSCI_571_NewsApp">
                                    <FacebookIcon size={28} round />
                                </FacebookShareButton>
                                <ReactTooltip id="Facebook" data-place="top" effect="solid" />
                                <TwitterShareButton data-for="Twitter" data-tip="Twitter" url={shareUrl(article,source)} quote={articleTitle(article,source)} hashtags={twitterTag}>
                                    <TwitterIcon size={28} round />
                                </TwitterShareButton>
                                <ReactTooltip id="Twitter" data-place="top" effect="solid" />
                                <EmailShareButton data-for="Email" data-tip="Email" url={shareUrl(article,source)} subject = "#CSCI_571_NewsApp" >
                                    <EmailIcon size={28} round />
                                </EmailShareButton>
                                <ReactTooltip id="Email" data-place="top" effect="solid" />
                                <IconContext.Provider value={{ color: "red"}}>
                                {this.bookmark(article)=="FaBookmark"?<FaBookmark value={{ color: "red"}} data-for="Bookmark" data-tip="Bookmark" onClick={this.notify(article)} style={{marginLeft: "55px"}}/>:<FaRegBookmark value={{ color: "red"}} data-for="Bookmark" data-tip="Bookmark" onClick={this.notify(article)} style={{marginLeft: "55px"}}/>}
                                <ReactTooltip id="Bookmark" data-place="top" effect="solid" />
                                </IconContext.Provider>
                                <ToastContainer transition= {Zoom} autoClose={2000} hideProgressBar={true} position="top-center"/>
                                </span>
                            </p>
                        </div>
                        <div className="articleBody">
                            <img src= {imageSrc(article,source)}/>
                            <p>{articleDescription(article,source,1)}</p>
                            <ToggleBox summary={articleDescription(article,source,2)}>
                                <FullContent fullContent={articleDescription(article,source,3)} />
                            </ToggleBox>
                        </div>      
                    </div>
                    <div className="commentBox" >
                        <CommentBox id = {articleUrl.substring(4)} />
                    </div>
                </div>
            )
        }
    }
}


export default ExpandedArticle;