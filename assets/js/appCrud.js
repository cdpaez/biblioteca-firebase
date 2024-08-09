//aprovechar la modularidad\\
//intentar trabajar exclusivamente con funciones\\
//se puede modificar para llamar a una funcion que abra una base de datos\\


const nombreBD = 'BibliotecaDB'
const versionBDBiblioteca = 1;


const solicitudBibliotecaBD = indexedDB.open(nombreBD, versionBDBiblioteca);
solicitudBibliotecaBD.onerror = (evento) => {
    let peticion = evento.target.result;
    console.log(`error al instanciar la base de datos: ${nombreBD}`);
}
solicitudBibliotecaBD.onupgradeneeded = (evento) => {
    let peticion = evento.target.result;
    console.log(`actualizacion exitosa de la base de datos: ${nombreBD}`);
    
    //aca se crea los almacenes de objetos para una base de datos indexada\\
    let bibliotecaUsuarios = peticion.createObjectStore('usuarios', {
         keyPath: 'CI' 
        });
    let bibliotecaLibros = peticion.createObjectStore('libros', { 
        keyPath: 'codigo'
    });
    let bibliotecaPrestamos = peticion.createObjectStore('prestamos', { 
        keyPath: 'codigo'
    });
    
    //indices creados en los respectivos almacenes de objetos\\
    bibliotecaUsuarios.createIndex('CI', 'CI', { unique: false });
    bibliotecaUsuarios.createIndex('email', 'email', { unique: false });
    bibliotecaUsuarios.createIndex('sector', 'sector', { unique: false });
    bibliotecaUsuarios.createIndex('genero', 'genero', { unique: false });
    bibliotecaLibros.createIndex('codigo', 'codigo', { unique: false });
    bibliotecaPrestamos.createIndex('codigo','codigo',{unique:true});
    

}
solicitudBibliotecaBD.onsuccess = (evento) => {
    //el evento del exito vs el evento del evento de escucha es importante diferenciarlos\\
    let peticion = evento.target.result;
    console.log(`acceso exitoso a la base de datos: ${nombreBD}`);
    
    //se agregan los eventos click a los botones de agregar y actualizar\\
    document.getElementById('agregar-usuario').addEventListener('click',(evento)=>{
        evento.preventDefault();
        agregarUsuario(peticion, nombreBD);
    });
    
    document.getElementById('actualizar-usuario').addEventListener('click',(evento)=>{
        evento.preventDefault();
        actualizarUsuario(peticion, nombreBD);
    });

    mostrarUsuariosBiblioteca(peticion, nombreBD);

    document.getElementById('agregar-libro').addEventListener('click',(evento)=>{
        evento.preventDefault();
        agregarLibro(peticion, nombreBD);
    });
    document.getElementById('actualizar-libro').addEventListener('click',(evento)=>{
        evento.preventDefault();
        actualizarLibro(peticion, nombreBD);
    });
    
    mostrarLibrosBiblioteca(peticion, nombreBD);

    
    document.getElementById('agregar-prestamo').addEventListener('click',(evento)=>{
        evento.preventDefault();
        agregarPrestamo(peticion, nombreBD);
    });
    
    document.getElementById('actualizar-prestamo').addEventListener('click',(evento)=>{
        evento.preventDefault();
        actualizarPrestamo(peticion, nombreBD);
    });
    mostrarPrestamosBiblioteca(peticion, nombreBD);
    
}

//configuracion de almacen de objetos usuarios\\

//funcion agregar usuario\\

