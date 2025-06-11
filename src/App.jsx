import { useState, useEffect } from 'react'
import React from 'react'
import axios from 'axios'
import Filter from './components/filter.component.jsx'
import Numbers from './components/number.component.jsx'
import { create, update } from './services/numbers.js'
import Notification from './components/Notification/notification.component.jsx'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')



useEffect(() => {
  axios.get('/api/persons')
    .then(response => {
      console.log('Data fetched successfully:', response.data)
      const data = Array.isArray(response.data) ? response.data : []
      const personsWithId = data.map(person => ({
        ...person,
        id: person._id
      }))
      setPersons(personsWithId)
    })
}, [])
//Genuinely wondering what i can do with thi

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  let display = persons.filter(person => person.name.includes(filter))

  const handleSubmit = (e) => {
    console.log('Form submitted')
    e.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        console.log('Updating existing person:', existingPerson)
       update(existingPerson.id, personObject)
          .then(response => {
            if (response) {
              const updatedPerson = { ...response, id: response._id }
              setPersons(persons.map(person => person.id !== existingPerson.id ? person : updatedPerson))
              setNewName('')
              setNewNumber('')
              setNotification(`Updated ${updatedPerson.name}`)
              setNotificationType('success')
              setTimeout(() => {
                setNotification(null)
              }, 5000)
            } else {
              console.error('Server did not return data:', response)
              setNotification(`Server did not return data`, response)
              setNotificationType('error')
              setTimeout(() => {
                setNotification(null)
              }, 5000)
            }
          })
          .catch(error => {
            console.error('Error updating person:', error)
            setNotification(`Error updating person`, error)
            setNotificationType('error')
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
        return
      }
    }



    console.log('Adding person:', personObject)
    create(personObject)
      .then(response => {
        if (response) {
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
          setNotification(`Added ${response.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        } else {
          console.error('Server did not return data:', response)
           setNotification(`Server did not return data`, response)
          setNotificationType('error')
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        }
      })
      .catch(error => {
        console.error('Error adding person:', error)
        setNotification(`Error adding person`, error)
          setNotificationType('error')
          setTimeout(() => {
            setNotification(null)
          }, 5000)
      })
  }

  // Removed local getAll function to avoid naming conflict with imported getAll

  return (
    <div>
      <Notification message={notification} type={notificationType}/>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <form onSubmit={handleSubmit}>
          name: <input className='name' onChange={handleNameChange}/>
        <div>
          number: <input className = 'number' onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Numbers persons={display} personState={setPersons} notification={setNotification} notificationTyp={setNotificationType} />
    </div>
  )
}

export default App