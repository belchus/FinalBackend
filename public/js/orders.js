orderContainer = document.getElementById('orders')

const array = [
    {obj: 1},
    {obj: 2},
    {obj: 3},
    {obj: 4},
    {obj: 5},
    {obj: 6},
]


//Trae las ordenes generadas
fetch(`/api/orders/${email}`)
.then((res) => res.json())
.then((orders) => {
    const myorder = orders.order.map((thisOrder) =>{
        const products = thisOrder.myorder.map((thisProduct) => `
        <div class="product">
        Title: ${thisProduct.title}<br>
        ITEMS: ${thisProduct.qty}<br>
       TOTAL: ${thisProduct.price}<br>
        DETALLE: ${thisProduct.description}
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
    orderContainer.innerHTML = myorder
})