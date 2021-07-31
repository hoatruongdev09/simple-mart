const sharp = require('sharp')
const uuid = require('uuid')
const path = require('path')

class Resize {
    constructor(folder) {
        this.folder = folder
    }

    async save(buffer) {
        const fileName = Resize.getFileName()
        const filepath = this.getFilePath(fileName)

        await sharp(buffer).resize(300, 300, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        }).toFile(filepath)
        return fileName
    }

    static getFileName() {
        return `${uuid.v4()}.png`;
    }

    getFilePath(filename) {
        return `${this.folder}/${filename}`
    }
}
module.exports = Resize