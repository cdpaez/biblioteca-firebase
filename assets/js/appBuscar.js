document.getElementById('cuadro_busqueda').addEventListener('click', () => {
    let dato = document.getElementById('cuadro_busqueda').value;
    const nombreBD = 'BibliotecaDB'
    const versionBDBiblioteca = 1;


    const conexionBuscarElementoBibliotecaBD = indexedDB.open(nombreBD, versionBDBiblioteca);

    conexionBuscarElementoBibliotecaBD.onsuccess = (evento) => {
        let conexionExitosa = evento.target.result;
        console.log('exito',conexionExitosa);
        buscarDato(conexionExitosa,dato);
    }
});

function buscarDato (peticion, dato) {

    let operacionBuscarDato = peticion
        .transaction('usuarios', 'readonly')
        .objectStore('usuarios')
        .index('CI')
        .get(dato);

    operacionBuscarDato.onsuccess = (evento) => {
        let peticion = evento.target.result;
        console.log(`se busco el usuario con la credencial ${dato}`, peticion);
        
    }
}