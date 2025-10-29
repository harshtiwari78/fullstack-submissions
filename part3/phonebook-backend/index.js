const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/persons')

// --- Middleware Setup ---

app.use(cors())
app.use(express.json()) // Required to access req.body
app.use(express.static('dist'))

// Custom morgan token definition must come before the middleware use
morgan.token('body', (req, res) => {
    // Only stringify the body for POST requests to keep logs clean
    if (req.method === 'POST' && req.body) {
        return JSON.stringify(req.body);
    }
    return '';
})

// Custom format uses the defined 'body' token
const customFormat = ':method :url :status :res[content-length] - :response-time ms :body'

// Use the custom morgan format only once
app.use(morgan(customFormat))


// --- Routes ---

// Define API endpoint to fetch the collection of persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

// Route: /info
app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        const currentTime = new Date();
        const infoResponse = `
        <p>Phonebook has info for ${count} people</p>
        <p>${currentTime}</p>
        `;
        response.send(infoResponse);
    })
})

// Route: Get a single person by ID
app.get('/api/persons/:id', (request, response, next) => { // Added 'next' here
    const id = request.params.id

    Person.findById(id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error)) // Delegate potential CastError
})

// Route: Delete a person
app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end() // 204 No Content for successful deletion
        })
        .catch(error => next(error))
})

// Route: Add a new person
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

// Route: Update a person's number
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const id = request.params.id

    const person = {
        name: body.name,
        number: body.number,
    }

    // Run validators on update
    Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
      .then(updatedPerson => {
        if(updatedPerson) {
            response.json(updatedPerson)
        } else {
            response.status(404).send({ error: 'Person not found' })
        }
      })
      .catch(error => next(error)) // Delegate validation or malformed ID errors
})


// --- Error Handling Middleware ---

// Must come after all routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Error handler must be the last loaded middleware, with four arguments
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        // Mongoose ID malformation
        return response.status(400).send({ error: 'malformatted id' })
    }

    if(error.name === 'ValidationError'){
        // Mongoose Schema validation failed (e.g., number format is wrong)
        return response.status(400).json({ error: 'Internal Server Error' })
    }
    
    // FIX: If error is not handled, log it and send a 500 error 
    // instead of calling next(error) which can crash the server flow.
    // If you need to debug other errors, you can add more checks here.
    return response.status(500).send({ error: 'Internal Server Error' })
}

app.use(errorHandler)

// --- Server Startup ---

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
