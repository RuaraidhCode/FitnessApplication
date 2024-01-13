const express = require('express');
const app = express();
require('dotenv').config();

const jwt = require('jsonwebtoken');

app.use(express.json());


    const posts = [
        {
            username: 'Ruaraidh',
            password: 'password',

        },
        {
            username: 'John',
            title: 'Apples',
            
        }
    ]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(3000)