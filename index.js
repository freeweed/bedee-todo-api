const express = require('express')
const bodyParser = require('body-parser')
const Joi = require('joi')
const repository = require('./repository')
const schema = require('./schema')

const port = '3000'
const app = express()
const todo = new repository()

app.use(bodyParser.json())

function validate(schemaName, body){
    let validator = Joi.object(schema[schemaName])
    return validator.validate(body)
}

app.get('/todo', (req, res) => {
    res.send(todo.findAll())
})

app.get('/todo/:id', (req, res) => {
    let status = 200
    let response = {}
    try{
        let _todo = todo.findOne(req.params.id)
        if(_todo){
            response = _todo
        }else{
            status = 404
            response = {
                'message': `todo id ${req.params.id} is not found`
            }
        }
    }catch(err){
        status = 500
        response = {
            "message": "error while get todo",
            "error": err
        }
    }
    res.status(status).send(response)
})

app.post('/todo', (req, res) => {
    let status = 200
    let response = {}
    try{
        let check = validate('create', req.body)
        if(check.error){
            status = 400
            response = {
                "message": check.error.details
            }
        }else{
            const id = todo.create(req.body);
            response = { id }
        }
    }catch(err){
        status = 500
        response = {
            "message": "error while create todo",
            "error": err
        }
    }
    res.status(status).send(response)
})

app.put('/todo/:id', (req, res) => {
    let status = 200
    let response = {}
    try{
        let check = validate('update', {...req.params, ...req.body})
        if(check.error){
            status = 400
            response = {
                "message": check.error.details
            }
        }else{
            let result = todo.update(req.params.id, req.body)
            if(result){
                response = {
                    "id": req.params.id,
                    "message": "update todo success"
                }
            }else{
                status = 404
                response = {
                    'message': `todo id ${req.params.id} is not found`
                }
            }
        }
    }catch(err){
        status = 500
        response = {
            "message": "error while update todo",
            "error": err
        }
    }
    res.status(status).send(response)
})

app.delete('/todo/:id', (req, res) => {
    let status = 200
    let response = {}
    try{
        let result = todo.delete(req.params.id)
        if(result){
            response = {
                "id": req.params.id,
                "message": "delete todo success"
            }
        }else{
            status = 404
            response = {
                'message': `todo id ${req.params.id} is not found`
            }
        }
    }catch(err){
        status = 500
        response = {
            "message": "error while delete todo",
            "error": err
        }
    }
    res.status(status).send(response)
})

app.listen(port, () => {
    console.log(`Start service at port ${port}`)
})