function agregarUsuario(evento, nombreDB){
    let peticion = evento;

    //datos de los usuarios de la biblioteca\\
    let credencialUsuario = document.getElementById('cedula').value; 
    let nombreUsuario = document.getElementById('usuario').value;
    let contrasena1 = document.getElementById('contrasena1').value;
    let contrasena2 = document.getElementById('contrasena2').value;
    let email = document.getElementById('email').value;
    let telefono = document.getElementById('telefono').value;
    let edad = document.getElementById('edad').value;
    let genero = document.getElementById('genero_usuario').value;
    let sector = document.getElementById('sector').value

    if (
        credencialUsuario === "" ||
        nombreUsuario === "" ||
        contrasena1 === "" ||
        contrasena2 === "" ||
        email === "" ||
        telefono === "" ||
        edad === "" ||
        genero === "" ||
        sector === ""
    ) {
        alert('Debe completar el formulario');
        return;
    }
    if (contrasena1 !== contrasena2) {
        alert('Las contraseñas no coinciden')
        return;
    }

    let DatosUsuario = {
        CI: credencialUsuario,
        nombre : nombreUsuario,
        contrasena : contrasena2,
        email: email,
        telefono: telefono,
        edad: edad,
        genero: genero,
        sector: sector
    };

    // Crear una transacción de lectura-escritura\\
    let operacionAgregarUsuarios = peticion.transaction("usuarios", "readwrite");
    let almacenUsuarios = operacionAgregarUsuarios.objectStore("usuarios");

    //insercion de datos en bibliotecaBD\\
    let transaccionFinalizada = almacenUsuarios.add(DatosUsuario);

    //resultados de la transaccion\\
    transaccionFinalizada.onerror = (evento) => {
        let peticion = evento.target.result;
        console.log(`error al agregar usuario a la BD: ${nombreDB}`);
        alert(`el usuario ${credencialUsuario} ya existe.`);
    }
    transaccionFinalizada.onsuccess = (evento) => {
        let peticion = evento.target.result;
        console.log(`se agrego el usuario ${nombreUsuario} exitosamente`);
        alert(`usuario ${nombreUsuario} agregado exitosamente`);
        document.getElementById('cedula').value = "";
        document.getElementById('usuario').value = "";
        document.getElementById('contrasena1').value = "";
        document.getElementById('contrasena2').value = "";
        document.getElementById('email').value = "";
        document.getElementById('telefono').value = "";
        document.getElementById('edad').value = "";
        document.getElementById('genero_usuario').value = "";
        document.getElementById('sector').value = "";
        window.location.reload();
    }
}

function actualizarUsuario(evento, nombreDB) {
    let peticion = evento;

    //datos de los usuarios de la biblioteca\\
    let credencialUsuario = document.getElementById('cedula').value; 
    let nombreUsuario = document.getElementById('usuario').value;
    let contrasena1 = document.getElementById('contrasena1').value;
    let contrasena2 = document.getElementById('contrasena2').value;
    let email = document.getElementById('email').value;
    let telefono = document.getElementById('telefono').value;
    let edad = document.getElementById('edad').value;
    let genero = document.getElementById('genero_usuario').value;
    let sector = document.getElementById('sector').value

    if (
        credencialUsuario === "" ||
        nombreUsuario === "" ||
        contrasena1 === "" ||
        contrasena2 === "" ||
        email === "" ||
        telefono === "" ||
        edad === "" ||
        genero === "" ||
        sector === ""
    ) {
        alert('Debe completar el formulario');
        return;
    }
    if (contrasena1 !== contrasena2) {
        alert('Las contraseñas no coinciden')
        return;
    }

    let DatosUsuario = {
        CI: credencialUsuario,
        nombre : nombreUsuario,
        contrasena : contrasena2,
        email: email,
        telefono: telefono,
        edad: edad,
        genero: genero,
        sector: sector
    };

    // Crear una transacción de lectura-escritura\\
    let operacionAgregarUsuarios = peticion.transaction("usuarios", "readwrite");
    let almacenUsuarios = operacionAgregarUsuarios.objectStore("usuarios");

    //insercion de datos en bibliotecaBD\\
    let transaccionFinalizada = almacenUsuarios.put(DatosUsuario);

    //resultados de la transaccion\\
    transaccionFinalizada.onerror = (evento) => {
        let peticion = evento.target.result;
        console.log(`error al agregar usuario a la BD: ${nombreDB}`);
        alert(`el usuario ${credencialUsuario} ya existe.`);
    }
    transaccionFinalizada.onsuccess = (evento) => {
        let peticion = evento.target.result;
        console.log(`se agrego el usuario ${nombreUsuario} exitosamente`);
        alert(`usuario ${nombreUsuario} agregado exitosamente`);
        document.getElementById('cedula').value = "";
        document.getElementById('usuario').value = "";
        document.getElementById('contrasena1').value = "";
        document.getElementById('contrasena2').value = "";
        document.getElementById('email').value = "";
        document.getElementById('telefono').value = "";
        document.getElementById('edad').value="";
        document.getElementById('genero_usuario').value="";
        document.getElementById('sector').value="";
        window.location.reload();
    }
}

