const socket = io();

        socket.on('products', data => {
            const currentProductIds = new Set();

            data.forEach(element => {
                const productId = `product-${element.id}`;
                currentProductIds.add(productId);

                let productDiv = document.getElementById(productId);

                if (!productDiv) {
                    productDiv = document.createElement('div');
                    productDiv.classList.add('product');
                    productDiv.id = productId;

                    const title = document.createElement('h2');
                    title.classList.add('product-title');
                    productDiv.appendChild(title);

                    const description = document.createElement('p');
                    description.classList.add('product-description');
                    productDiv.appendChild(description);

                    const price = document.createElement('p');
                    price.classList.add('product-price');
                    productDiv.appendChild(price);

                    const stock = document.createElement('p');
                    stock.classList.add('product-stock');
                    productDiv.appendChild(stock);

                    const category = document.createElement('p');
                    category.classList.add('product-category');
                    productDiv.appendChild(category);

                    const id = document.createElement('p');
                    id.classList.add('product-id');
                    productDiv.appendChild(id);

                    document.body.appendChild(productDiv);
                }

                productDiv.querySelector('.product-title').textContent = element.title;
                productDiv.querySelector('.product-description').textContent = element.description;
                productDiv.querySelector('.product-price').textContent = `Precio: ${element.price}`;
                productDiv.querySelector('.product-stock').textContent = `Stock: ${element.stock}`;
                productDiv.querySelector('.product-category').textContent = `Categoría: ${element.category}`;
                productDiv.querySelector('.product-id').textContent = `ID: ${element.id}`;
            });

            document.querySelectorAll('.product').forEach(productDiv => {
                if (!currentProductIds.has(productDiv.id)) {
                    productDiv.remove();
                }
            });
        }); 