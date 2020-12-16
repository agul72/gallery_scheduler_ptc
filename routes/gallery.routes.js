const {check, validationResult} = require("express-validator");
const {Router} = require('express');
const Image = require('../models/Image');

const router = Router();

router.get('/category/name/:name', [

    ],
    async (req, res) => {
        const name = req.params.name;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect registration data'
                })
            }
            Image.find({'category': name}, (err, images) => {
                if (err) console.error(err);
                if(images.length) {
                    res.send(images);
                } else {
                    res.status(404).json({message: 'No category'})
                }
            });
        } catch (e) {
            console.log('gallery.routes, category: ', e.message)
            res.status(500).json({message: e.message})
        }

    });

router.get('/category/id/:id', [
    check("id", "Incorrect id").isLength({min: 12}),
    ],
    async (req, res) => {
        const id = req.params.id;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data'
                })
            }
            Image.findById(id, 'links', {lean: true},(err, images) => {
                if (err) console.error(err);
                if(images.links.length) {
                    res.send(images.links);
                } else {
                    res.status(404).json({message: 'No category'})
                }
            });
        } catch (e) {
            console.log('gallery.routes, id: ', e.message)
            res.status(500).json({message: e.message})
        }

    });

router.get('/category/all', [], (
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect registration data'
                })
            }
            Image.find({}, (err, images) => {
                if (err) console.error(err);
                // res.send('category: ' + category);
                if(images.length) {
                    res.send(images);
                } else {
                    res.status(500).json({message: 'DB empty'})
                }
            }).select('category');
        } catch (e) {
            console.log('gallery.routes, getAll: ', e.message)
            res.status(500).json({message: e.message})
        }
    }
));

module.exports = router;