//mini ventana\\
function openPopup(evento, nombre) {
    evento.preventDefault(); // Previene la acción por defecto del enlace
    const url = evento.target.href; // Obtiene el href del enlace
    const windowName = nombre; // Nombre de la ventana 
    console.log(windowName);
    const windowFeatures = 'width=400,height=300,scrollbars=no,resizable=no'; //caracteristicas de la ventana
    window.open(url, windowName, windowFeatures);
}

//  funcion borrar elemento\\
function eliminarUsuario (credencial){
    const solicitudBibliotecaBD = indexedDB.open(nombreBD,versionBDBiblioteca);
    solicitudBibliotecaBD.onsuccess = (evento)=>{
        let peticion = evento.target.result;
        let operacionEliminarUsuario = peticion.transaction('usuarios','readwrite');
        let almacenUsuarios = operacionEliminarUsuario.objectStore('usuarios');
        let peticionEliminarUsuario = almacenUsuarios.delete(credencial);

        peticionEliminarUsuario.onsuccess = (evento)=>{
            let peticion = evento.target.result;
            console.log(`se elimino el registro ${credencial}`);
        }
    }
}

//Mostrar informacion de los usuarios\\
function mostrarDatosUsuario(credencial) {
    console.log('esto que es',credencial)
    const solicitudBibliotecaBD = indexedDB.open(nombreBD,versionBDBiblioteca);
    solicitudBibliotecaBD.onsuccess = (evento) => {
        let peticion = evento.target.result;
        let operacionMostrarUsuario = peticion.transaction('usuarios', 'readonly');
        let almacenUsuarios = operacionMostrarUsuario.objectStore('usuarios');
        let idIndice = almacenUsuarios.index('CI')
        let peticionBuscarUsuario = idIndice.get(credencial);

        peticionBuscarUsuario.onsuccess = (evento) => {
            let peticion = evento.target.result;
            console.log(`se busco el usuario con la credencial ${credencial}`, peticion);
            document.getElementById('cedula').value = peticion.CI;
            document.getElementById('usuario').value = peticion.nombre;
            document.getElementById('email').value = peticion.email;
            document.getElementById('telefono').value = peticion.telefono;
            document.getElementById('edad').value = peticion.edad;
            document.getElementById('genero_usuario').value = peticion.genero;
            document.getElementById('sector').value = peticion.sector;
        }
    }
}

//Mostrar informacion en pantalla\\
function mostrarUsuariosBiblioteca(evento, nombreBD){
    let peticion = evento;
    //contenedor donde se mostrara la lista de usuarios\\
    
    // Crear una transacción de solo lectura y llamar a un indice para optimizar la busqueda.\\
    let operacionMostrarUsuarios = peticion.transaction("usuarios", "readonly");
    let almacenUsuarios = operacionMostrarUsuarios.objectStore("usuarios");
    let peticionMostrarUsuarios = almacenUsuarios.getAll();
    //si la peticion fue exitosa entonces\\
    peticionMostrarUsuarios.onerror = (evento) => {
        let peticion = evento.target.result;
        console.log('hubo un error al leer los datos');
    }
    peticionMostrarUsuarios.onsuccess = (evento) =>{
        let peticion = evento.target.result;
        console.log(`se han mostrado los usuarios de ${nombreBD} de manera exitosa`);
        console.log(peticion);
        //recorrer cada objeto mostrando su información\\
        // Crear elementos <a> y agregarlos a la lista
            peticion.forEach(item => {
                let listaUsuarios = document.getElementById('lista-usuarios');
                
                const divItem = document.createElement('div');
                const attrClassDiv = document.createAttribute('class');
                attrClassDiv.value = 'opciones__usuarios';
                divItem.setAttributeNode(attrClassDiv);

                const listItem = document.createElement('li');
                listItem.style.listStyleType = 'none';

                const anchor = document.createElement('a');
                anchor.textContent = item.CI; // Suponiendo que hay un campo "nombre" en tus objetos
                anchor.href = `/popup/popupUsuarios.html?id=${item.CI}`;
                anchor.onclick = (evento)=>{
                    openPopup(evento, item.nombre);
                };
                const btn_borrar = document.createElement('button');
                const attrClassBorrar = document.createAttribute('class');
                attrClassBorrar.value = 'usuarioBorrar';
                btn_borrar.setAttributeNode(attrClassBorrar);
                btn_borrar.onclick = (evento)=>{
                    console.log('se procedio con la funcion borrar registro', evento);
                    eliminarUsuario(item.CI);
                    alert(`se elimino el usuario ${item.nombre}`);
                    window.location.reload();
                }

                const btn_actualizar = document.createElement('button');
                const attrClassActualizar = document.createAttribute('class');
                attrClassActualizar.value = 'usuarioActualizar';
                btn_actualizar.setAttributeNode(attrClassActualizar);
                btn_actualizar.onclick = (evento) => {
                    console.log('se cargaron los datos del usuario a la pagina', evento);
                    mostrarDatosUsuario(item.CI);
                    alert(`se han cargado los datos del usuario ${item.nombre}`);
                }
                
                listItem.appendChild(anchor);
                listItem.appendChild(divItem);
                divItem.appendChild(btn_borrar);
                divItem.appendChild(btn_actualizar);
                listaUsuarios.appendChild(listItem);
            });
    }
}



