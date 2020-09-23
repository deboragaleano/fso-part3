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
let persons = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
]

//Data is fetched from Database
app.get('/api/persons', (req, res) => {
    Person
        .find({}).then(persons => {
            res.json(persons); 
        })
})

//**TODO**: Check if this is the right way of handling this error
app.get('/info', (req, res) => {
    const date = new Date(); 
    const info = 
    `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
    </div>`

    res.send(info)
})

//Display info for a single entry
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => id === p.id);

    if(person) {
        res.json(person)
        // handle error if not found 
    } else {
        res.status(404).end()
    }
})

//Deleting a a single entry 
app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id); 

    persons = persons.filter(p => p.id !== id) 

    //status 204 no content
    res.status(204).end()

})

//Adding entries
app.post('/api/persons', (req, res) => {

    //**TODO**: Check if this is the right way of handling both errors
    if(!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'name/number is missing'
        })
    }
    const isSameName = persons.find(p => p.name === req.body.name); 
    
    if(isSameName){
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    // //**TODO**: Check if this is the right way generating random IDs 
    // const generateId = () => {
    //     // this will get the max of an array with spread operator, and the map is to get
    //     // the id of each entry. The + 1 is to make sure it never uses the same id
    //     const maxId = Math.max(...persons.map(p => p.id)) + 1
    //     // generate number between 100 (max) and length of array (min) 
    //     return Math.floor(Math.random() * (100 - maxId) + maxId)
    // }

    const newPerson = {
        name: req.body.name, 
        number: req.body.number, 
        id: uuidv4()
    }

    persons = persons.concat(newPerson);

    res.json(newPerson); 
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`);
})