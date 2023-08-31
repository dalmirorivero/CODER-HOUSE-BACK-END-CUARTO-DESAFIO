export default function (req, res, next){
    try {
        if(req.body.name && req.body.mail && req.body.password){
            next()
        } else {
            return res.status(400).json({
                status: 400,
                method: req.method,
                path: req.url,
                response: 'field required'
            })
        }
    } catch (error) {
        next (error)
    }
}