export default function (req, res, next) {
    try {
        console.log(req.session.role);
        if(req.session.role === 1){
            next()
        }else {
            return res.status(401).json({
                status: 401,
                method: req.method,
                path: req.url,
                response: 'forbidden'})
        }
        next()
    } catch (error) {
        next(error)
    }
}