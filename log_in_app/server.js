const express = require('express'); // Importing express
   const app = express(); // Creating an express app
   const bcrypt = require('bcrypt') // hasher
   const bodyParser = require('body-parser');
   const pool = require('./log_in_db.js'); // Import the database connection
   const path = require('path');
   const axios = require('axios');
   const jwt = require('jsonwebtoken');

   // Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory



   // Test the connection
pool.connect()
.then(() => {
    console.log('Connected to the database successfully!');
})
.catch(err => {
    console.error('Database connection error:', err.stack);
});

  // Set up the server to listen on port 3000
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });


    // Create a route that sends a response when visiting the homepage
    app.get('/home', (req, res) => {
        res.sendFile(path.join(__dirname, 'routes', 'home.html'));
      });

      app.get('', (req, res) => {
        res.sendFile(path.join(__dirname, 'routes', 'home.html'));
      });
  
     app.get('/#', (req, res) => {
      res.send('<h1>DEFAULT MESSAGE</h1>');
    });
  
    app.get('/createUser', (req, res) => {
      res.sendFile(path.join(__dirname, 'routes/', 'new_user.html'));
    });
  
    app.get('/log_in', (req, res) => {
      res.sendFile(path.join(__dirname, 'routes', 'log_in.html'));
    });

    app.get('/showContent', (req, res) => {
      res.sendFile(path.join(__dirname, 'routes/', 'content.html'));
    });

    app.get('/debug', (req, res) => {
      res.sendFile(path.join(__dirname, 'routes', 'debug.html'));
    });

    app.get('/admin_content', checkAccessLevel('admin'), (req, res) => {
      res.sendFile(path.join(__dirname, 'routes', 'admin_content.html'));
  });
  
  app.get('/content', checkAccessLevel('user'), (req, res) => {
      res.sendFile(path.join(__dirname, 'routes', 'content.html'));
  });

    function checkAccessLevel(requiredRole) {
      return async (req, res, next) => {
          const userEmail = req.body.emp_email; // Get email from request body
          const result = await pool.query(
                'SELECT access FROM users WHERE emp_email = $1', [userEmail]
              );
          if (!result) {
              return res.status(401).send('Unauthorized: User not found');
          }

          if (result.rows > 0)
          {
            const user_role = result.rows[0].access;
            if (user_role !== requiredRole) {
              return res.status(403).send('Forbidden: Insufficient permissions');
          }
          }
          next(); // User has the required access level
      };
  }


// Endpoint to handle form submission
app.post('/api/createNewUser', async (req, res) => {
    const { f_name, l_name, emp_email, password} = req.body;

    try {
        // const response = await axios.post('http://localhost:5000/hash_password', { password });
        // const hashedPassword = response.data.hashed_password;

        const validateEmail = await pool.query('SELECT * FROM users WHERE emp_email = $1', [emp_email]);

        if (validateEmail.rows > 0)
        {
          return res.status(409).json({ message: 'Email already registered.' });
        }

        const hashedPassword = await hashPassword(password);

        const result = await pool.query(
            'INSERT INTO users (f_name, l_name, emp_email, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [f_name, l_name, emp_email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {

        console.error('Error inserting event:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

async function hashPassword(plainPassword) {
  try {
      // Generate a salt
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(plainPassword, salt);
      
      return hashedPassword; // Return the hashed password
  } catch (error) {
      console.error('Error hashing password:', error);
      throw error; // Rethrow the error for handling in the calling function
  }
}

app.post('/api/check_log_in', async (req, res) => {
  const { emp_email, password} = req.body;

  try {
      const db_query = await pool.query('SELECT password, access FROM users WHERE emp_email = $1', [emp_email]);
      
      if (db_query.rows.length == 0)
      {
        return res.status(401).json({ message: 'Invalid username' })
      }
      
      const hashedPassword = db_query.rows[0].password;
      const userRole = db_query.rows[0].access;
      
      const match = await bcrypt.compare(password, hashedPassword);

      if (match) {
          // Password is correct
          return res.status(200).json({ message: 'Login successful', access: userRole });

      } else {
          // Password is incorrect
          return res.status(401).json({ message: 'Invalid username or password' });
      }
  } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
});