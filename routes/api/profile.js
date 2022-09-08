const express = require('express');
const router = express.Router();


//@route  GET api/profile
//@desc   Test Route
//@access Public

router.post('/', (req, res) => {
    var {data, otherData, other2, otherObject} = req.body;

        var hello = otherObject.asdfasdf.asdfasdf.hello;

        console.log(data);
        console.log(otherData);
        console.log(hello);
        other2.forEach(o => {
            console.log(o.hello);
        });

    res.sendStatus(200);
});


module.exports = router;