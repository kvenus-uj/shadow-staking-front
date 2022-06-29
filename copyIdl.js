const fs = require('fs');
const idl = require('./step_staking.json');

fs.writeFileSync('./src/contract/idl.json', JSON.stringify(idl));