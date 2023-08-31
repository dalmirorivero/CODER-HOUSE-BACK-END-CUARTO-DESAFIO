import { connect } from 'mongoose';
import 'dotenv/config.js';

connect(process.env.DB)
        .then(() => {
            console.log('db connection success')
        })
        .catch(() => {
            console.log('db connection failed')
        });