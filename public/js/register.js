

var thisFile = document.querySelector(".thisFile");
var fileItem;
var fileName;

async function newUser() {
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const address = document.getElementById("address").value;
  const email = document.getElementById("email").value;
  const email2 = document.getElementById("email2").value;
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;
  const admin = document.getElementById(`admin`).value;
  const file = document.querySelector(".inputFile").files[0];

  if(!firstname) {
    tostada ("Nombre")
    document.querySelector('.firstname').classList.add('flasher')
  } 
  if (!lastname) {
    tostada ("Apellido")
    document.querySelector('.lastname').classList.add('flasher')
  }
  if (!email) {
    tostada ("Email")
    document.querySelector('.email').classList.add('flasher')
  }
  if (!email2) {
    tostada ("Repetir Email")
    document.querySelector('.email2').classList.add('flasher')
  }
  if (!address) {
    tostada ("Direccion")
    document.querySelector('.lastname').classList.add('flasher')
  }
  if (email !== email2) {
    tostada ("los campos de e-mail no coinciden")
    document.querySelector('.email').classList.add('flasher')
    document.querySelector('.email2').classList.add('flasher')
  }
  if (!password) {
    tostada ("Contraseña")
    document.querySelector('.password').classList.add('flasher')
  }
  if (!password2) {
    tostada ("repita su contraseña")
    document.querySelector('.password2').classList.add('flasher')
  }
  if (password !== password2) {
    tostada ("las contraseñas no coinciden")
    document.querySelector('.password').classList.add('flasher')
    document.querySelector('.password2').classList.add('flasher')
  }
  if (!file) {
    tostada ("Subir un avatar (.jpg)")
  }
  if(firstname && lastname  && address && email && email2 && email == email2 && password && password2 && password == password2 && file) {
    const formData = new FormData();
    formData.append("avatar", file, email + ".jpg");
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("address", address);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("admin", admin);

    Swal.fire({
      title: "New User",
      text: `El usuario ${email} será creado.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "confirmar",
      cancelButtonText: "cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("/api/user", {
          method: "POST",
          body: formData,
        })
          .then((res) => console.log(res.status))
          .catch((error) => console.log(error));
        Swal.fire({
          title: "Exito!",
          text: `El usuario ${email} ha sido creado.`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "entendido",
          footer: "será redirigido a la pagina de Login"
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/";
          }
        });
      }
    });
  }
}



function getFile(e) {
  fileItem = e.target.files[0];
  fileName = fileItem.name;
  thisFile.innerHTML = fileName;
}

function tostada (msg) {
  Toastify({
    text: msg,
    className: "info",
    position: "right",
    gravity: "bottom",
    duration: 5000,
    close: true,
    style: {
      color: "white",
      background: "red",
    },
  }).showToast();
}