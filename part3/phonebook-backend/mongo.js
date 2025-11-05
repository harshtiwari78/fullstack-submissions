const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

if (!password) {
    console.log('Error: Please provide the passwprd as a command-line argument.')
    process.exit(1)
}

const url = `mongodb+srv://harshtiwari787898:Wayne91@cluster0.vx0ep.mongodb.net/phonebook-app?retryWrites=true&w=majority&appName=Cluster0
`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
    const person = new Person({
        name: name,
        number: number,
    })

    person.save()
     .then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        return mongoose.connection.close()
     })
     .catch(error => {
        console.error('Error saving person:', error.message)
        mongoose.connection.close()
     })
}

else if (password && !name && !number) {
    Person
     .find({})
     .then(persons => {
        console.log('phonebook:')
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
     })
} else {
    console.log('Error: Invalid number of arguments. Use: "node mongo.js password name number" OR "node mongo.js password"')
    mongoose.connection.close()
}