//configuracion de almacen de objetos libros\\

function agregarLibro(evento, nombreDB){
    let peticion = evento;

    //datos del libro de la biblioteca\\
    let codigo = document.getElementById('codigo').value; 
    let titulo = document.getElementById('titulo').value;
    let genero = document.getElementById('genero').value;
    let editorial = document.getElementById('editorial').value;

    if (
        codigo === "" ||
        titulo === "" ||
        genero === "" ||
        editorial === "" 
    ) {
        alert('Debe completar el formulario');
        return;
    }

    let datosLibro = {
        codigo: codigo,
        titulo: titulo,
        genero : genero,
        editorial: editorial
    };

    // Crear una transacción de lectura-escritura\\
    let operacionAgregarLibro = peticion.transaction("libros", "readwrite");
    let almacenLibros = operacionAgregarLibro.objectStore("libros");

    //insercion de datos en bibliotecaBD\\
    let transaccionFinalizada = almacenLibros.add(datosLibro);

    //resultados de la transaccion\\
    transaccionFinalizada.onerror = (evento) => {
        let peticion = evento.target.result;
        console.log(`error al agregar libro a la BD: ${nombreDB}`);
        alert(`el libro ${titulo} ya existe.`);
    }
    transaccionFinalizada.onsuccess = (evento) => {
        let peticion = evento.target.result;
        console.log(`se agrego el libro ${titulo} exitosamente`);
        alert(`${titulo} agregado exitosamente`);
        document.getElementById('codigo').value = "";
        document.getElementById('titulo').value = "";
        document.getElementById('genero').value = "";
        document.getElementById('editorial').value = "";
        window.location.reload();
    }
}

function actualizarLibro(evento, nombreDB) {
    let peticion = evento;

    //datos del libro de la biblioteca\\
    let codigo = document.getElementById('codigo').value; 
    let titulo = document.getElementById('titulo').value;
    let genero = document.getElementById('genero').value;
    let editorial = document.getElementById('editorial').value;

    if (
        codigo === "" ||
        titulo === "" ||
        genero === "" ||
        editorial === "" 
    ) {
        alert('Debe completar el formulario');
        return;
    }

    let datosLibro = {
        codigo: codigo,
        titulo: titulo,
        genero : genero,
        editorial: editorial
    };

    
    // Crear una transacción de lectura-escritura\\
    let operacionAgregarLibro = peticion.transaction("libros", "readwrite");
    let almacenLibros = operacionAgregarLibro.objectStore("libros");

    //insercion de datos en bibliotecaBD\\
    let transaccionFinalizada = almacenLibros.put(datosLibro);
   

    //resultados de la transaccion\\
    transaccionFinalizada.onerror = (evento) => {
        let peticion = evento.target.result;
        console.log(`error al agregar libro a la BD: ${nombreDB}`);
        alert(`el libro ${titulo} ya existe.`);
    }
    transaccionFinalizada.onsuccess = (evento) => {
        let peticion = evento.target.result;
        console.log(`se actualizo el libro ${titulo} exitosamente`);
        alert(`el libro "${titulo}" actualizado exitosamente`);
        document.getElementById('codigo').value = "";
        document.getElementById('titulo').value = "";
        document.getElementById('genero').value = "";
        document.getElementById('editorial').value = "";
        
    }
}

//mini ventana\\
function openPopupLibro(evento, titulo) {
    evento.preventDefault(); // Previene la acción por defecto del enlace
    const url = evento.target.href; // Obtiene el href del enlace
    const windowName = titulo; // Nombre de la ventana 
    console.log(windowName);
    const windowFeatures = 'width=400,height=300,scrollbars=no,resizable=no'; //caracteristicas de la ventana
    window.open(url, windowName, windowFeatures);
}

