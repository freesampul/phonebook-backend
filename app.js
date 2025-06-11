const express = require('express');
const http = require('http');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: '.env' });



const pass = process.env.MONGODB_PASSWORD
if (!pass) {
  console.error('MONGODB_PASSWORD is not set in .env file')
  process.exit(1)
}

const url = `mongodb+srv://sampulaski:${pass}@cluster0.2ogprwi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const numberSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
    minlength: 3
  },
  number: {
    required: true,
    type: String,
  }
})

const Number = mongoose.model('Number', numberSchema)


// number.save()
//   .then(result => {
//     console.log('Number saved:', result)
//     mongoose.connection.close()
//   })
//   .catch(error => {
//     console.error('Error saving number:', error)
//     mongoose.connection.close()
//   })

Number.find({})
  .then(result => {
    console.log('Numbers:', result)

  })
  .catch(error => {
    console.error('Error fetching numbers:', error)
    res.status(500).json({ error: 'Failed to fetch numbers' });
    mongoose.connection.close()
  })

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

const phoneNumbers = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];



app.get('/api/persons/:id', (req, res) => {
  Number.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => {
      res.status(400).json({ error: 'malformatted id' });
       console.error('Error fetching person:', error);
    });
});

app.get('/info', (req, res) => {
  const date = new Date();
  const count = phoneNumbers.length;
  res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
});

app.get('/api/persons', (req, res) => {
  // Fetching all persons
  Number.find({})
    .then(numbers => {
      res.json(numbers);
    })
    .catch(error => {
      console.error('Error fetching numbers:', error);
      res.status(500).json({ error: 'Failed to fetch numbers'  });
    });
});

app.delete('/api/persons/:id', (req, res) => {
  Number.deleteOne({ id: req.params.id })
    .then(result => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Person not found' });
      }
      res.status(204).end();
    })
    .catch(error => {
      console.error('Error deleting person:', error);
      res.status(500).json({ error: 'Failed to delete person' });
    });
});



const generateId = () => {
  const maxId = phoneNumbers.length > 0
    ? Math.max(...phoneNumbers.map(p => Number(p.id)))
    : 0;
  return String(maxId + 1);
};

app.post('/api/persons', (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number missing' });
  }

  Number.findOne({ name: body.name }).then(existing => {
    if (existing) {
      return res.status(409).json({ error: 'Name must be unique' });
    }

    const newNumber = new Number({
      name: body.name,
      number: body.number
    });

    newNumber.save()
      .then(savedNumber => {
        console.log('Number saved:', savedNumber);
        res.status(201).json(savedNumber);
      })
      .catch(error => {
        console.error('Error saving number:', error);
        res.status(500).json({ error: 'Failed to save number' });
      });
  });
});


//Update existing person, if the name is the same, update the number
app.put('/api/persons/:id', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number missing' });
  }

  Number.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => {
      console.error('Error updating person:', error);
      res.status(400).json({ error: 'malformatted id' });
    });
});

// Start server
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});