import axios from 'axios'
// This file is used to interact with the backend API for managing phonebook entries.
//Need to bring in mongo 
// and axios for making HTTP requests.


const mongoUrl =`mongodb+srv://sampulaski:MfGRDw46gYHkAO1T@cluster0.2ogprwi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}
const deleteNumber = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}


export { getAll, create, update, deleteNumber }