//  funcion borrar elemento\\
function eliminarLibro (codigo){
    const solicitudBibliotecaBD = indexedDB.open(nombreBD,versionBDBiblioteca);
    solicitudBibliotecaBD.onsuccess = (evento)=>{
        let peticion = evento.target.result;
        let operacionEliminarLibro = peticion.transaction('libros','readwrite');
        let almacenLibros = operacionEliminarLibro.objectStore('libros');
        let peticionEliminarLibro = almacenLibros.delete(codigo);

        peticionEliminarLibro.onsuccess = (evento)=>{
            let peticion = evento.target.result;
            console.log(`se elimino el libro ${codigo}`);
        }
    }
}

//Mostrar informacion de los usuarios\\
function mostrarDatosLibro(codigo) {
    console.log('esto que es',codigo)
    const solicitudBibliotecaBD = indexedDB.open(nombreBD,versionBDBiblioteca);
    solicitudBibliotecaBD.onsuccess = (evento) => {
        let peticion = evento.target.result;
        let operacionMostrarLibro = peticion.transaction('libros', 'readonly');
        let almacenLibros = operacionMostrarLibro.objectStore('libros');
        let idIndice = almacenLibros.index('codigo')
        let peticionBuscarLibro = idIndice.get(codigo);

        peticionBuscarLibro.onsuccess = (evento) => {
            let peticion = evento.target.result;
            console.log(`se busco el libro con el codigo ${codigo}`, peticion);
            document.getElementById('codigo').value = peticion.codigo;
            document.getElementById('titulo').value = peticion.titulo;
            document.getElementById('genero').value = peticion.genero;
            document.getElementById('editorial').value = peticion.editorial;
        }
    }
}

function mostrarLibrosBiblioteca(evento, nombreBD){
    let peticion = evento;
    //contenedor donde se mostrara la lista de usuarios\\
    
    // Crear una transacción de solo lectura y llamar a un indice para optimizar la busqueda.\\
    let operacionMostrarLibros = peticion.transaction("libros", "readonly");
    let almacenLibros = operacionMostrarLibros.objectStore("libros");
    let peticionMostrarLibros = almacenLibros.getAll();
    //si la peticion fue exitosa entonces\\
    peticionMostrarLibros.onerror = (evento) => {
        let peticion = evento.target.result;
        console.log('hubo un error al leer los datos');
    }
    peticionMostrarLibros.onsuccess = (evento) =>{
        let peticion = evento.target.result;
        console.log(`se han mostrado los libros de ${nombreBD} de manera exitosa`);
        console.log(peticion);
        //recorrer cada objeto mostrando su información\\
        // Crear elementos <a> y agregarlos a la lista
            peticion.forEach(item => {
                let listaLibros = document.getElementById('lista-libros');

                const divItem = document.createElement('div');
                const attrClassDiv = document.createAttribute('class');
                attrClassDiv.value = 'opciones__libros';
                divItem.setAttributeNode(attrClassDiv);


                const listItem = document.createElement('li');
                listItem.style.listStyleType = 'none';


                const anchor = document.createElement('a');
                anchor.textContent = item.codigo; // Suponiendo que hay un campo "codigo" en tus objetos
                anchor.href = `/popup/popupLibros.html?id=${item.codigo}`;
                anchor.onclick = (evento)=>{
                    openPopupLibro(evento, item.titulo);
                };


                const btn_borrar = document.createElement('button');
                const attrClassBorrar = document.createAttribute('class');
                attrClassBorrar.value = 'librosBorrar';
                btn_borrar.setAttributeNode(attrClassBorrar);
                btn_borrar.onclick = (evento)=>{
                    console.log('se procedio con la funcion borrar registro', evento);
                    eliminarLibro(item.codigo);
                    alert(`se elimino el libro ${item.titulo}`);
                    window.location.reload();
                }

                const btn_actualizar = document.createElement('button');
                const attrClassActualizar = document.createAttribute('class');
                attrClassActualizar.value = 'librosActualizar';
                btn_actualizar.setAttributeNode(attrClassActualizar);
                btn_actualizar.onclick = (evento) => {
                    console.log('se cargaron los datos del libro a la pagina', evento);
                    mostrarDatosLibro(item.codigo);
                    alert(`se han cargado los datos del libro ${item.titulo}`);
                }
                
                listItem.appendChild(anchor);
                listItem.appendChild(divItem);
                divItem.appendChild(btn_borrar);
                divItem.appendChild(btn_actualizar);
                listaLibros.appendChild(listItem);
            });
    }
}

