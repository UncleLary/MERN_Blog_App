const express = require('express');
const cors = require('cors');
const connection = require('./db')
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const { resolveObjectURL } = require('buffer');

connection()
const app = express();
const port = 4444;


const salt = bcrypt.genSaltSync(12);
const secrectKey = 'D0ntTellNobody!2332!@#$098:)';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));



app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        console.log("Please provide both username and password.");
        return res.status(400);
    }

    if (username.length < 5) {
        console.log("Username must contain at least 5 characters.");
        return res.status(400);
      }

    const usernameLetterCount = username.replace(/[^a-zA-Z]/g, "").length;
    if (usernameLetterCount < 4) {
        console.log("Username must contain at least 4 letters.");
        return res.status(400);
    }
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        console.log("This username already exists. Please choose a different username.");
        return res.status(400);
    }
    
    if (password.length < 8) {
        console.log("Password must containt at least 8 characters.");
        return res.status(400);
      }
      
      if (!/[A-Z]/.test(password)) {
        console.log("Password must contain at least one capital letter.");
        return res.status(400);
      }
      
      if (!/\d/.test(password)) {
        console.log("Password must contain at least one digit.");
        return res.status(400);
      }

      if (!/[^A-Za-z0-9]/.test(password)) {
        console.log("Password must contain at least one special character.");
        return res.status(400);
      }

    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt)
        });
        res.json(userDoc);
    }
    catch (execption) {
        console.log(execption);
        res.status(400).json(execption);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username }) //looking id DB for hash to compare
    //console.log(userDoc);
    if (userDoc) { //check if user is avaiable
        const PasswordOk = bcrypt.compareSync(password, userDoc.password);
        //res.json(PasswordOk);
        if (PasswordOk) {
            jwt.sign({ username, id:userDoc._id }, secrectKey, {}, (error, token) => {
                if (error) {    //if error occurs, the token wont be generated
                    res.status(500).json({ error: 'An error occurred while generating the token.' });
                } else {
                    res.cookie('token', token).json({
                        id: userDoc._id,
                        username,
                    });
                }
            });
        } else {
            res.status(400).json('Wrong credentials');
        }
    }
    else {
        res.status(400).json('User not found');
    }
});


app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secrectKey, {}, (error, info) => {
        if (error) {    //if error occurs, the token wont be send
            //console.log("error")
            res.status(500).json({ error: 'Token is not valid.' });
        } else {
            //console.log("wysłało się")
            res.json(info);
        }
    });
});


app.post('/logout', (req, res) => {
    res.cookie('token', '').json('done');
});

// app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    // const {originalname,path} = req.file;
    // const parts = originalname.split('.');
    // const ext = parts[parts.length - 1];
    // const newPath = path + '.' + ext;
    // fs.renameSync(path, newPath);
app.post('/post', async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secrectKey, {}, async (error, info) => {
        if (error) {
            res.status(500).json({ error: 'Token is not valid.' });
        } else {
            const { title, summary, content } = req.body;
            console.log("Post created")
            const postDoc = await Post.create({
                title,
                summary,
                content,
                //cover: newPath,
                author: info.id,
            });
        }
    });
});

app.get('/post', async (req, res) => {
    const posts = await Post.find().
        populate('author', ['username'])   //no need to grab a password
        .sort({ createdAt: -1 })     //DES order of showing posts
        .limit(15)
        ;

    res.json(posts);
});

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

// app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
//     let newPath = null;
//     if (req.file) {
//       const {originalname,path} = req.file;
//       const parts = originalname.split('.');
//       const ext = parts[parts.length - 1];
//       newPath = path+'.'+ext;
//       fs.renameSync(path, newPath);
//     }

//const postDoc = await Post.findById(id).populate('author', ['username']);

//
app.delete('/post/:id', async (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secrectKey, {}, async (err,info) => {
    const { id } = req.params;
    try {
      const postDoc = await Post.findById(id);
    if (!postDoc) {
        return res.status(400).json('Post not found');
    }
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id); 
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }
      await Post.findByIdAndDelete(id);
      res.json({ message: 'Post deleted successfully' });
    }
    catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' }); }
    });
    
});

app.put('/post', async (req, res) => {
  
    const {token} = req.cookies;
    jwt.verify(token, secrectKey, {}, async (err,info) => {
      if (err) throw err;
      const {id,title,summary,content} = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }
   
    await postDoc.updateOne()
    // {
    //     title,
    //     summary,
    //     content,
    //     //cover: newPath,
    //     author: info.id,
    // });
      res.json(postDoc);
    });
  
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

