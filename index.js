const express = require('express');
const app = express();


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

app.use(express.json()); 

app.get('/api/persons', (req, res) => {
    res.json(persons); 
})


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

    const generateId = () => {
        // this will get the max of an array with spread operator, and the map is to get
        // the id of each entry. The + 1 is to make sure it never uses the same id
        const maxId = Math.max(...persons.map(p => p.id)) + 1
        // generate number between 100 (max) and length of array (min) 
        return Math.floor(Math.random() * (100 - maxId) + maxId)
    }

    const newPerson = {
        name: req.body.name, 
        number: req.body.number, 
        id: generateId()
    }

    persons = [...persons, newPerson];

    res.json(persons); 

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`);
})