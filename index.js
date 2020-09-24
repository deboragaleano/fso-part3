require('dotenv').config()
const express = require('express');
// const morgan = require('morgan'); 
const cors = require('cors')
const { v4: uuidv4 } = require('uuid');
const Person = require('./models/person'); 
const app = express();

app.use(express.static('build'))

//adding cors to allow requests from all origins 
app.use(cors())


// Adding the morgan middleware for logging (give info about requests, etc.) 
// Configure it to log messages to your console based on the tiny configuration

//create a new token for showing body
//use stringify for converting [object, object] into a string
// morgan.token('body', (req) => {
//     return JSON.stringify(req.body)
// })

//**TODO**: Check if this is the right way of solving this exercise and 
// if the middlewares should be up here before the routes
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json()); 

//Data is fetched from Database
app.get('/api/persons', (req, res) => {
    Person
        .find({}).then(persons => {
            res.json(persons); 
        })
})

//Display info for a single entry
app.get('/api/persons/:id', (req, res) => {
    // fetching an individual note gets changed into the following: 
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
})

//Adding entries
app.post('/api/persons', (req, res) => {

    //**TODO**: Check if this is the right way of handling both errors
    if(!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'name/number is missing'
        })
    }
    
    // Person.find({}).then(result => {
    //     result.forEach(person => {
    //         if(person.name === req.body.name) {
    //             return res.status(400).json({
    //                 error: 'name must be unique'
    //             })
    //         }
    //         else {

    //         }
    //     })
    // })
        
    //using new Person constructor function
    const person = new Person({
        name: req.body.name,
        number: req.body.number
    })

    //save new person with save method that comes with Person model 
    person
        .save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
})

//Deleting a a single entry 
app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id); 

    persons = persons.filter(p => p.id !== id) 

    //status 204 no content
    res.status(204).end()

})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`);
})