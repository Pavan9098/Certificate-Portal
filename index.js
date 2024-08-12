const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const {collectbatches,collectdocuments,totalSems,collectBatchDocuments,getCertLink}=require('./query.js')

const {updateTakenQuery,insertNewBatch,addNewSem}=require('./update_query.js')

const {sendMail} = require('./mail.js')

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));



// Define a route to render the EJS file

// '/' for the student query
app.get('/', (req, res) => {
  // Pass data to the EJS file
  res.render('index',{message:null,links:null} );
});

app.post('/', (req, res) => {
  // Pass data to the EJS file
  var batch=parseInt(req.body.batch);
  var reg_no=req.body.reg_no.toUpperCase();
  console.log(batch,reg_no);
  getCertLink(batch, reg_no)
    .then(certLinks => {
        console.log('Cert Links:', certLinks);
        res.render('index',{message:null,links:certLinks})
    })
    .catch(error => {
        console.error('Error:', error);
        res.render('index',{message:error,links:null})
    });
});




//Login page

app.get('/login', (req, res) => {
  // Pass data to the EJS file
  res.render('login',{message:null});
});

app.post('/login', (req, res) => {
  // Pass data to the EJS file
  console.log(req.body);
  if(req.body.username==='admin' && req.body.password==='admin')
  {
    res.redirect('/staff');
  }
  else{
    var message='Inorrect username or password'
    res.render("login",{message:message});
  }
});










app.get('/staff', (req, res) => {
  collectbatches()
      .then(data => {
          console.log(data);
          // Render the view with the retrieved data
          res.render('staffmain', { results: data });
      })
      .catch(error => {
          console.error('Error:', error);
          // Render an error page or handle the error as needed
          res.status(500).send('Error occurred while fetching data');
      });
});


// app.post('/staff',(req,res)=>{
//   console.log(req.body);
//   res.render('staffmain');
// });

//Batch 

app.get('/batches', (req, res) => {
  let batch = req.query.batch;
  console.log("query", req.query);
  console.log(Object.keys(req.query).length > 1);

  if (req.query.sem) {
      let sem = req.query.sem;
      console.log("sem:", sem);
      collectBatchDocuments(batch, sem)
          .then(documents => {
              console.log("doc=",documents);
              // Render the view with the retrieved data
              totalSems(batch)
                .then(data => {
                    //console.log(data);
                    // Render the view with the retrieved data
                    res.render('batchdata', { batch: batch, results: data, docs: documents,sem:sem });
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Render an error page or handle the error as needed
                    res.status(500).send('Error occurred while fetching data');
                });
              
          })
          .catch(error => {
              console.error('Error:', error);
              // Render an error page or handle the error as needed
              res.status(500).send('Error occurred while fetching data');
          });
    }
    else{
      console.log("hello");
      totalSems(batch)
          .then(data => {
              console.log(data);
              // Render the view with the retrieved data
              res.render('batchdata', { batch: batch, results: data, docs: null,sem:null });
          })
          .catch(error => {
              console.error('Error:', error);
              // Render an error page or handle the error as needed
              res.status(500).send('Error occurred while fetching data');
          });
    }
});


app.post("/selectSem",(req,res)=>{
  console.log(req.body);
  let batch=req.body.batch;
  let sem=req.body.sem;
  url="/batches?"
  url+="batch="+batch+"&sem="+sem;
  console.log(url);
  res.redirect(url);
});


app.post("/updateTaken",(req,res)=>{
  let batch=req.body.batch;
  let sem=req.body.sem;
  let ids={...req.body}
  delete ids.batch;
  delete ids.sem;
  ids=Object.keys(ids);
  console.log(ids);
  updateTakenQuery(batch,sem,ids)
  .then(()=>{
    var url="/batches?"
    url+="batch="+batch+"&sem="+sem;
    res.redirect(url);
  })
  .catch(error => {
      console.error('Error:', error);
      // Render an error page or handle the error as needed
      res.status(500).send('Error occurred while fetching data');
  });
});



//Adding new Batch

app.get("/newBatch",(req,res)=>{
  res.render("newbatchup.ejs");
});

app.post("/newBatch",(req,res)=>{
   const { batch, data } = req.body; // Destructure batch and data from the request body
   var jsondata = JSON.parse(data);
    console.log('Received batch:', batch);
    console.log('Received data:', jsondata);

    insertNewBatch(batch,jsondata)
      .then(()=>{
        res.json({ message: 'Data inserted successfully' });
      })
      .catch(error => {
          console.error('Error:', error);
          // Render an error page or handle the error as needed
          res.status(500).send('Error occurred while fetching data');
      });
    
    // Send a response back to the client if needed
  
})


//Adding new Sem
app.get("/batches/addNewSem",(req,res)=>{
  var batch=req.query.batch
  res.render("newsemup",{batch:batch})
});

app.post("/batches/addNewSem",(req,res)=>{
  const { batch, data } = req.body; // Destructure batch and data from the request body
   var jsondata = JSON.parse(data);
    console.log('Received batch:', batch);
    console.log('Received data:', jsondata);
    addNewSem(batch,jsondata)
    .then(updatedDocs => {
        console.log('All documents updated successfully:', updatedDocs);
        sendMail(updatedDocs)
          .then(() => {
              console.log('All emails sent successfully');
              res.json({ message: 'Data inserted successfully' });
          })
          .catch(error => {
              console.error('Error sending emails:', error);
          });
    })
    .catch(error => {
        console.error('Error updating documents:', error);
    });

    
})


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
