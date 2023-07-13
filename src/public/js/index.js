const socket = io();

const getRealTimeProducts = async () => {
  try {
    const response = await fetch('/realtimeproducts');
    const html = await response.text();
    document.getElementById('content').innerHTML = html;
  } catch (error) {
    console.error('Error fetching real-time products:', error);
  }
};
  
socket.on('productCreated', () => {
    getRealTimeProducts();
});

document.getElementById('newProductForm').addEventListener('submit', (event) => {
  event.preventDefault(); 
    const product = {
        title: event.target.title.value,
        description: event.target.description.value,
        code: event.target.code.value,
        price: parseFloat(event.target.price.value),
        stock: parseInt(event.target.stock.value),
        category: event.target.category.value,
};
socket.emit('addProduct', product);
console.log('Product creation successfull.', product);
event.target.reset();
});

function deleteProduct(index){
  console.log('Deleting product with ID:', index);
  socket.emit('deleteProduct', index)
  console.log('Product delete successfully.')
};

socket.on('productDeleted', (productId) => {
    const productElement = document.getElementById(`product_${productId}`);
    if (productElement) {
    productElement.remove();
  } getRealTimeProducts();
});