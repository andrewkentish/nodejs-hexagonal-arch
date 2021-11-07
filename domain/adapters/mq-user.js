let UserSource = require('../ports/user-source');

// Import the MQ package
var mq = require('ibmmq');
var MQC = mq.MQC; // Want to refer to this export directly for simplicity

// The queue manager and queue to be used. These can be overridden on command line.
var qMgr = "QM1";
var qName = "DEV.QUEUE.1";

var cno = new mq.MQCNO();
cno.Options = MQC.MQCNO_NONE; // use MQCNO_CLIENT_BINDING to connect as client

// To add authentication, enable this block
if (false) {
  var csp = new mq.MQCSP();
  csp.UserId = "admin";
  csp.Password = "passw0rd";
  cno.SecurityParms = csp;
}

module.exports = class mqUser extends UserSource {
  constructor() {
      super();
  }

  formatErr(err) {
    return  "MQ call failed in " + err.message;
  }

  toHexString(byteArray) {
    return byteArray.reduce((output, elem) =>
      (output + ('0' + elem.toString(16)).slice(-2)),
      '');
  }

  // Define some functions that will be used from the main flow
  putMessage(hObj, user) {

      var msg = JSON.stringify(user);
    
      var mqmd = new mq.MQMD(); // Defaults are fine.
      var pmo = new mq.MQPMO();
    
      // Describe how the Put should behave
      pmo.Options = MQC.MQPMO_NO_SYNCPOINT |
                    MQC.MQPMO_NEW_MSG_ID |
                    MQC.MQPMO_NEW_CORREL_ID;
    
      mq.Put(hObj,mqmd,pmo,msg,function(err) {
        if (err) {
          console.log(formatErr(err));
        } else {
          console.log("MsgId: " + toHexString(mqmd.MsgId));
          console.log("MQPUT successful");
        }
      });
  }
    
  // When we're done, close queues and connections
  cleanup(hConn,hObj) {
    mq.Close(hObj, 0, function(err) {
        if (err) {
        console.log(formatErr(err));
        } else {
        console.log("MQCLOSE successful");
        }
        mq.Disc(hConn, function(err) {
        if (err) {
            console.log(formatErr(err));
        } else {
            console.log("MQDISC successful");
        }
        });
    });
  }

  Store = async ( Name, LastName, Age ) =>{
    const newUser = {  
      name: Name,
      lastName: LastName,
      age: Age
    };

    return await mq.Connx(qMgr, cno, function(err,hConn) {
      if (err) {
        console.log(formatErr(err));
      } else {
        console.log("MQCONN to %s successful ", qMgr);
  
        // Define what we want to open, and how we want to open it.
        var od = new mq.MQOD();
        od.ObjectName = qName;
        od.ObjectType = MQC.MQOT_Q;
        var openOptions = MQC.MQOO_OUTPUT;
        mq.Open(hConn,od,openOptions,function(err,hObj) {
          if (err) {
            console.log(formatErr(err));
          } else {
            console.log("MQOPEN of %s successful",qName);
            putMessage(hObj, newUser);
          }
          cleanup(hConn,hObj);
        });
      }
    });
  }
}
