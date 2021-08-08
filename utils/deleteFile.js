const fs = require('fs')

async function deleteFile(filename) {
    fs.unlink(filename, (err) => {
        if (err) {

        }
    })
}

module.exports = deleteFile