var Docker = require('dockerode');


class dockerServer {

    constructor(connectionObject) {
        this.connectionObject = connectionObject
        this.docker = new Docker(connectionObject)
        return this
    }

    getContainers() {
	    return this.docker.listContainers()
    }

    getInfo() {

    }
    
    hookupEvents() {
        this.docker.getEvents({filters: {'container': ['cadvisor']}}, function (err, data) {
            if(err){
                console.log(err.message);
            } else {
                data.on('data', function (chunk) {
                    console.log(JSON.parse(chunk.toString('utf8')))
                })
            } 
        })
    }
        
}


  
module.exports = dockerServer