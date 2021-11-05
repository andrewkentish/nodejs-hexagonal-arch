const enum_ = require('./enum');

exports.ResponseService = async(status, errorCode, message, data)=>{
    return await {status: status, Resp:{errorCode: errorCode, message: message, data: data}};
}
