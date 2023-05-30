const main = document.getElementById("main");
const status = document.getElementById("status");
const category = document.getElementById('category')
const menu = document.getElementById("menu");
const name = document.getElementById("name").innerHTML;
const lastName = document.getElementById("lastname").innerHTML;
const email = document.getElementById("username").innerHTML;
let isRedirect = false;
let userId = 0;
let isAdmin = false;

function admin() {
  if (isAdmin) {
    return "true";
  } else {
    return "none";
  }
}

async function userType(rol, id) {
  const userType = document.getElementById(rol);
  if ((await rol) == "true" || (await rol) == true) {
    userType.innerHTML = "Admin";
    isAdmin = true;
    userId = await id;
  } else {
    userType.innerHTML = "Client";
    userId = await id;
  }
}
async function getProducts() {
  let product = await fetch("/api/products");
  let data = await product.json();
  return data;
}

async function getProduct(id) {
  let product = await fetch(`/api/products/mongo/${id}`);
  let data = await product.json();
  return data;
}

async function getProductId(id) {
  let product = await fetch(`/api/products/${id}`);
  let data = await product.json();
  return data;
}
/*
async function getProductsByCat(category) {
  let product = await fetch(`/api/products/categories/${category}`);
  let data = await product.json();
  return data;
}
*/


async function getThisCart(id) {
  let cart = await fetch(`/api/cart/${id}/products/`);
  let data = await cart.json();
  return data;
}


async function mainBody() {

  main.innerHTML = "";
  menu.innerHTML = "";
  if (isAdmin) {
    const cartOptions = `
        <p class="menu-name">SETTINGS</p>
        <input class="btn" type="button" onclick="newProduct()" name="boton" value="add product">
        <a class="btn" href="/info">Info del sistema</a>
        <a class="btn" href="/chat">mensajes</a>
        `;
    menu.innerHTML = cartOptions;
  }
  viewProduct(productId);
}

async function newpProduct() {
  const content = `
    <div class="card-container">
    <label for="title">title</label>
    <input id="title" class="input" type="text" name="title" >
    <label for="price">price</label>
    <input id="price" class="input" type="number" name="price"  step="0.1" min="0.1">
    <label for="code">categoría</label>
    <input id="code" class="input" type="text" name="code" >
    <label for="thumbnail">imagen (url)</label>
    <input id="thumbnail" class="input" type="text" name="thumbnail" >
    <label for="stock">stock</label>
    <input id="stock" class="input" type="number" name="price"  onkeydown="return false" step="1" min="1">
    <label for="description">description</label>
    <input id="description" class="input" type="text" name="description" >
    <input class="btn" type="button" onclick="createProduct()" name="boton" value="confirmar">
    </div>
    `;
  main.innerHTML = content;
}

