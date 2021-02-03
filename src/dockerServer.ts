import Docker from 'dockerode'


class dockerServer {

    connectionObject: Docker.DockerOptions
    docker: Docker

    constructor(connectionObject: Docker.DockerOptions) {
        this.connectionObject = connectionObject
        this.docker = new Docker(connectionObject)
        return this
    }

    getContainers() : Promise<Docker.ContainerInfo[]> {
	    return this.docker.listContainers()
    }

    getInfo() {

    }
    
    // hookupEvents() {
    //     this.docker.getEvents({filters: {'container': ['cadvisor']}}, function (err, data) {
    //         if(err){
    //             console.log(err.message);
    //         } else {
    //             data.on('data', function (chunk) {
    //                 console.log(JSON.parse(chunk.toString('utf8')))
    //             })
    //         } 
    //     })
    // }
       
}
  
export default dockerServer