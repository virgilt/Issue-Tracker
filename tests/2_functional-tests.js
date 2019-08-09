/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          const body = res.body.saveData;
          assert.equal(res.status, 200);
          assert.exists(body.issue_title);
          assert.notEqual(body.issue_title, '');
          assert.exists(body.issue_text);
          assert.notEqual(body.issue_text, '');
          assert.exists(body.created_by);
          assert.notEqual(body.created_by, '');
          assert.exists(body.assigned_to);
          assert.notEqual(body.assigned_to, '');
          assert.exists(body.status_text);
          assert.notEqual(body.status_text, '');
          
          //fill me in too!
          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title2',
            issue_text: 'text2',
            created_by: 'Function Test - Required fields filled in'
        })
          .end((err, res) => {
            const body = res.body.saveData;
            assert.equal(res.status, 200);
            assert.exists(body.issue_title);
            assert.notEqual(body.issue_title, '');
            assert.exists(body.issue_text);
            assert.notEqual(body.issue_text, '');
            assert.exists(body.created_by);
            assert.notEqual(body.created_by, '');
          
            done();
          });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
        })
          .end((err, res) => {
            const body = res.body.saveData;
            assert.equal(res.status, 200);
            assert.equal(body.issue_title, 'undefined');
            assert.equal(body.issue_text, 'undefined');
            assert.equal(body.created_by, 'undefined');
          
            done();
          });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.lengthOf(Object.keys(res.body), 1)
          
          done();
        });
      });
      
      test('One field to update', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
         _id: '5d3c6a045976901000923cc2',
         issue_title: 'Test5'
       })
        .end((err, res) => {
         assert.equal(res.status, 200);
         assert.lengthOf(Object.keys(res.body), 3);
         
         done();
       })
        
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: '5d3c6a045976901000923cc2',
            issue_title: 'Test6',
            issue_text: 'text6',
            created_by: 'Yoda'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isAbove(Object.keys(res.body).length, 3)
          
            done();
        })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .send({
            issue_title: 'Test5'
        })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
          
          done();
        })
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .send({
            issue_title: 'Test5',
            issue_text: 'text5'
        })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
          
            done();
        })
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({
            _id: 'fdsahjk3289'
        })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'id error');
          
            done();
        })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({
            _id: '5d3c6a045976901000923cc2'
        })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, `deleted 5d3c6a045976901000923cc2`);
          
            done();
        })
      });
      
    });

});
