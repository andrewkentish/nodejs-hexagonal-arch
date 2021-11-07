const fsPromises = require('fs').promises;
let UserSource = require('../ports/user-source');

module.exports = class fileUser extends UserSource {
    constructor() {
        super();
    }

    Store = async ( Name, LastName, Age ) =>{
        try {
            let dataTable = { table: [] };
            dataTable.table.push({name: Name, lastName: LastName, age: Age});
            let jsonOutput = JSON.stringify(dataTable);

            await fsPromises.writeFile("../../../Downloads/" + LastName + ".json", jsonOutput, 'utf8');
            return true;
        }catch (err){
            console.log(" err file-user.Store = ", err);
            return await {err:{code: 123, messsage: err}}
        }
    }
}