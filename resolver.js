const db = require('./db')

const Query = {
    test: () => 'Test Success, GraphQL server is up & running !!',
    greeting: () => 'Hello GraphQL  From TutorialsPoint !!',
    greetingWithAuth:(root,args,context,info) => {

        //check if the context.user is null
        if (!context.user) {
           throw new Error('Unauthorized');
        }
        return "Hello from TutorialsPoint, welcome back : " + context.user.firstName;
     },
    studentDetails: () => { 
        console.log('resolver studentDetails: ', db.students);
        return db.students.list() 
    },
    collegeDetails: () => {
        console.log('resolver collegeDetails:', db.colleges);
        return db.colleges.list();
    },
     //resolver function for studentbyId
     studentById:(root,args,context,info) => {
        return db.students.get(args.id);
     },
     //Say Hello with params
     sayHello:(root,args,context,info) => `Hi ${args.name}! GraphQL server says Hello to you!!`,
     setFavouriteColor: (root, args) => {
        return  "Your Fav Color is :" + args.color;
     }

 }

 const Mutation = {
    addStudent: (root,args,context,info) => {
        console.log('addStudent Mutation resolver');
        console.log('firstName :', args.firstName);
        console.log('lastName :', args.lastName);
        return db.students.create({collegeId: args.collegeId,
        firstName: args.firstName, lastName: args.lastName})
    },
    //create Student
    createStudent: (root, args, context, info) => {
        const studId = db.students.create({
            collegeId: args.collegeId, 
            firstName: args.firstName,
            lastName: args.lastName
        })
        console.log('createStudent : studId', studId);
        return db.students.get(studId);
    },
    //Sign up a new user.
    signUp:(root,args,context,info) => {

        const {email,firstName,password} = args.input;
  
        const emailExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        const isValidEmail =  emailExpression.test(String(email).toLowerCase())
        if(!isValidEmail)
        throw new Error("email not in proper format")
  
        if(firstName.length > 15)
        throw new Error("firstName should be less than 15 characters")
  
        if(password.length < 8 )
        throw new Error("password should be minimum 8 characters")
        
        return "success";
     }

    
 }

 //for each single student object returned,resolver is invoked

const Student = {
    fullName:(root,args,context,info) => {
       return root.firstName+" "+root.lastName
    },
    college:(root) => {
        return db.colleges.get(root.collegeId);
     } }

 module.exports = {Query, Mutation, Student}
 