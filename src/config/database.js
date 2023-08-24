import { connect } from 'mongoose';

connect('mongodb+srv://dalmirorivero:Donato23@rivero.eoyvren.mongodb.net/masnatural')
        .then(() => {
            console.log('db connection success')
        })
        .catch(() => {
            console.log('db connection failed')
        });