const {Router} = require('express');
const User = require('../models/User');
const {check, validationResult} = require('express-validator');


const router = Router();

router.get(
    '/all',
    [],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect registration data'
                })
            }
            User.find({}, (err, allUsers) => {
                if (err) console.error(err);
                res.send(allUsers)
            });
        } catch (e) {
            console.log('user.routes, getAll: ', e.message)
            res.status(500).json({message: e.message})
        }

    }
);

router.put(
    '/update',
    [],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect registration data'
                })
            }
            let reqUser = req.body;
            // console.log('reqUser', reqUser);
            const user = await User.findByIdAndUpdate(
                reqUser.id,
                reqUser,
                {
                    'useFindAndModify': false,
                    new: true,
                    upsert: true,
                });
            // console.log('User', user)
            if (!user) {
                return res.status(404).json({message: 'User not found'})
            }
            res.status(201).json({
                message: 'User updated ',

            })

        } catch (e) {
            console.log('user.routes, editUser: ', e.message)
            res.status(500).json({message: e.message})
        }
    }
)

module.exports = router;
