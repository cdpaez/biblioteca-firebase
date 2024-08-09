let graficaUsuarios = document.getElementById('grafico1').getContext('2d');
let parametrosUsuarios = {
    type: 'line',
    data:{
        labels: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
        datasets:[
            {
                label: 'usuarios',
                backgroundColor: 'rgb(0,0,0)',
                borderColor: 'rgb(0,255,0)',
                data: [10,20,30,35,40,15,25,5,45,50,55,60]
            }
        ]

    }
};
var usuarios = new Chart(graficaUsuarios,parametrosUsuarios);

let graficaLibros = document.getElementById('grafico2').getContext('2d');
let parametrosLibros = {
    type: 'bar',
    data:{
        labels: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
        datasets:[
            {
                label: 'Libros',
                backgroundColor: [
                    'rgb(0, 0, 0)',      // Negro
                    'rgb(255, 0, 0)',    // Rojo
                    'rgb(0, 255, 0)',    // Verde
                    'rgb(0, 0, 255)',    // Azul
                    'rgb(255, 255, 0)',  // Amarillo
                    'rgb(0, 255, 255)',  // Cian
                    'rgb(255, 0, 255)',  // Magenta
                    'rgb(192, 192, 192)',// Plata
                    'rgb(128, 128, 128)',// Gris
                    'rgb(128, 0, 0)',    // Marrón
                    'rgb(128, 128, 0)',  // Verde oliva
                    'rgb(0, 128, 128)'   // Verde azulado
                  ],
                borderColor: 'rgb(255,255,255)',
                data: [10,20,30,35,40,15,25,5,45,50,55,60]
            }
        ]

    }
};
var libros = new Chart(graficaLibros,parametrosLibros);