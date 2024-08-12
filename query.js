const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const dbConnectionPromise = require('./db');
const {fun1,fun2} = require('./model.js');



const collectdocuments=function(){
    // Use the promise to access the Mongoose connection
    dbConnectionPromise.then((db) => {
        // Connection is ready, you can use it here
    
        db.collection("sample").find().toArray()
            .then(results => {
                console.log('Found documents:', results);       
                return results;    
            })
            .catch(err => {
                console.error('Error finding documents:', err);
            })
            .finally(() => {
                // Close the connection
                mongoose.connection.close();
            });

    }).catch((error) => {
    // Handle connection errors here
    });

}


//Get Cert Link
const getCertLink = function(batch, reg_no) {
    // Return a promise
    return new Promise((resolve, reject) => {
        // Use the promise to access the Mongoose connection
        dbConnectionPromise.then((db) => {
            // Define your model
            const MyModel = fun2(batch);
            
            // Find the document using reg_no
            MyModel.findOne({ reg_no: reg_no })
                .then(doc => {
                    if (!doc) {
                        // If no document found, reject with an error
                        reject(new Error(`Document with reg_no ${reg_no} not found`));
                    } else {
                        // If document found, resolve with cert_link array
                        resolve(doc.cert_link);
                    }
                })
                .catch(error => {
                    // Handle any errors that occur during the query
                    reject(error);
                });
        }).catch((error) => {
            // Handle connection errors here
            reject(error); // Reject the promise if connection error occurs
        });
    });
};

const collectbatches = function() {
    // Return a promise
    return new Promise((resolve, reject) => {
        // Use the promise to access the Mongoose connection
        dbConnectionPromise.then((db) => {
            // Define your model
            const MyModel = fun1();

            // Find all documents
            MyModel.find()
                .then(documents => {
                    if (documents.length > 0) {
                        const results = documents[0].batches;
                        resolve(results); // Resolve the promise with the retrieved data
                    } else {
                        console.log('No documents found');
                        resolve([]); // Resolve with an empty array if no documents found
                    }
                })
                .catch(err => {
                    console.error('Error finding documents:', err);
                    reject(err); // Reject the promise if an error occurs
                })
        }).catch((error) => {
            // Handle connection errors here
            reject(error); // Reject the promise if connection error occurs
        });
    });
};

const collectBatchDetails=function(batch){
    // Return a promise
    return new Promise((resolve, reject) => {
        // Use the promise to access the Mongoose connection
        dbConnectionPromise.then((db) => {
            // Define your model
            var MyModel = fun2(batch);
            
            // Find all documents
            
        }).catch((error) => {
            // Handle connection errors here
            reject(error); // Reject the promise if connection error occurs
        });
    });
}

//  22/3 Deepak

// for total no of sems appeairng in the dropdown

const totalSems=function(batch){
    // Return a promise
    return new Promise((resolve, reject) => {
        // Use the promise to access the Mongoose connection
        dbConnectionPromise.then((db) => {
            // Define your model
            var MyModel = fun2(batch);
            
            // Find all documents
            MyModel.find()
                .then(documents => {
                    if (documents.length > 0) {
                        var results = documents[0].curr_sem;
                        resolve(results); // Resolve the promise with the retrieved data
                    } else {
                        console.log('No documents found');
                        resolve([]); // Resolve with an empty array if no documents found
                    }
                })
                .catch(err => {
                    console.error('Error finding documents:', err);
                    reject(err); // Reject the promise if an error occurs
                })
            
        }).catch((error) => {
            // Handle connection errors here
            reject(error); // Reject the promise if connection error occurs
        });
    });
}


const collectBatchDocuments=function(batch,sem){
    // Return a promise
    return new Promise((resolve, reject) => {
        // Use the promise to access the Mongoose connection
        dbConnectionPromise.then((db) => {
            // Define your model

            var MyModel = fun2(batch);

            MyModel.aggregate([
                // Match stage to filter documents (if needed)
                // { $match: {} },
              
                // Project stage to include the desired fields
                {
                  $project: {
                    reg_no: 1,
                    taken_status: { $arrayElemAt: ['$taken_status', sem-1] },
                    passed : { $arrayElemAt: ['$passed', sem-1] }
                  }
                }
              ])
                .then(results => {
                  // Handle the retrieved documents
                  console.log(results);
                  resolve(results);
                })
                .catch(error => {
                  // Handle error
                  console.error(error);
                });          
            
            
        }).catch((error) => {
            // Handle connection errors here
            reject(error); // Reject the promise if connection error occurs
        });
    });
}








module.exports = {collectdocuments,collectbatches,totalSems,collectBatchDocuments,getCertLink};