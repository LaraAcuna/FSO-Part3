const mongoose = require('mongoose')
if (process.argv.length < 3) {
  console.log('give password, name and number as argument to upload a new person in the phonebook. give password only to show all entries')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://laraacuna:${password}@cluster0.xygj9sq.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(() => {
    console.log('person saved!')
    mongoose.connection.close()
  })
} else {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
