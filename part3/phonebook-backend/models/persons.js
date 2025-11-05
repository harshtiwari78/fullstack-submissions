const mongoose = require('mongoose')

const url = `mongodb+srv://harshtiwari787898:Wayne91@cluster0.vx0ep.mongodb.net/phonebook-app?retryWrites=true&w=majority&appName=Cluster0
`

mongoose.set('strictQuery', false)

mongoose.connect(url)
 .then(result => {
    console.log('connected to MongoDB')
 })
 .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
 })

 const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    number: String,
 })

 personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
 })

 module.exports = mongoose.model('Person', personSchema)