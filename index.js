require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require("morgan")

const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


morgan.token('body', function(req) {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


app.get('/api/info', (request, response) => {
  const date = new Date()
  date.toUTCString()

  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}<\p>`
    
  )
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'name or number is missing' })
    }

    const person = new Person ({
      name: body.name,
      number: body.number,
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  person = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
