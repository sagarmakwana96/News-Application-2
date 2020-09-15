var express = require('express');
var app = express();
var cors = require('cors')
const fetch = require("node-fetch");

app.use(cors())

app.get('/home/:source', (req, res) => {
    var newsSource = req.params.source;
    console.log(newsSource);	
    var url = "";
    if(newsSource == "true"){
        url = "https://content.guardianapis.com/search?api-key=d53c9e4d-5261-4e55-ada8-2dcd03e8af91&section=(sport|business|technology|politics)&show-blocks=all";
    }
    else{
        url = "https://api.nytimes.com/svc/topstories/v2/home.json?api-key=uZlG9qqKQS3kvCfnQMnk8DTHJ0viWa9c";
    }
	fetch(url)
	.then(res => res.json())
	.then(data => {
		res.send({ data});
	})
	.catch(err => {
		res.redirect('/error');
	});
});

app.get('/section/:source/sectionName/:sectionName', (req, res) => {
    var newsSource = req.params.source;
    var sectionName = req.params.sectionName;	
    var url = "";
    if(newsSource == "true"){
        url = "https://content.guardianapis.com/"+sectionName+"?api-key=d53c9e4d-5261-4e55-ada8-2dcd03e8af91&show-blocks=all";
    }
    else{
        url = "https://api.nytimes.com/svc/topstories/v2/"+sectionName+".json?api-key=uZlG9qqKQS3kvCfnQMnk8DTHJ0viWa9c";
    }
	fetch(url)
	.then(res => res.json())
	.then(data => {
		res.send({ data});
	})
	.catch(err => {
		res.redirect('/error');
	});
});

app.get('/fullArticle/:articleId/source/:source', (req, res) => {
    var articleId = req.params.articleId;
    articleId=articleId.replace(/_/g, "/");
    var source = req.params.source;	
    var url = "";
    if(source == "true"){
        url = "https://content.guardianapis.com/"+articleId+"?&api-key=d53c9e4d-5261-4e55-ada8-2dcd03e8af91&show-blocks=all";
    }
    else{
        url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:(\""+articleId+"\")&api-key=uZlG9qqKQS3kvCfnQMnk8DTHJ0viWa9c";
    }
	fetch(url)
	.then(res => res.json())
	.then(data => {
		res.send({ data});
	})
	.catch(err => {
		res.redirect('/error');
	});
});

app.get('/searchResults/:keyword/source/:source', (req, res) => {
    var keyword = req.params.keyword;
    var source = req.params.source;	
    var url = "";
    if(source == "true"){
        url = "https://content.guardianapis.com/search?q="+keyword+"&api-key=d53c9e4d-5261-4e55-ada8-2dcd03e8af91&show-blocks=all";
    }
    else{
        url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q="+keyword+"&api-key=uZlG9qqKQS3kvCfnQMnk8DTHJ0viWa9c";
    }
	fetch(url)
	.then(res => res.json())
	.then(data => {
		res.send({ data});
	})
	.catch(err => {
		res.redirect('/error');
	});
});

app.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist.");
});

app.listen(8081, function () {
    console.log('Example app listening on port 4000.');
});


