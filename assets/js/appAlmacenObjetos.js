let dbName = 'BibliotecaDB';
let versionDB = 1;
function borrarDatos() {
    let selectedStoreName = document.getElementById('almacenesObjetos').value;

    let dbRequest = indexedDB.open(dbName, 1);

    dbRequest.onsuccess = function(event) {
        let db = event.target.result;

        // Inicia una transacción de escritura en el almacén de objetos seleccionado
        let transaction = db.transaction(selectedStoreName, 'readwrite');
        let objectStore = transaction.objectStore(selectedStoreName);

        // Obtén una solicitud para borrar todos los registros en el almacén de objetos
        let clearRequest = objectStore.clear();

        clearRequest.onsuccess = function(event) {
            console.log(`Se han eliminado todos los datos del almacén de objetos '${selectedStoreName}'.`);
        };

        clearRequest.onerror = function(event) {
            console.error('Error al intentar borrar los datos:', event.target.errorCode);
        };
        window.location.reload();
    };

    dbRequest.onerror = function(event) {
        console.error('Error al abrir la base de datos:', event.target.errorCode);
    };
}

