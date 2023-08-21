const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})
const log = (tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.body(req, res)
    ].join(' ')
}
app.use(morgan(log))
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    },
    {
        "id": 5,
        "name": "Johnny Salgo",
        "number": "222-1234-567"
    }
]

const generateId = () => {
    return Math.floor(Math.random() * 9999)
}
app.get('/info', (request, response) => {
    const now = new Date()
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${now}</p> `
    )
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const params = request.body

    if (!params.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }

    if (!params.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    if (persons.some(person => person.name === params.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: params.name,
        number: params.number
    }
    persons = persons.concat(person)
    response.json(person)
})

app.put('/api/persons/:id', (request, response) => {
    const params = request.body
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (!params.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    person.number = params.number
    persons = persons.filter(person => person.id !== id)
    persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})