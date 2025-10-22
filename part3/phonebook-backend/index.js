const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// app.use(morgan('tiny'))

morgan.token('body', (req, res) => {
    if (req.body) {
        return JSON.stringify(req.body);
    }
    return '';
})

const customFormat = ':method :url :status :res[content-length] - :response-time ms :body'

app.use(morgan(customFormat))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-52342434"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-56-764764"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "36-78-89876"
    },
]

// Define API endpoint to fetch the collection of persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// NEW ROUTE: /info
app.get('/info', (request, response) => {
    const numEntries = persons.length;

    const currentTime = new Date();

    const infoResponse = `
    <p>Phonebook has info for ${numEntries} people</p>
    <p>${currentTime}</p>
    `;
    response.send(infoResponse);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/api/notes', (request, response) => {
  // Return the 'persons' data array for the Notes frontend to consume
  response.json(persons) 
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id

    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = 100000000000
    return Math.floor(Math.random() * maxId)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    const nameExists = persons.find(p => p.name === body.name)
    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: String(generateId()),
    }
    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.port || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})