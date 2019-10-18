const express = require('express');

const server = express();

server.use(express.json());

const users = ['Diego', 'Guilheme', 'Carlos'];

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Request');
});

function checkUserExist(req, res, next) {
  if(!req.body.name){
    return res.status(400).json({error: 'User name is required'});
  }

  return next();
}

function chekUserInArray(req, res, next){
  const user = users[req.params.index];

  if(!user){
    return res.status(400).json({error: 'User does not exist'});
  }

  req.user = user;

  return next();
}

server.get('/users/:index', chekUserInArray, (req, res)=>{
  const { index } = req.params;
  return res.json({ message: `${users[index]}`});
}),

server.get('/users', (req, res) => {
  return res.json(users);
});

server.post('/users', checkUserExist,(req, res) => {
  const{ name } = req.body;

  users.push(name);

  return res.json(`Usuário ${name} cadastrado com sucesso`);
});

server.put('/users/:index',chekUserInArray, checkUserExist, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.send(users);
});

server.delete('/users/:index', chekUserInArray, (req, res) => {
 const { index } = req.params;

 users.splice(index, 1);

 return res.json(`Usuário ${req.user} deletado com sucesso`);
});

server.listen(3000);