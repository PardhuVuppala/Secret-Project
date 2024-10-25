const schema_mongoose = require('mongoose');

const UserSchema = schema_mongoose.Schema(
    {
          username  : {type  : String},
          useremail  : {type  : String},
          usermobile : {type  : String},
          userdob  : {type  : Date},
          userpass  : {type  : String},
          usergender  : {type  : String},
          usercountry  : {type  : String},
          useraddress  : {type : String},
          userregdatetime  : {type : Date,default : Date.now}
    },
    {
        timestamps  : true
    }
);
module.exports = schema_mongoose.model('user_details', UserSchema);