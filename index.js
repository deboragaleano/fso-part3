require('dotenv').config(); 
const express = require('express');
const morgan = require('morgan'); 
const cors = require('cors')
const Person = require('./models/person'); 
const { response } = require('express');
const app = express();

app.use(express.static('build'))

//adding cors to allow requests from all origins 
app.use(cors())

// The json-parser middleware should be among the very first middleware 
// loaded into Express,if not then "body" will be undefined
app.use(express.json()); 

/**** Adding the morgan middleware for logging (give info about requests, etc.)****/

// create a new token for showing body
// use stringify for converting [object, object] into a string
morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//Data is fetched from Database
app.get('/api/persons', (req, res) => {
    Person
        .find({}).then(persons => {
            res.json(persons); 
        })
})

/***CHECK IF CORRECT***/
// Info route 
app.get('/info', (req, res, next) => {
    Person.find({})
        .then(persons => {
            const date = new Date(); 
            const info = 
            `<div>
                <p>Phonebook has info for ${persons.length} people</p>
                <p>${date}</p>
            </div>`
        
            res.send(info)
        })
        .catch(err => next(err))
})


//Display info for a single entry
app.get('/api/persons/:id', (req, res, next) => {
    // fetching an individual note gets changed into the following: 
    Person.findById(req.params.id)
        .then(person => {
            if(person) {
                res.json(person)
            } else {
                res.status(404).end() //not found
            }
        }) 
        // the error that is passed forwards is given to the next function as a parameter. 
        //  the execution will continue to the error handler middleware 
        .catch(error => next(error))
})

//Adding entries
app.post('/api/persons', (req, res, next) => {

    //**TODO**: Check if this is the right way of handling both errors
    if(!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'name/number is missing'
        })
    }

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
        .catch(err => next(err))         
})

/***CHECK IF CORRECT***/
// Put / update route/request 
app.put('/api/persons/:id', (req, res, next) => {
    Person.find({}).then(persons => {
        persons.forEach(person => {
            if(person.name === req.body.name) {
                const opts = {new: true, runValidators: true}
                Person.findOneAndUpdate(req.params.id, {number: req.body.number}, opts)
                    .then(updatedPerson => {
                        res.json(updatedPerson)
                    })
                    .catch(err => next(err))
            }
        })
    })
})

//Deleting a a single entry 
app.delete('/api/persons/:id', (req,res, next) => {

    // The easiest way to delete a person from the database is with the findByIdAndRemove method:
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end() //status 204 no content - succesful delete
        })
        .catch(err => next(err)) 

})

/****** MIDDLEWARE FOR HANDLING ERRORS ********/ 

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
app.use(unknownEndpoint)

// Express error handlers are middleware that are defined 
// with a function that accepts 4 parameters. 
// Our error handler looks like this:

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    // The error handler checks if the error is a CastError exception, 
    // in which case we know that the error was caused by an invalid object id for Mongo
    // the response will have the status code 400 bad request 
    if(error.name === 'CastError'){
        return res.status(400).send({error: 'Error: malformatted id'})
    // When validating an object fails, we return the following default error message from Mongoose:
    } else if(error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }
    next(error)
}
app.use(errorHandler); 

/*******************************************/ 

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`);
})
