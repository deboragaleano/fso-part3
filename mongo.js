//MONGOOSE DATABASE 
const mongoose = require('mongoose');

if(process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

// console.log(process.argv);
const password = process.argv[2]

const url = `mongodb+srv://debygalser:${password}@cluster0.kymws.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err)); 

// First we define the schema of a person that is stored in the personSchema variable. 
// The schema tells Mongoose how the note objects are to be stored in the database.
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// In the Person model definition, the first "Person" is the singular name of the model. // The name of the collection will be the lowercased plural people(not persons this time), Mongoose convention adds it automatically
const Person = mongoose.model('Person', personSchema)

//the application creates a new note object with the help of the Person model:

const name = process.argv[3];
const number = process.argv[4]; 

const person = new Person({
    name: name,
    number: number
})

// FIND: 
// The objects are retrieved from the database with the find method of the Person model.

if(process.argv.length < 4) {
    Person
        .find({}) //Print in the console 
        .then(persons => {
            console.log('phonebook:');
            persons.forEach(p => {
                console.log(p.name, p.number);
        })
        mongoose.connection.close() //the correct place for the database connection is at the end of the callback function
    })
} else { //Save 
    person.save().then(result => {
        console.log(`added ${name} ${number} to phonebook`);
        mongoose.connection.close()
    })  
}


// SAVE
// Models are constructor functions that create new JS objects based on the provided parameters. 
// Since the objects are created with the model's constructor function, they have all the properties of the model
// which include methods for saving the object to the database.
// Saving the object to the database happens with the appropriately named save method, that can be provided with an event handler with the then method:
// person.save().then(result => {
//     console.log(`added ${name} ${number} to phonebook`);
//     mongoose.connection.close()
// })

