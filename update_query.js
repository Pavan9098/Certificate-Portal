const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const dbConnectionPromise = require('./db');
const {fun1,fun2} = require('./model.js');

const updateTakenQuery = function(batch, sem, ids) {
    return new Promise((resolve, reject) => {
        dbConnectionPromise.then((db) => {
            const MyModel = fun2(batch);
            sem = sem - 1;
            const updind = "taken_status." + sem;
            console.log(updind);
            const updateQuery = { $set: {} };
            updateQuery.$set[updind] = true;

            const promises = ids.map(id => {
                return MyModel.updateOne(
                    { _id: new mongoose.Types.ObjectId(id) },
                    updateQuery
                ).exec();
            });

            Promise.all(promises)
                .then(results => {
                    console.log("Update operations completed:", results);
                    resolve(results);
                })
                .catch(err => {
                    console.error("Error in update operations:", err);
                    reject(err);
                });
        }).catch((error) => {
            console.error("Connection error:", error);
            reject(error);
        });
    });
}



const insertNewBatch = function(batch, data) {
    return new Promise((resolve, reject) => {
        dbConnectionPromise.then((db) => {
            const Model = fun2(batch); // Create a model dynamically based on the batch name

            // Map the data array to an array of documents
            const documents = data.map(({ Reg, Email }) => ({
                reg_no: Reg,
                email: Email,
                curr_sem: 1,
                cert_link: [],
                taken_status: [],
                passed: []
            }));

            // Insert the documents into the collection
            Model.insertMany(documents)
                .then(results => {
                    console.log("Documents inserted:", results);
                    // After inserting documents, update MyModel
                    const MyModel = fun1();
                    return MyModel.findOneAndUpdate(
                        { "_id":new mongoose.Types.ObjectId("65fc4af6b25f797505d368da") }, // Use the correct ObjectId
                        { $push: { batches: batch } }, // Push the new element into the batches array
                        { new: true } // Return the updated document
                    );
                })
                .then(updatedDoc => {
                    console.log('Updated document:', updatedDoc);
                    resolve(updatedDoc);
                })
                .catch(err => {
                    console.error("Error inserting documents:", err);
                    reject(err);
                });
        }).catch((error) => {
            console.error("Connection error:", error);
            reject(error);
        });
    });
}
 


const addNewSem = function(batch,dataArray) {
    const MyModel = fun2(batch);
    const promises = dataArray.map(({ reg_no, link }) => {
        return MyModel.findOneAndUpdate(
            { reg_no: reg_no },
            { 
                $inc: { curr_sem: 1 }, // Increment curr_sem
                $push: { taken_status: false } // Push false into taken_status
            },
            { new: true }
        )
        .then(updatedDoc => {
            // Decide whether to push true/false into passed and link into cert_link based on link value
            const passedValue = link === "fail" ? false : true;
            const certLinkValue = link === "fail" ? null : link;

            updatedDoc.passed.push(passedValue);
            updatedDoc.cert_link.push(certLinkValue);

            return updatedDoc.save();
        });
    });

    return Promise.all(promises);
};









module.exports={updateTakenQuery,insertNewBatch,addNewSem};