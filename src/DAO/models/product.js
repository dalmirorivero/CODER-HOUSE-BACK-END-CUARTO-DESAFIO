import { model,Schema } from 'mongoose';

const collection = 'products'

const schema = new Schema({
    title: {type: String, required: true },
    category: {type: String, required: true },
    description: {type: String, required: true },
    code: {type: String, required: true, unique: true },
    price: {type: Number, required: true },
    stock: {type: Number, required: true }
});

schema.index({ title: 'text' }, { collation: { locale: 'en', strength: 2 } });
const Product = model(collection, schema);
export default Product;