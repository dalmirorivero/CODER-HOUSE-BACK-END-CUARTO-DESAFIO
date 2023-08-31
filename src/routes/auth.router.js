import { Router } from 'express';
import User from '../DAO/models/user.js';
import is_form_ok from '../middlewares/is_form_ok.js';
import is_8_char from '../middlewares/is_8_char.js';
import is_valid_user from '../middlewares/is_valid_user.js';

const router = Router();

router.get('/login', (req, res) => {
    res.render('login'); 
});

router.post('/register',is_form_ok, is_8_char, async(req, res, next) => {
    try {
        let one = await User.create(req.body)
        return res.status(201).json({
            success: true,
            message: 'user registered',
            user_id: one._id
        })
    } catch (error) {
        next (error)
    }
})

router.post('/sigin', is_8_char, is_valid_user, async(req, res, next) => {
    try{
        req.session.mail = req.body.mail
        let one = await User.findOne({mail: req.body.mail})
        req.session.role = one.role
        return res.status(200).json({
            session: req.session,
            message: req.session.mail + ' inicio sesion correctamente!'
    })
    } catch (error) {
        next(error)
    }
})

router.post('/sigout', async (req,res, next) => {
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
export default router