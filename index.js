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
    }
]

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

// app.post('/api/persons', (request, response) => {
//   const body = request.body
//   if (!body.name || !body.number) {
//     return response.status(400).json({
//       error: 'name or number is missing'
//     })

//   }
//   const person_name_filter = persons.filter( person => person.name == body.name)
//   if (person_name_filter.length > 0) {
//     return response.status(400).json({
//       error: 'name must be unique'
//     })
//   }

//   function getRandomInt(max) {
//     return Math.floor(Math.random() * max);
//   }


//   const person = {
//     name: body.name,
//     number: body.number,
//     id: getRandomInt(100),
//   }

//   persons = persons.concat(person)

//   response.json(person)
// })

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

// app.get('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const person = persons.find(person => person.id === id)
//   if (person) {
//     response.json(person)
//   } else {
//     console.log('No person found')
//     response.status(404).end()
//   }
// })

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
