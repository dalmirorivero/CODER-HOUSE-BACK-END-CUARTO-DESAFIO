import { Router } from 'express';

const router = Router();

router.get('/get',(req,res,next) => {
    try{
return res.status(200).json(req.session)
    } catch(error){
        next(error)
    }
})
//GET /api/sessions/login para el formulario de inicio de sesion
// router.get('/login', (req, res) => {
//     res.render('login'); 
// });

router.post('/login', (req,res,next) => {
    try{
        req.session.data = req.body
        return res.status(200).json({
            session: req.session,
            message: req.session.data.mail + ' inicio sesion correctamente!'
    })
    } catch (error) {
        next(error)
    }
})

router.post('/logout', (req,res,next) => {
    try{
        req.session.destroy()
        return res.status(200).json({
            succes:true,
            message: 'session destruida',
            dataSession: req.session
        })
    }
    catch (error){
        next(error)
    }
})

export default router;