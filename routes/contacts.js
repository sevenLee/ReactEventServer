const express = require('express');
const multer  = require('multer')
const lwip = require('lwip');
const path = require('path')
const fs = require('fs')
const router = express.Router();
let fileName = ''
let filEextname = ''

const genFileName = (file) => {
    console.log('file mime:', file.mimetype)

    if(file.mimetype === 'image/jpeg'){
        filEextname = '.jpg'
    }

    if(file.mimetype === 'image/png'){
        filEextname = '.png'
    }

    fileName = file.fieldname + '-' + Date.now() + filEextname
    console.log('fileName:', fileName)
    return fileName
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log('destination file:', file)

        if(file.fieldname !== 'avatarFile'){
            return
        }

        const testDir = (newDestination) => {
            var stat = null;
            try {
                stat = fs.statSync(newDestination);
            } catch (err) {
                console.log('destination file: catch')

                fs.mkdirSync(newDestination);
            }
            if (stat && !stat.isDirectory()) {
                throw new Error('Directory cannot be created because an inode of a different type exists at "' + newDestination + '"');
            }
        }


        var newDestination = 'avatar/'
        testDir(newDestination)
        testDir(newDestination + req.params.contactId)
        testDir(newDestination + req.params.contactId + '/raw')

        callback(null, newDestination + req.params.contactId + '/raw');
    },
    fileFilter: function (req, file, cb) {
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the following filetypes - " + filetypes);
    },
    filename: (req, file, callback) => {
        callback(null, genFileName(file))
    }
});
const upload = multer({
    dest: 'avatar/',
    limits: {
        fieldNameSize: 100,
        fileSize: 600000
    },
    storage: storage
})

router.post('/:contactId/avatar/:size',
    upload.single('avatarFile'),
    function(req, res, next) {
        if (!req.file) {
            console.log("No file received");
            return res.json({
                success: false,
                message: 'No file received'
            });
        }

        const contactId = req.params.contactId;
        const imageSize = req.params.size

        lwip.open(req.file.path, function(err, image){
            if(err) throw err

            const fromResizePath = () => {
                const resizeDestination = 'avatar/' + contactId + '/resize';
                let stat = null;
                try {
                    stat = fs.statSync(resizeDestination);
                } catch (err) {
                    fs.mkdirSync(resizeDestination);
                }
                if (stat && !stat.isDirectory()) {
                    throw new Error('Directory cannot be created because an inode of a different type exists at "' + resizeDestination + '"');
                }

                return  resizeDestination + '/' + fileName
            }

            image.batch()
                .resize(imageSize*1)
                .writeFile(fromResizePath(), function(err){
                        if (err){
                            res.status(400).send({ error: err.toString() });
                        }
                        else {
                            res.json({
                                success: true,
                                url: 'http://localhost:3001/' + 'avatar/'+ contactId + '/resize/' + fileName
                            });
                        }
                    }
                );
        });
});

module.exports = router;
