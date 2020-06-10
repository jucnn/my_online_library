    const jwt = require('jsonwebtoken');


     module.exports = (req, res, next) => {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (!token) {
            return res.status(403).send({
                auth: false,
                msg: 'No token provided.'
            });
        } else {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(500).send({
                        auth: false,
                        msg: 'Failed to authentificate token.'
                    });
                } else {
                    req.userId = decoded.id;
                    next();
                }
            });
        }
    }