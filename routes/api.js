/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors');

var ObjectId = require('mongodb').ObjectID;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useFindAndModify: false });

module.exports = function (app) {

  const Schema = new mongoose.Schema({
    issue_title: {
      type: String,
      required: true
    },
    issue_text: {
      type: String,
      required: true
    },
    created_by: {
      type: String,
      required: true
    },
    assigned_to: String,
    status_text: String,
    open: Boolean,
    created_on: Date,
    updated_on: Date
    });
  
  let Issues = mongoose.model('Issues', Schema);

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      var project = req.params.project;
      let query = req.query;
        
      let issueInfo = await Issues.find(query, (err, data) => {
        if (err) err;
        res.json(data)
      });
    
    })
    
    .post(async (req, res) => {
      var project = req.params.project;
      let issue = req.body;
    
      const saveData = await Issues.create({
        issue_title: `${issue.issue_title}`,
        issue_text: `${issue.issue_text}`,
        created_by: `${issue.created_by}`,
        assigned_to: `${issue.assigned_to}`,
        status_text: `${issue.status_text}`,
        open: true,
        created_on: new Date(),
        updated_on: new Date()
      })
          
      res.json({saveData})    
    })
    
    .put(async (req, res) => {
      var project = req.params.project;
      let issue = req.body;
      let id = req.body._id;
    
      for (let prop in issue) {
        if(!issue[prop]) {
          delete issue[prop]
        }
      };
    
    
      async function updateData() {
        try { 
          issue.updated_on = new Date();  
          let update = await Issues.findOneAndUpdate({_id: id}, issue);
          console.log(`successfully updated ${id}`)
          return res.send(issue)
          } catch (err) {
              if (Object.keys(issue).length == 2) {
                 return res.send(`no updated field sent`);
              } else {
                 return res.send(`could not update ${id}`)

              }
          }
      }
        
      updateData();
    
      
      
    
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      let id = req.body._id;
    
      let lookupId = Issues.find({_id: id});
    
      async function deleteData() {
        try {
          let update = await Issues.findOneAndDelete({_id: id})
            return res.send(`deleted ${id}`)
        } catch (err) {
            console.log(`could not delete ${id}`)
            return res.send('id error')
          }
        }
    
      deleteData();
    
    });
    
};
