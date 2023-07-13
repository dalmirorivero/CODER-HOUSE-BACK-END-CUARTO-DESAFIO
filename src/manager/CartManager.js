import fs from 'fs';

export default class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }
  
// LISTA TODOS LOS CARRITOS DENTRO DEL ARREGLO
  getCarts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const carts = JSON.parse(data);
        return carts;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  };

// GUARDA UN NUEVO CARRITO DENTRO DEL ARREGLO
  async saveCart(cart) {
    try {
      const carts = await this.getCarts();
      if (carts.length === 0) {
        cart.id = 1;
      } else {
        cart.id = carts[carts.length - 1].id + 1;
      }
      carts.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
      return cart;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

// LISTA UN CARRITO DEL ARREGLO SELECCIONADO POR ID
  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((cart) => cart.id === id);

      if (!cart) {
        throw new Error("Cart not found");
      }

      return cart;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

// ACTUALIZA UN CARRITO DEL ARREGLO SELECCIONADO POR ID
  async updateCart(cartId, updatedCart) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === cartId);

      if (cartIndex !== -1) {
        carts[cartIndex] = updatedCart;
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return updatedCart;
      } else {
        throw new Error("Cart not found");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}