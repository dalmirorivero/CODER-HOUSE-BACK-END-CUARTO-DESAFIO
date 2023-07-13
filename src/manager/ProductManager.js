import fs from 'fs';

export default class ProductManager {

constructor(path) {
  this.path = path;
  this.products = [];
}

// AGREGA UN NUEVO PRODUCTO AL ARREGLO
addProduct = async (product) => {
  try {
    const products = await this.getProducts();

    if (!product ||
      typeof product.title !== 'string' ||
      typeof product.description !== 'string' ||
      typeof product.code !== 'string' ||
      typeof product.price !== 'number' ||
      typeof product.stock !== 'number' ||
      typeof product.category !== 'string') {
      throw new Error("Product field required or invalid data type.");
    }
    if (!product.status) {
      product.status = true;
    }
    if (products.find((p) => p.code === product.code)) {
      throw new Error("Product code already exists.");
    }
    if (products.length === 0) {
      product.id = 1;
    } else {
      product.id = products[products.length - 1].id + 1;
    }
    products.push(product);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
    console.log("Product create successfully.")
    return product;
  } catch (error) {
    console.error(error)
    throw error;
  }
};

// DEVUELVE TODOS LOS PRODUCTOS DEL ARREGLO
  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const products = JSON.parse(data);
        return products;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error)
    }
  };

// DEVUELVE UN PRODUCTO DEL ARREGLO SELECCIONADO POR ID
  getProductById = async (productId) => {
    try {
      const products = await this.getProducts();
      const productIndex = products.find((product) => product.id === productId);

      if (!productIndex) {
        throw new Error("Product id not found.");
      }
      return productIndex;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

// ACTUALIZA UN PRODUCTO DEL ARREGLO SELECCIONADO POR ID
  updateProduct = async (productId, updatedFields) => {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex((product) => product.id === productId);

      if (productIndex === -1) {
        throw new Error("Product to update not found.");
      }

      const originalProduct = products[productIndex];

      if (updatedFields.hasOwnProperty('id') && updatedFields.id !== originalProduct.id) {
        throw new Error("Id field of product cannot be modified.");
      }

      const updatedProduct = {
        ...originalProduct,
        ...updatedFields,
        id: originalProduct.id };

      products[productIndex] = updatedProduct;

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
      return updatedProduct;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

// ELIMINA UN PRODUCTO DEL ARREGLO SELECCIONADO POR ID
  deleteProductById = async (productId) => {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex((product) => product.id === productId);

      if (productIndex === -1) {
        throw new Error("Product to delete not found.");
      }
      products.splice(productIndex, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

// ELIMINA UN PRODUCTO POR SU INDICE DESDE LA VISTA EN TIEMPO REAL
deleteProductByIndex = async (productIndex) => {
  try {
    const products = await this.getProducts();

    if (productIndex >= 0 && productIndex < products.length) {
      products.splice(productIndex, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
      console.log("Product delete successfully.")
    } else {
      throw new Error("Product to delete not found.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
}
