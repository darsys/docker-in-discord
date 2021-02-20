import Docker from 'dockerode'
import EventEmitter from 'events'
import container from './container'

class dockerServer extends EventEmitter {

    connectionObject: Docker.DockerOptions
    docker: Docker
    containers: container[]
    
    constructor(connectionObject: Docker.DockerOptions) {
        super()
        this.connectionObject = connectionObject
        this.init()
        console.log(`docker server initialized`)
    }

    async init() {
        this.connect()
        this.queryContainers()
    }

    connect() {
        this.docker = new Docker(this.connectionObject)
    }

    getContainers() {
        return this.containers
    }

    async queryContainers() {
        try {
            let newcontainers: container[] = []
            let containers = await this.docker.listContainers()    
            containers.slice(3,6).forEach( (containerInfo: any): any => {
                let containerName = containerInfo.Names[0].substring(1)
                console.log(`Container name: '${containerName}' id: '${containerInfo.Id}' image: '${containerInfo.Image}'`)
                let thisContainer: container = containerInfo
                thisContainer.name = containerInfo.Names[0].substring(1)
                thisContainer.container = this.docker.getContainer(containerInfo.Id)
                newcontainers.push(thisContainer)
            })
            this.containers = newcontainers
        } catch (error) {
            console.error(error)
        }
    }

    getContainer(id: string) {
        return this.containers.filter((container) => { return container.Id === id})
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