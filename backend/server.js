const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

app.use(cors());

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if(!allowedTypes.includes(file.mimetype)) {
        const error = new Error('Incorrect file');
        error.code  = 'INCORRECT_FILETYPE';
        // errpr occured 
        return cb(error, false)
    }
    // nothing went wrong
    cb(null, true);
}

// const upload = multer({
//     dest: './uploads',
//     fileFilter,
//     limits: {
//         fileSize: 500000
//     }
// })

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + ext)
    }
})

const upload = multer({
    storage: storage,
    fileFilter,
    limits: {
        fileSize: 500000
    },
});
   

const PORT = '5000' || process.env.PORT;

app.post('/upload', upload.single('file') ,(req, res) => {
    res.json({file: req.file})
    console.log(req.file);
})  

app.use((err, req, res, next) => {
    if (err.code === 'INCORRECT_FILETYPE') {
        res.status(422).json({ error: 'Only images are allowed'});
        return;
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(422).json({ error: 'Allowed file size is 500KB'});
        return;
    }
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));