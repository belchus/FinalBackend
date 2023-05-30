orderContainer = document.getElementById('orders')

const array = [
    {obj: 1},
    {obj: 2},
    {obj: 3},
    {obj: 4},
    {obj: 5},
    {obj: 6},
]

fetch(`/api/orders/${email}`)
.then((res) => res.json())
.then((orders) => {
    const order = orders.order.map((thisOrder) =>{
        const products = thisOrder.order.map((thisProduct) => `
        <div class="product">
        Title: ${thisProduct.title}<br>
        Items: ${thisProduct.qty}<br>
        Price: ${thisProduct.price}<br>
        description: ${thisProduct.description}
        </div>
        `).join("");
        return`
        <div class="orders">
        <div class="order-title">Order : ${thisOrder.id}</div>
        Date: ${thisOrder.date}<br>
        Status: ${thisOrder.status}<br>
        <div class=products-container>
        ${products}
        </div>
        </div>
        `;
    }).join("");
    orderContainer.innerHTML = order
})