var excelData = null;

// Función para manejar la selección de archivo
function seleccionarArchivo(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    
    reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});

        // Supongamos que queremos los datos de la primera hoja
        var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        excelData = XLSX.utils.sheet_to_json(firstSheet);

        console.log("Datos del archivo Excel leídos exitosamente.");
    };

    reader.readAsArrayBuffer(file);
}

// Función para almacenar datos en IndexedDB
function importarPrestamos() {
    if (!excelData) {
        console.error("No hay datos para importar. Por favor, selecciona un archivo primero.");
        return;
    }

    var request = window.indexedDB.open("BibliotecaDB", 1);

    request.onsuccess = function(event) {
        var db = event.target.result;
        
        var transaction = db.transaction("prestamos", "readwrite");
        var objectStore = transaction.objectStore("prestamos");

        excelData.forEach(item => {
            objectStore.put(item);
        });

        transaction.oncomplete = function() {
            console.log("Todos los datos se han almacenado exitosamente.");
            alert("Datos importados exitosamente a la base de datos.");
            window.location.reload();
        };

        transaction.onerror = function() {
            console.error("Error al almacenar los datos en IndexedDB.");
        };
    };

    request.onerror = function(event) {
        console.error("Error al abrir la base de datos.");
    };
}
// Asignar la función seleccionarArchivo al evento change del input file
document.getElementById('fileInputPRT').addEventListener('change', seleccionarArchivo);