/*::::::    Prestamos    :::::::*/

function agregarPrestamo(evento, nombreDB){
    let peticion = evento;

    //datos del usuario y del libro  de la biblioteca\\
    let codigoLibro = document.getElementById('codigo_prestamo').value; 
    let cedulaUsuario = document.getElementById('cedula_prestamo').value; 
    
    if (
        codigoLibro === "" ||
        cedulaUsuario === ""
    ) {
        alert('Debe completar el formulario');
        return;
    }

    let DatosPrestamos = {
        codigo: codigoLibro,
        CI : cedulaUsuario
    };

    // Crear una transacción de lectura-escritura\\
    let operacionAgregarPrestamos = peticion.transaction("prestamos", "readwrite");
    let almacenPrestamos = operacionAgregarPrestamos.objectStore("prestamos");

    //insercion de datos en bibliotecaBD\\
    let transaccionFinalizada = almacenPrestamos.add(DatosPrestamos);

    //resultados de la transaccion\\
    transaccionFinalizada.onerror = (evento) => {
        let peticion = evento.target.result;
        console.log(`error al agregar Prestamos a la BD: ${nombreDB}`);
        alert(`El libro ${codigoLibro} ya fue adquirido por otro usuario.`);
    }
    transaccionFinalizada.onsuccess = (evento) => {
        let peticion = evento.target.result;
        console.log(`se agrego el prestamo al usuario ${cedulaUsuario} exitosamente`);
        alert(`usuario ${cedulaUsuario} ha pedido un prestamo`);
        document.getElementById('codigo_prestamo').value = "";
        document.getElementById('cedula_prestamo').value = "";
        window.location.reload();
    }
}

function actualizarPrestamo(evento, nombreDB) {
    let peticion = evento;

    //datos de los usuarios de la biblioteca\\
    let codigoLibro = document.getElementById('codigo_prestamo').value; 
    let cedulaUsuario = document.getElementById('cedula_prestamo').value; 

    if (
        codigoLibro === "" ||
        cedulaUsuario === ""
    ) {
        alert('Debe completar el formulario');
        return;
    }

    let DatosPrestamos = {
        codigo: codigoLibro,
        CI : cedulaUsuario
    };

    let operacionAgregarPrestamos = peticion.transaction("prestamos", "readwrite");
    let almacenPrestamos = operacionAgregarPrestamos.objectStore("prestamos");

    //insercion de datos en bibliotecaBD\\
    let transaccionFinalizada = almacenPrestamos.put(DatosPrestamos);

    //resultados de la transaccion\\
    transaccionFinalizada.onerror = (evento) => {
        let peticion = evento.target.result;
        console.log(`error al agregar Prestamos a la BD: ${nombreDB}`);
        alert(`El libro ${codigoLibro} ya fue adquirido por otro usuario.`);
    }
    transaccionFinalizada.onsuccess = (evento) => {
        let peticion = evento.target.result;
        console.log(`se agrego el prestamo al usuario ${cedulaUsuario} exitosamente`);
        alert(`usuario ${cedulaUsuario} ha actualizado un prestamo`);
        document.getElementById('codigo_prestamo').value = "";
        document.getElementById('cedula_prestamo').value = "";
        window.location.reload();
    }
}

//mini ventana\\
function openPopupPrestamo(evento, nombre) {
    evento.preventDefault(); // Previene la acción por defecto del enlace
    const url = evento.target.href; // Obtiene el href del enlace
    const windowName = nombre; // Nombre de la ventana 
    console.log(windowName);
    const windowFeatures = 'width=400,height=300,scrollbars=no,resizable=no'; //caracteristicas de la ventana
    window.open(url, windowName, windowFeatures);
}

