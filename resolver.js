const db = require('./db')

const Query = {
    test: () => 'Test Success, GraphQL server is up & running !!',
    greeting: () => 'Hello GraphQL  From TutorialsPoint !!',
    studentDetails: () => { 
        console.log('resolver studentDetails: ', db.students);
        return db.students.list() 
    },
     //resolver function for studentbyId
     studentById:(root,args,context,info) => {
        return db.students.get(args.id);
     }
 }

 const Mutation = {
    addStudent: (firstName, lastName) => {
        console.log('firstName :',firstName);
        console.log('lastName :',lastName);
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
 