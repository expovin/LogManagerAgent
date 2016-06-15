# LogManagerAgent
v 1.0 

LogManagerAgent runs on the Qlik Sense Node, is in charge of reading the log files and expose them to the fullREST API Server.

##How to install it
Download the latest node stable version from [NodeJS site](https://nodejs.org/en/), install it and test if the installation finished succesfully checking the version of node and npm (node --version and npm --version).
Download and unzip the project in a suitable location in your hard drive and from within the project folder type

```sh
npm start
```

Now the Agent is ready to read the log file and expose them to the client side.

[Here](https://www.youtube.com/watch?v=Xcj8ZomCaoQ) you can find a short video on the Agent installation


##How does it work
LogManagerAgent is a fillREST API server which expose the Qlik Sense log file. To query it it's enought to send a HTTP GET request to the server (http://<serverName>/logs). This very first version has three end points:

* /               :  return all the layers installed on the server (Engine, Proxy, Repository, Printing, Scheduler)
* /:layer         :  return all logs from a layer
* /:layer/:level  :  return a layer from a specific layer folder (Trace, System, Audit)

When a browser (the client part) ask for a specific log, the Agent check whether the log has changed since the last reading operation, and read them only if new informations are available. All data will remain in memory for the forecoming requests.

##Known limits

This version runs in a console window, is not possible to run it as a window service
