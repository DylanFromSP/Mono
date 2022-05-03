const express = require('express');
const cors = require('cors');

// INIT

const app = express();
const PORT = 3000;
// const PORT = process.env.PORT || 3000;


//SETUP APP

app.use(cors());
app.use(express.json());
// REQUIRED TO READ POST>BODY
// If not req.body is empty
app.use(express.urlencoded({ extended: false}));

const pool = require('./db'); //Import from db.js


// DISPLAY SERVER RUNNING

app.get('/',(req,res)=> {
    res.send(`Server running on port ${PORT}`)
});

app.listen(PORT,()=> {
    console.log(`App listening to port ${PORT}`);
});


// POST GET METHODS
// http://localhost:3000/api/
// Use Postman to test

// app.get('/api', async (req, res, next) => {
//     console.log(req.query);

//     res.json(req.query);
// });

// app.post('/api', async (req, res, next) => {
//     console.log(req.body);

//     res.json(req.body);
// });


//First Class Work
//////////////////////////////////////////////////////
// SETUP DB (Messages)
//////////////////////////////////////////////////////
const CREATE_TABLE_SQL_MESSAGES = `
    CREATE TABLE messages (
        id SERIAL primary key,
        message VARCHAR not null
    );
`;

app.post('/api/table/messages', async (req, res, next) => {
    
    pool.query(CREATE_TABLE_SQL_MESSAGES)
    .then(() => {
         res.send(`Table created`);
    })
    .catch((error) => {
        res.send(error);
    });
});
//////////////////////////////////////////////////////
// CLEAR DB (Messages)
//////////////////////////////////////////////////////
const DROP_TABLE_SQL_MESSAGES = `
    DROP TABLE IF EXISTS messages;
`;

app.delete('/api/table/messages', async (req, res, next) => {
    
    pool.query(DROP_TABLE_SQL_MESSAGES)
    .then(() => {
        res.send(`Table dropped`);
    })
    .catch((error) => {
        res.send(error);
    });
});


//////////////////////////////////////////////////////
// POST GET METHODS CONNECTED TO DB (Messages)
//////////////////////////////////////////////////////
app.get('/api/message', async (req, res, next) => {
    try
    {
        console.log(req.query);

        const allMessage = await pool.query("SELECT * FROM messages"); 

        res.json(allMessage.rows);
    }
    catch(err)
    {
        console.error(err.message);
    }
});

app.post('/api/message', async (req, res, next) => {
    try
    {
        console.log(req.body);
        let message = req.body.message;

        const newInsertMessage = await pool.query("INSERT INTO messages (message) VALUES ($1) RETURNING *",
         [message]);

        res.json(newInsertMessage);
    }
    catch(err)
    {
        console.error(err.message);
    }
});

//////////////////////////////////////////////////////
// SETUP DB (Users)
//////////////////////////////////////////////////////
const CREATE_TABLE_SQL_USERS = `
    CREATE TABLE users (
        id SERIAL primary key,
        username VARCHAR not null,
        description VARCHAR 
    );
`;

app.post('/api/table/users', async (req, res, next) => {
    
    pool.query(CREATE_TABLE_SQL_USERS)
    .then(() => {
         res.send(`Table created`);
    })
    .catch((error) => {
        res.send(error);
        console.log(error);
    });
});
//////////////////////////////////////////////////////
// CLEAR DB (Users)
//////////////////////////////////////////////////////
const DROP_TABLE_SQL_USERS = `
    DROP TABLE IF EXISTS users;
`;

app.delete('/api/table/users', async (req, res, next) => {
    
    pool.query(DROP_TABLE_SQL_USERS)
    .then(() => {
        res.send(`Table dropped`);
    })
    .catch((error) => {
        res.send(error);
    });
});

//////////////////////////////////////////////////////
// POST GET METHODS CONNECTED TO DB
//////////////////////////////////////////////////////
app.get('/api/user', async (req, res, next) => {
    
    try
    {
        console.log(req.query);

        const allUser = await pool.query("SELECT * FROM users"); 

        res.json(allUser.rows);
    }
    catch(err)
    {
        console.error(err.message);
    }
});

app.post('/api/user', async (req, res, next) => {
    try
    {
        console.log(req.body);
        const username = req.body.username;
        const description = req.body.description

        const newInsertUser = await pool.query("INSERT INTO users (username, description) VALUES ($1, $2) RETURNING *",
         [username, description]);
        
        res.json(newInsertUser);
    }
    catch(err)
    {
        console.error(err.message);
    }
});

app.delete('/api/user/:id', async (req, res, next) => {
    try {
        console.log(req.body);
        const {id} = req.params;

        const newDeleteUser = await pool.query("DELETE FROM users WHERE id = $1", [id]);

        res.json(newDeleteUser);
    } catch (err) {
        console.error(err.message);
    }
});

app.put('/api/user/:id', async (req, res, next) => {
    try {
        console.log(req.body);
        const {id} = req.params;
        const description = req.body.description;

        const modifyUserDescription = await pool.query("UPDATE users SET  description = $1 WHERE id = $2",
         [description, id])
        
        res.json(modifyUserDescription);
    } catch (err) {
        console.error(err.message);
    }
});