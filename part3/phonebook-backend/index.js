const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/persons')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.use(morgan('tiny'))

const customFormat = ':method :url :status :res[content-length] - :response-time ms :body'

app.use(morgan(customFormat))



// Define API endpoint to fetch the collection of persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

// NEW ROUTE: /info
// FIX for /info in index.js
app.get('/info', (request, response) => {

    Person.countDocuments({}).then(count => {
        // 👇 FIX: Use 'count' directly, remove the undefined 'persons.length'
        const currentTime = new Date();

        const infoResponse = `
        <p>Phonebook has info for ${count} people</p>
        <p>${currentTime}</p>
        `;
        response.send(infoResponse);
    }) 
})
``
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.findById(id).then(person => {
        if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    })
})

app.get('/api/notes', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  }) 
})

// FIX for DELETE /api/persons/:id
app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    // Use Mongoose findByIdAndRemove (or findByIdAndDelete)
    Person.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end() // 204 No Content for successful deletion
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    const person = new Person ({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const id = request.params.id

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(id, person, { new: true })
      .then(updatedPerson => {
        if(updatedPerson) {
            response.json(updatedPerson)
        } else {
            response.status(404).send({ error: 'Person not found' })
        }
      })
      .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})