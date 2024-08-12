const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const dbConnectionPromise = require('./db');

//Schemas declaration
const mySchema1 = new Schema({
    // Define your schema fields here
    batches:[Number]
  });

const mySchema2=new Schema({
    reg_no:String,
    email:String,
    curr_sem:Number,
    cert_link:[String],
    taken_status:[Boolean],
    passed:[Boolean]
});

const fun1=()=>{
    let MyModel;
    try {
      // Check if the model has already been compiled
      MyModel = mongoose.model('batch_detail');
    } catch (error) {
      // If the model hasn't been compiled yet, compile it
      MyModel = mongoose.model('batch_detail', mySchema1);
    }
    return MyModel
}


const fun2=(batch)=>{
    let MyModel;
    try {
      // Check if the model has already been compiled
      MyModel = mongoose.model(batch+'batch');
    } catch (error) {
      // If the model hasn't been compiled yet, compile it
      MyModel = mongoose.model(batch+'batch', mySchema2);
    }
    return MyModel
}


module.exports={fun1,fun2};
