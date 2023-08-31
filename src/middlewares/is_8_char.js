export default function (req, res, next){
    try {
        let { password } = req.body
        if (password.length>=8){
            next ()
        } else {
            return res.status(411).json({
                status: 411,
                method: req.method,
                path: req.url,
                response: 'password field must have 8 characters min'
            })
        }
    } catch (error) {
        next (error)
    }
}