const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const db = require('./db');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const  {graphiqlExpress,graphqlExpress} = require('apollo-server-express')


//private key
const jwtSecret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

const port = process.env.PORT || 9000;
const app = express();

const fs = require('fs')
const typeDefs = fs.readFileSync('./schema.graphql',{encoding:'utf-8'})
const resolvers = require('./resolver')

const {makeExecutableSchema} = require('graphql-tools')
const schema = makeExecutableSchema({typeDefs, resolvers})

app.use(cors(), bodyParser.json());

// app.use('/graphql',graphqlExpress({schema}))
// app.use('/graphql', graphqlExpress((req) => ({
//    schema,
//    context: {user: req.user } // , context:db.students.get(req.user.sub)
// })));
app.use('/graphql', graphqlExpress((req) => ({
   schema,
   context: {user: db.students.get(req.user) }
})));


app.use('/graphiql',graphiqlExpress({endpointURL:'/graphql'}))

app.post('/login', (req, res) => {
   const {email, password} = req.body;
   
   //check database
   const user = db.students.list().find((user) =>  user.email === email);
   if (!(user && user.password === password)) {
      res.sendStatus(401);
      return;
   }
   
   //generate a token based on private key, token doesn't have an expiry
   const token = jwt.sign({sub: user.id}, jwtSecret);
   res.send({token});
});

//decodes the JWT and stores in request object
app.use(expressJwt({
   secret: jwtSecret,
   credentialsRequired: false,
   algorithms: ['RS256']
}));

app.listen(
   port, () => console.info(
      `Server started on port ${port}`
   )
);