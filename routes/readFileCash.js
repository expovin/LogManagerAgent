var config = require('../config');
var fs = require('fs');
var async = require("async");
var JSONData={};

	    var NomeFile={};
	    var Record={};
	    var Component={};
	    var Level={};
	    var Type={};
	    var Host={};
	    var Records=[];
	    var NomeCampi=[];



var LogReader = {  

    init: function(){    
        console.log("Initialize");

    },


    getRecords: function(layer,level,callback){

	    // File impostato per debug
	    fs.readdir(config.logPath+layer+"\\"+level+"\\", function(err, items) {
	    	console.log("Numero di file :"+ items.length);
	    	if(items.length > 0) {
	            for (var i=0; i<items.length; i++) {


				    nomeFile=items[i];

				    // Let's split the file name into SeverName, LayerName and LevelName
					FileName = nomeFile.split(".");
					FileLevel = FileName[0].split("_");
					HostName=FileLevel[0];
					LevelName=FileLevel[1];
					LayerName=FileLevel[2];


					var PathFile=config.logPath+layer+"\\"+level+"\\"+items[i];
					var stats = fs.statSync(PathFile);

					try{
						MDATE = JSONData[HostName][layer][level][LevelName]['Stats']['mtime'];
						//console.log(LevelName+" File in Memery >>> "+JSON.stringify(MDATE)+" File su disco >>> "+JSON.stringify(stats.mtime));

						if(stats.mtime.getTime() !== MDATE.getTime()) {
							//console.log("File "+PathFile+" cambiato. Lo rileggo e aggiorno");
							readFile(PathFile,stats,level,callbackRead);
						}
						//else
							//console.log("File non variato, invio cio che ho in memoria");


					} catch(e){
						//console.log("File "+LevelName+" non ancora letto! "+e);
						readFile(PathFile,stats,level,callbackRead);
					}  
			    }
			    //console.log("Pulizia!");
			    Host={};
			    Type={};
			    Level={};
			    Component={};
			    
			    callback(null, JSONData[HostName]);
			}
			else
			//callback(null, JSONData[HostName]);
			  callback(null, JSONData);
		});

    },
    gerComponents: function(callback){

    	var fileList=[];
    	var index;
        fs.readdir(config.logPath, function(err, items) {
        	index= items.indexOf("AppMigration");
        	items.splice(index,1);

        	index= items.indexOf("DataProfiling");
        	items.splice(index,1);

        	index= items.indexOf("Script");
        	items.splice(index,1);

        	callback(null, items);
            
        }); 
    },

    getLayer: function(layer,callback){

    	var MyData={};

    	console.log("Leggo in "+config.logPath+layer);
    	var items = fs.readdirSync(config.logPath+layer+"/"); 
    	count=0;
    	numDir=0;
    	
    	async.forEach(items, function(item, Mycallback) {
    		console.log(item);
			var PathFile=config.logPath+layer+"\\"+item;
			var stats = fs.statSync(PathFile);
			
			//console.log("count : "+count+" di "+items.length);
			if(stats.isDirectory()) {
				numDir++;
				//console.log("Folder da elaborare : "+item+" "+JSON.stringify(stats));
		        LogReader.getRecords(layer,item,function(err,data){
		        	count++;
		        	console.log(data);
		        	MyData=data;

		            console.log("count : "+count+" di "+numDir);
		            if(count == numDir)
		            	callback(null,MyData[layer]);
		        });
		    }


    	},function(err) {
    		//console.log("Finito!");
    		callback(null,MyData);
    	});
    	
    }
};

module.exports = LogReader;  



var callbackRead = function(Host,level){
	try{		
		JSONData[HostName][LayerName][level][LevelName]=Host[HostName][LayerName][level][LevelName];		// WIN-PL3FATROBTJ.Proxy.System.Service
		//console.log("LVL4");
	} catch(e){
		try{
				//console.log(e);

				JSONData[HostName][LayerName][level]=Host[HostName][LayerName][level];		// WIN-PL3FATROBTJ.Proxy.System
				//console.log("LVL3");				
			}catch(e1){
				try{		
					//console.log(e1);			
					JSONData[HostName][LayerName]=Host[HostName][LayerName];		// WIN-PL3FATROBTJ.Proxy
					//console.log("LVL2");
			}catch(e2){
				//console.log(e2);
				JSONData[HostName]=Host[HostName];				//  WIN-PL3FATROBTJ
				//console.log("LVL1");
			}
		}
	}	
};

var readFile = function  (PathFile,stats,level,callback){

	Records=[];
	Record={};
	NomeCampi=[];

	var data = fs.readFileSync(PathFile);
	rows = data.toString().split("\r\n");			        

	for(row in rows){
	   	if(row == 0){
	   		NomeCampi=rows[row].split("\t");
	    }
		else{
	   		fields = rows[row].split("\t");
	    	for(field in fields){
	    		Record[NomeCampi[field]]=fields[field];
		    }
			Records.push(Record);
			var Record = {};
		}
	}
				
	Component[LevelName] = {'Stats':stats,'Header':NomeCampi,'Records':Records};    // Performance, Security, System... File name
	Level[level]=Component;															// Audit, System, Trace .... Directory
	Type[LayerName]=Level;															// Engine, Proxy, Scheduler, Repository  ... Layer
	Host[HostName]=Type;															// WIN-PL3FATROBTJ Nome Host

	callbackRead(Host,level);
};

