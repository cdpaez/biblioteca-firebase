document.getElementById('form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('password').value;
    const nombreBD = "BibliotecaDB";
    const version = 1;


    let solicitudBD = indexedDB.open(nombreBD, version);
    solicitudBD.onsuccess = (ev) => { 
        let peticion = ev.target.result;
        console.log(`Base de datos ${nombreBD} abierta con éxito`);
        
        /*indicamos el tipo de operacion que se desea realizar*/
        let peticionValidarUsuario = peticion.transaction("usuarios", "readonly").objectStore("usuarios").index("email").get(email);
        
        
        peticionValidarUsuario.onsuccess = (ev) => { 
            let peticion = ev.target.result;
            console.log(`El usuario ${email} existe en la base de datos`);

            if (peticion) {
                if (peticion.contrasena === contrasena) {
                    console.log(`La contraseña coincide con la del usuario ${email}`);
                    // redireccionar a la página de inicio de sesión
                    window.location.href = "main.html";
                } else {
                    console.log(`La contraseña no coincide con la del usuario ${email}`);
                    alert("La contraseña ingresada no coincide con la registrada.");
                }
            } else {
                console.log(`El usuario ${email} no existe en la base de datos`);
                alert("El usuario ingresado no existe.");
            }
        };

    };
});

