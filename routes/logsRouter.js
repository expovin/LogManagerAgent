
    'use strict';
	var express = require('express');
	var bodyParser = require('body-parser');
	var reader = require('./readFileCash');


	var router = express.Router();

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

	router.use(bodyParser.json());

	// get all the Folder name in the logs dir
	router.route('/')
	.get(function(req,res,next){
    	reader.gerComponents(function(err,data){
    		res.json(data);
    	})
	});

	// get the content log file
	router.route('/:layer')    
	.get(function(req,res,next){    
		reader.getLayer(req.params.layer,function(err,data){		
			res.json(data);			
		});			
	});


	// get the content log file
	router.route('/:layer/:level')    
	.get(function(req,res,next){    
		reader.getRecords(req.params.layer,req.params.level,function(err,data){		
		    console.log(req.params.layer+" "+req.params.level);
		    console.log(data);	
		    try{
		    	res.json(data[req.params.layer][req.params.level]);	
		    } catch (e) {
		    	res.json(data[req.params.layer]);
		    }
					
		});			
	});


	//exports.router = router;
    module.exports = router;
