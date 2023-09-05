require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
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
/*let persons = [
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
]*/

const generateId = () => {
    return Math.floor(Math.random() * 9999)
}
app.get('/info', (request, response) => {
    Person.countDocuments({})
        .then(count => {
            const now = new Date()
            response.send(
                `<p>Phonebook has info for ${count} people</p>
            <p>${now}</p> `
            )
        })

})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person)
            response.json(person)
        else
            response.status(404).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(count => {
        response.status(204).end()
    })
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

    const person = new Person({
        name: params.name,
        number: params.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})
/*
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
    persons = persons.concat(person)
    response.json(person)
})*/

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})