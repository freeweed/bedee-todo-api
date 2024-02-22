const fs = require('fs')
const uuid = require('uuid');
const filePath = './data.json'
function writeFile(data){
    fs.writeFileSync(filePath, JSON.stringify(data)); 
}

class TodoRepository{
    constructor(){
        this.data = require(filePath)
    }

    create(todo){
        todo.id = uuid.v4()
        todo.isDone = 0
        this.data.push(todo)
        writeFile(this.data)
        return todo.id;
    }

    findAll(){
        return this.data
    }

    findOne(id, returnType = 'object'){
        const index = this.data.findIndex(row => row.id == id)
        if(index != -1){
            return (returnType === 'object') ? this.data[index] : index
        }else{
            return null
        }
    }

    update(id, todo){
        let index = this.findOne(id, 'index')
        if(index != null){
            todo.id = id
            this.data[index] = todo
            writeFile(this.data)
            return true
        }else{
            return false
        }
    }

    delete(id){
        let index = this.findOne(id, 'index')
        console.log("to delete: " + index)
        if(index != null){
            this.data = this.data.filter(row => row.id != id)
            console.log(JSON.stringify(this.data))
            writeFile(this.data)
            return true
        }else{
            return false
        }
    }
}
module.exports = TodoRepository