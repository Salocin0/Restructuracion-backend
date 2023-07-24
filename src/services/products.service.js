import { ProductsModel } from '../DAO/models/products.model.js';

class ProductService {
  validatePostProduct(title, description, code, price, status, stock, category, thumbnails) {
    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
      console.log('validation error: please complete firstName, lastname and email.');
      throw 'VALDIATION ERROR';
    }
  }

  validatePutProduct(id, title, description, code, price, status, stock, category, thumbnails) {
    if (!id || !title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
      console.log('validation error: please complete firstName, lastname and email.');
      throw 'VALDIATION ERROR';
    }
  }

  validateId(id) {
    if (!id) {
      console.log('validation error: please complete firstName, lastname and email.');
      throw 'VALDIATION ERROR';
    }
  }

  validateSort(sort){
    if (sort === 'asc' || sort === 'desc') {
      sort = { price: sort };
    }else{
      sort = {};
    }
    return sort
  }
  
  async getAllProducts(limit,page,query,sort,requestUrl) {
    let products = null;
    if(typeof query === "string"){
      products = await ProductsModel.paginate({$or: [{ status: query },{ category: query }]},{limit:limit, page:page, sort: this.validateSort(sort)});
    }else{
      products = await ProductsModel.paginate({},{limit:limit, page:page, sort: this.validateSort(sort)});
    }
    const prevlink = await productService.getPrevLink(requestUrl,page,products.hasPrevPage)
    const nextlink = await productService.getNextLink(requestUrl,page,products.hasNextPage)
    result={
      products:products,
      nextlink:nextlink,
      prevlink:prevlink,
    }
    return result;
  }

  async getProduct(id) {
    this.validateId(id);
    const product = await ProductsModel.findById({ _id: id });
    return product;
  }

  async createProduct(title, description, code, price, status, stock, category, thumbnails) {
    const products = await productService.getAllProducts();
    let existcode = products.docs.find((p) => p.code === code);
    if(existcode){
      return productcreated={
        msg:"codigo duplicado",
        code:400,
        user:{}
      }
    }else{
      this.validatePostProduct(title, description, code, price, status, stock, category, thumbnails);
      const productcreated = await ProductsModel.create({ title, description, code, price, status, stock, category, thumbnails });
      return productcreated;
    }
  }
  
  async updateProduct(id, title, description, code, price, status, stock, category, thumbnails) {
    this.validatePostProduct(id, title, description, code, price, status, stock, category, thumbnails);
    const userUptaded = await ProductsModel.updateOne({ _id: id }, { title, description, code, price, status, stock, category, thumbnails});
    return userUptaded;
  }

  async deleteProduct(id) {
    this.validateId(id);
    const deleted = await ProductsModel.deleteOne({ _id: id });
    return deleted;
  }

  async getNextLink(link,page,hasNextPage){
    if(hasNextPage==true){
      if (link.includes('page=')) {
        const regex = /page=(\d+)/;
        const updatedUrl = link.replace(regex, `page=${page-(-1)}`);
        return "http://localhost:8080"+updatedUrl;
      } else {
        const updatedUrl = link + `?page=${2}`;
        return "http://localhost:8080"+updatedUrl;
      }
    }else{
      return null;
    }
  }

  async getPrevLink(link,page,hasPrevPage){
    if(hasPrevPage==true){
      if (link.includes('page=')) {
        const regex = /page=(\d+)/;
        const updatedUrl = link.replace(regex, `page=${page-1}`);
        return "http://localhost:8080"+updatedUrl;
      }
    }else{
      return null;
    }
  }
}

export const productService = new ProductService();