//  funcion borrar elemento\\
function eliminarPrestamo (codigo){
    const solicitudBibliotecaBD = indexedDB.open(nombreBD,versionBDBiblioteca);
    solicitudBibliotecaBD.onsuccess = (evento)=>{
        let peticion = evento.target.result;
        let operacionEliminarPrestamos = peticion.transaction('prestamos','readwrite');
        let almacenPrestamos = operacionEliminarPrestamos.objectStore('prestamos');
        let peticionEliminarPrestamos = almacenPrestamos.delete(codigo);

        peticionEliminarPrestamos.onsuccess = (evento)=>{
            let peticion = evento.target.result;
            console.log(`se elimino el prestamo ${peticion}`);
        }
    }
}

//Mostrar informacion de los usuarios\\
function mostrarDatosPrestamos(codigo) {
    console.log('esto que es',codigo)
    const solicitudBibliotecaBD = indexedDB.open(nombreBD,versionBDBiblioteca);
    solicitudBibliotecaBD.onsuccess = (evento) => {
        let peticion = evento.target.result;
        let operacionMostrarDatos = peticion.transaction('prestamos', 'readonly');
        let almacenPrestamos = operacionMostrarDatos.objectStore('prestamos');
        let codigoIndice = almacenPrestamos.index('codigo')
        let peticionBuscarPrestamos = codigoIndice.get(codigo);

        peticionBuscarPrestamos.onsuccess = (evento) => {
            let peticion = evento.target.result;
            console.log(`se busco el prestamo con el codigo ${codigo}`, peticion);
            document.getElementById('codigo_prestamo').value = peticion.codigo;
            document.getElementById('cedula_prestamo').value = peticion.CI;
        }
    }
}

//Mostrar informacion en pantalla\\
function mostrarPrestamosBiblioteca(evento, nombreBD){
    let peticion = evento;
    //contenedor donde se mostrara la lista de usuarios\\
    
    // Crear una transacción de solo lectura y llamar a un indice para optimizar la busqueda.\\
    let operacionMostrarPrestamos = peticion.transaction("prestamos", "readonly");
    let almacenPrestamos = operacionMostrarPrestamos.objectStore("prestamos");
    let peticionMostrarPrestamos = almacenPrestamos.getAll();
    //si la peticion fue exitosa entonces\\
    peticionMostrarPrestamos.onerror = (evento) => {
        let peticion = evento.target.result;
        console.log('hubo un error al leer los datos');
    }
    peticionMostrarPrestamos.onsuccess = (evento) =>{
        let peticion = evento.target.result;
        console.log(`se han mostrado los prestamos de ${nombreBD} de manera exitosa`);
        console.log(peticion);
        //recorrer cada objeto mostrando su información\\
        // Crear elementos <a> y agregarlos a la lista
            peticion.forEach(item => {
                let listaPrestamos = document.getElementById('lista-prestamos');
                
                const divItem = document.createElement('div');
                const attrClassDiv = document.createAttribute('class');
                attrClassDiv.value = 'opciones__prestamos';
                divItem.setAttributeNode(attrClassDiv);

                const listItem = document.createElement('li');
                listItem.style.listStyleType = 'none';

                const anchor = document.createElement('a');
                anchor.textContent = item.codigo; // Suponiendo que hay un campo "codigo" en tus objetos
                anchor.href = `/popup/popupPrestamos.html?id=${item.codigo}`;
                anchor.onclick = (evento)=>{
                    openPopupPrestamo(evento, item.codigo);
                };
                const btn_borrar = document.createElement('button');
                const attrClassBorrar = document.createAttribute('class');
                attrClassBorrar.value = 'prestamoBorrar';
                btn_borrar.setAttributeNode(attrClassBorrar);
                btn_borrar.onclick = (evento)=>{
                    console.log('se procedio con la funcion borrar registro', evento);
                    eliminarPrestamo(item.codigo);
                    alert(`se elimino el prestamo ${item.codigo}`);
                    window.location.reload();
                }

                const btn_actualizar = document.createElement('button');
                const attrClassActualizar = document.createAttribute('class');
                attrClassActualizar.value = 'prestamoActualizar';
                btn_actualizar.setAttributeNode(attrClassActualizar);
                btn_actualizar.onclick = (evento) => {
                    console.log('se cargaron los datos del prestamos a la pagina', evento);
                    mostrarDatosPrestamos(item.codigo);
                    alert(`se han cargado los datos del prestamo ${item.codigo}`);
                }
                
                listItem.appendChild(anchor);
                listItem.appendChild(divItem);
                divItem.appendChild(btn_borrar);
                divItem.appendChild(btn_actualizar);
                listaPrestamos.appendChild(listItem);
            });
    }
}