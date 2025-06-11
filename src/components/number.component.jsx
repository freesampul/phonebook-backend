import { deleteNumber } from "../services/numbers";
import React from 'react';
const Numbers = ({ persons, personState, notification, notificationType }) => {



    const handleDelete = (id) => {
        console.log(`Delete button clicked for person with id: ${id}`);
        if(window.confirm(`Are you sure you want to delete this person with id: ${id}?`)) {
         deleteNumber(id)
            .then(() => {
                console.log(`Person with id: ${id} deleted successfully`);
                notification(`Deleted person with id: ${id}`);
                setTimeout(() => {
                    notification(null);
                }, 5000);
                personState(persons.filter(person => person.id !== id)); 

            })
            .catch(error => {
                console.error(`Error deleting person with id: ${id}`, error);
            });
    }
    else {
        console.log(`Deletion cancelled for person with id: ${id}`);
    }
}
    return (
      <div>
        {persons.map((person, id) => (
          <div key={id}>
            {person.name} {person.number}
            {}
            <button onClick={() => handleDelete(person.id)}>delete</button>
          </div>
        ))}
      </div>
    )
  }

export default Numbers;