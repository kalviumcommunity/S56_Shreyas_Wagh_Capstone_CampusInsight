const multer  = require('multer')


const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, file.fieldname+ '.jpg')
    }
})
const upload = multer({ storage: storage,  limits: {
    fileSize: 5 * 1024 * 1024},
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }

})

module.exports = upload;