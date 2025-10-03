import { useState, useEffect } from 'react'
import personService from './services/persons'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import NotificationBar from './components/NotificationBar'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  
  const [newNumber, setNewNumber] = useState('')
  
  const [newName, setNewName] = useState('')

  const [filter, setFilter] = useState('')

  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  // Handle input change
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  // Handle form submit
  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if(window.confirm(
        `${newName} is already added to phonebook, replace the old number with the new one?`
      )) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        personService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')

          setMessage(`Updated ${returnedPerson.name}'s number`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
      }
    } else {
      const personObject = { name: newName, number: newNumber }
    
    personService
    .create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')

      setMessage(`Added ${returnedPerson.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })
  }
}

    

// delete person
const deletePerson = (id) => {
  const person = persons.find(p => p.id === id)

  if(window.confirm(`Delete ${person.name}?`)){
    personService.remove(id).then(() => {
      setPersons(persons.filter(p => p.id !== id))
    })
  }
}

const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase())
  )


  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <NotificationBar message={message}/>

      <h3>Add a new</h3>
      <PersonForm
      newName={newName}
      handleNameChange={handleNameChange}
      newNumber={newNumber}
      handleNumberChange={handleNumberChange}
      addPerson={addPerson}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} deletePerson={deletePerson} />

      {/* Debugging */}
      <div>debug: {newName}</div>
    </div>
  )
}

export default App