async function createProduct() {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const code = document.getElementById("code").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const stock = document.getElementById("stock").value;
  const description = document.getElementById("description").value;
  const url = "/api/products/";
  const payload = {
    title: title,
    price: price,
    code: code,
    thumbnail: thumbnail,
    stock: stock,
    description: description,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  if (!title) {
    alert("Alerta: no se ha especificado ningún nombre");
  } else if (!price) {
    alert("Alerta: no se ha especificado ningún precio");
  } else if (!code) {
    alert("Alerta: no se ha especificado ningún code");
  } else if (!thumbnail) {
    alert("Alerta: no se ha agregado ninguna imagen");
  } else if (!stock) {
    alert("Alerta: no ha especificado el stock");
  } else if (!description) {
    alert("Alerta: no ha detallado el producto");
  } else {
    sendData(title);
  }
  async function sendData(title) {
    Swal.fire({
      title: "Agregar Producto Nuevo",
      text: `Agregar ${title} al inventario?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "confirmar",
      cancelButtonText: "cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(url, options)
          .then((response) => console.log(response.status))
          .catch((error) => console.log(error));
        Swal.fire({
          title: "Exito!",
          text: `El producto ${title} ha sido creado satisfactoriamente`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Home",
        }).then((result) => {
          if (result.isConfirmed) {
            if (!alreadyRedirected) {
              alreadyRedirected = true;
              window.location.href = "/products";
            }
          }
        });
      }
    });
  }
}

async function updateProduct(id) {
  const product = await getProductId(id);
  const content = `
    <div class="card-container">
    <label for="title">title</label>
    <input id="title" class="input" type="text" name="title" value="${product.title}">
    <label for="price">price</label>
    <input id="price" class="input" type="number" name="price" value="${product.price}" step="0.1" min="0.1">
    <label for="code">code</label>
    <input id="code" class="input" type="text" name="code" value="${product.code}">
    <label for="thumbnail">imagen (url)</label>
    <input id="thumbnail" class="input" type="text" name="thumbnail" value="${product.thumbnail}">
    <label for="stock">stock</label>
    <input id="stock" class="input" type="number" name="price" value="${product.stock}" onkeydown="return false" step="1" min="1">
    <label for="description">description</label>
    <input id="description" class="input" type="text" name="description" value="${product.description}">
    <input class="btn" type="button" onclick="updateProduct(${product.id})" name="boton" value="confirmar">
    </div>
    `;
  main.innerHTML = content;
}

async function updateProduct(id) {
  const url = `/api/products/${id}`;
  const title = document.getElementById("title").value;
  const payload = {
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    code: document.getElementById("code").value,
    thumbnail: document.getElementById("thumbnail").value,
    stock: document.getElementById("stock").value,
    description: document.getElementById("description").value,
  };
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  Swal.fire({
    title: "Actualizar Producto",
    text: `Actualizar los datos de ${title}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "confirmar",
    cancelButtonText: "cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(url, options)
        .then((response) => console.log(response.status))
        .catch((err) => console.log(err));
      Swal.fire({
        title: "Exito!",
        text: `El producto ${title} ha sido actualizado satisfactoriamente`,
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Home",
      }).then((result) => {
        if (result.isConfirmed) {
          if (!alreadyRedirected) {
            alreadyRedirected = true;
            window.location.href = "/products";
          }
        }
      });
    }
  });
}

async function viewProduct(id) {
  const product = await getProduct(id);

  if(product.error) {
    const content=`
    <div class="sin-product">El producto no existe</div>
    `
    main.innerHTML = content
  } else {
    const content = `
    <div class="card-container">
        <div class="image-container"><img class="image" src="${product.thumbnail}" alt=""></div>
        <div class="detail-container">
            <p class="description-title">${product.title}</p>
            <p class="description-card"><strong>Categoria:</strong> ${product.code}<br>
            <strong>-Detalle</strong><br>${product.description}<br>
            <strong>-Precio:</strong> $:${product.price}-<br>
            <strong>-Stock:</strong> ${product.stock}
            </p>
        </div>
        <div class="form">
            <input class="input-number" id="cant${
              product.id
            }" onkeydown="return false" step="1" min="1" max="${
        product.stock
      }" value="1" type="number" name="cantidad">
            <input class="btn" type="submit" onclick="addToCart(${product.id}, '${
        product.title
      }')" name="boton" value="addToCart">
        </div>
        <div class="form">
        <input style="display:${admin()}" class="btn" type="button" onclick="updateProduct(${
        product.id
      })" name="boton" value="editar">
        <input style="display:${admin()}" class="btn" type="button" onclick="deleteProduct(${
        product.id
      })" name="boton" value="delete">
        </div>     
    </div>
    `;
      main.innerHTML = content;
  }
}

async function deleteProduct(id) {
  const url = `/api/products/${id}`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  Swal.fire({
    title: "Eliminar Producto",
    text: `Eliminar este producto del inventario?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "confirmar",
    cancelButtonText: "cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(url, options)
        .then((response) => console.log(response.status))
        .catch((err) => console.log(err));
      Swal.fire({
        title: "Exito!",
        text: `El producto ha sido eliminado satisfactoriamente`,
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Home",
      }).then((result) => {
        if (result.isConfirmed) {
          if (!alreadyRedirected) {
            alreadyRedirected = true;
            window.location.href = "/products";
          }
        }
      });
    }
  });
}


async function createCart(id) {
  const url = `/api/cart/`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({id: id, email: userEmail, address: userAddress})
  };
  await fetch(url, options).then((response) => console.log(response.status));
  Swal.fire({
    title: "Exito!",
    text: `El carrito ha sido creado satisfactoriamente`,
    icon: "success",
    confirmButtonColor: "#3085d6",
    confirmButtonText: "Home",
  }).then((result) => {
    if (result.isConfirmed) {
      if (!alreadyRedirected) {
        alreadyRedirected = true;
        window.location.href = "/products";
      }
    }
  });
}

async function addToCart(id, title) {
  const url = `/api/cart/${id}/products/`;
  const payload = {
    id: id,
    cantidad: parseInt(document.getElementById(`cant${id}`).value),
    email: userEmail,
    address: userAddress,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  if (userId == 0) {
    console.log("no hay ningun usuario logueado");
  } else {
    await fetch(url, options)
      .then((response) => console.log(response.status))
      .catch((err) => console.log(err));
    Toastify({
      text: `${title} añadido al carrito`,
      className: "info",
      position: "right",
      gravity: "bottom",
      duration: 5000,
      close: true,
      style: {
        color: "white",
        background: "linear-gradient(45deg, cornflowerblue, darkslateblue)",
      },
    }).showToast();
  }
}

async function purchase() {
  const cart = await getThisCart(userId);
  const products = [];
  cart.forEach((product) => {
    const listaItems = `-item: ${product.title}, cant: ${product.stock}\n`;
    products.push(listaItems);
  });
  const mail = {
    asunto: `nuevo pedido de ${firstname} ${lastName} - (${email})`,
    msg: `
        ${firstname} ${lastName}. Email: ${email}\n
        solicita los siguientes products:\n
        ${products}
        -msg automatizado de alerta.
        `,
    msgSms: `${firstname} ${lastName}. Su pedido ha sido recibido y se encuentra en proceso. \n
        su pedido es: \n
        ${products}.`,
  };
  const url = "/purchase";
  const payload = mail;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  Swal.fire({
    title: "confirm",
    text: `Está a punto de Confirmar la compra`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "confirmar",
    cancelButtonText: "cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(url, options)
        .then((response) => console.log(response.status))
        .catch((err) => console.log(err));
      Swal.fire({
        title: "Exito!",
        text: `La compra se ha confirmado`,
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Home",
      }).then((result) => {
        if (result.isConfirmed) {
          if (!alreadyRedirected) {
            alreadyRedirected = true;
            window.location.href = "/products";
          }
        }
      });
    }
  });
}

async function DetailCart() {
  if (userId == 0) {
    alert("no hay ningun usuario logueado");
  } else {
    const cart = await getThisCart(userId);
    const cartOptions = `
                <p class="menu-name">carrito de ${firstname}</p>
                <input class="btn" type="button" onclick="DetailCart()" name="boton" value="refresh">
                <input class="btn" type="button" onclick="purchase()" name="boton" value="confirm">
                `;
    menu.innerHTML = cartOptions;
    if (cart.error) {
      const content = `
            <div class="no-cart">
            <h2 class="h2">Al parecer este carrito no existe<h3>
            <h3 class="h3">desea crear uno?<h4>
            <input class="btn" type="button" onclick="createCart(${userId})" name="boton" value="createCart">
            </div>
            `;
      main.innerHTML = content;
    } else if (!cart.length) {
      const content = `
            <div class="no-cart">
            <h2 class="h2">Carrito vacio<h3>
            <input class="btn" type="button" value="Home" onClick="mainBody()">
            </div>
            `;
      main.innerHTML = content;
    } else {
      main.innerHTML = "";
     menu.innerHTML = cartOptions;
      cart.forEach((product) => {
        document.createElement("div");
        const content = `
                <div class="card-container">
                    <div class="image-container"><img class="image" src="${product.thumbnail}" alt=""></div>
                    <div class="detail-container">
                        <p class="description-title">${product.title}</p>
                        <p class="description-card"><strong>-tipo:</strong> ${product.code}<br>
                        <strong>-description:</strong><br>${product.description}<br>
                        <strong>-price:</strong> $:${product.price}-<br>
                        <strong>-stock:</strong> ${product.stock}
                        </p>
                    </div>
                    <input class="btn" type="button" onclick="deleteFromCart(${product.id}, '${product.title}')" name="boton" value="deleteFromCart">
                </div>
                `;
        main.innerHTML += content;
      });
    }
  }
}

async function deleteFromCart(id, title) {
  const url = `/api/cart/${userId}/products/${id}/`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch(url, options)
    .then((response) => console.log(response.status))
    .catch((error) => console.log(error));
  Toastify({
    text: `${title} removido del carrito`,
    className: "info",
    position: "right",
    gravity: "bottom",
    duration: 5000,
    close: true,
    style: {
      color: "white",
      background: "linear-gradient(45deg, cornflowerblue, darkslateblue)",
    },
  }).showToast();
  DetailCart();
}

async function deleteCart(id) {
  const url = `/api/cart/${id}`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch(url, options)
    .then((response) => console.log(response.status))
    .then(alert('Carrito Eliminado'));
}

mainBody();
