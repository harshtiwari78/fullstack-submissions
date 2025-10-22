import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/notes'

// fetch all notes
const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

// create a new note
const create = (newObject) => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

// update an existing note
const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

export default { getAll, create, update }