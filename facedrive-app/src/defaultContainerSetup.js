const path =require('path')
const docker= require('docker-compose')
const containerName='db.postgres.facedrive.com'
const containerPort= '5432'
console.log(docker)

exports.isContainerRunning = async function (){
      return new Promise(resolve,reject=>{
          docker.listContainers((err,containers)=>{
               if(err){
                reject(err.message)}
                let running = containers.filter(()=>{ containers.Names.includes(containerName)})
                resolve(running.length > 0)
          })
})} 

exports.runContainer = async function (){
    await docker.upOne(path.resolve(__dirname,'./postgres-db.yml')).then(res=>{
        console.log(res)
    })
    return "Container running: " + containerName + " on Port: "+ containerPort
}

exports.restartContainer = async function(){
   await docker.restartOne()
   return "Container restarted: " + containerName + "on Port: "+ containerPort
}

exports.killContainer=async function(){
    await docker.kill()
    return "Container killed: "+ containerName
}

