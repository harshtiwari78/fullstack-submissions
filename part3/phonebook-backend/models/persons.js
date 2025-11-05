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
    number: {
      type: String,
      minLength: 8,
      required: true,
      validate: {
         validator: function(v) {
            return /^(\d{2}|\d{3})-\d+$/.test(v)
         },
         message: props => `${props.value} is not a valid phone number!
                             Must be 8+ DOMStringList, seperated by '-',
                             with the first part being 2 or 3 digits (e.g., 09-1234556).`  
      },
    }
 })

 personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
 })

 module.exports = mongoose.model('Person', personSchema)