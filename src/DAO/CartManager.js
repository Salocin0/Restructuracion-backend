import fs from 'fs';
export default class CartManager {
  constructor(path = './src/') {
    this.carts = [];
    this.path = path;
    if (fs.existsSync(this.path + "carrito.json")) {
      const fileContent = fs.readFileSync(this.path + "carrito.json", 'utf-8');
      this.carts = JSON.parse(fileContent);
  } else {
    try {
      fs.writeFileSync(this.path + "carrito.json", JSON.stringify(this.carts));
    } catch (error) {
      console.log("error to create file: " + error);
    }
  }
}

addCart() {
  let product = new Array();
  let cart = {
    id: this.#newId(),
    products: product
  };
  this.carts.push(cart)
  fs.writeFileSync(this.path+"carrito.json",JSON.stringify(this.carts));
  return cart
}

#newId() {
  let max = 0;
  for (let i = 0; i < this.carts.length; i++) {
    const element = this.carts[i];
    if (element.id > max) {
      max = element.id;
    }
  }
  return ++max;
}

getCarts() {
  const data = fs.readFileSync(this.path + "carrito.json", 'utf-8');
  this.carts = JSON.parse(data);
  return this.carts;
}

getCartById(id) {
  this.carts = JSON.parse(fs.readFileSync(this.path + "carrito.json", 'utf-8'));
  const cart = this.carts.find(x => x.id == id);
  if (cart) {
    return cart;
  }else {;
    return `cart with ID ${id} not found`;
  }
}

deleteCart(id) {
  const initialLength = this.carts.length;
  this.carts = this.carts.filter(x => x.id !== id);
  if (initialLength === this.carts.length) {
    return `Cart with ID ${id} not found, can't be deleted`
  } else {
    fs.writeFileSync(this.path + "carrito.json", JSON.stringify(this.carts));
  }
}

updateCart(id, cart) {
  const cActual = this.getCartById(id);
  if (cActual) {
    Object.assign(cActual, cart);
    fs.writeFileSync(this.path + "carrito.json", JSON.stringify(this.carts));
    return cart;
  } else {
    return `Cart with ID ${id} not found`;
  }
}

addProductToCart(cartId, productId) {
  let cart = this.carts.find(x => x.id == cartId);
  if (cart) {
    let existingProduct = cart.products.find(p => p.id === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    }else {
      let newProduct = {
        id: productId,
        quantity: 1
      };
      cart.products.push(newProduct);
    }
  } else {
    return "cart not found"  
  }
  this.updateCart(cartId, cart);
    return cart
  }
}