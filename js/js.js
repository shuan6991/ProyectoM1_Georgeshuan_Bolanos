//Variables

const boton = document.querySelector('.boton-submit')
const form = document.querySelector('.form-main')
const paleta = document.querySelector('.paleta-colores')
const body = document.querySelector('body')

const coloresBloqueados = []



//Evento del DOM
document.addEventListener('DOMContentLoaded', () => {
    setInterval(() => {
        boton.style.backgroundColor = generarColorHexa()
    }, 1000)

    datosForm()
    colorAleatorios()
    generarColoresRGB()

})


//Funcion para obtener datos del formulario
function datosForm() {
    form.addEventListener('submit', e => {
        e.preventDefault()

        const data = new FormData(form)
        const tipo = data.get('tipo')
        const cantidad = data.get('cantidad')

        colorAleatorios(tipo, cantidad)
    })
}



//Funcion para generar colores Hexadecimales
function generarColorHexa() {

    const hexa = "0123456789ABCDEF"

    let color = "#"

    for (let i = 0; i < 6; i++) {

        //Contatenacion de los colores
        color += hexa[Math.floor(Math.random(hexa) * 16)]
    }

    return color
}


//Funcion para obtener colores RGB
function generarColoresRGB() {

    let rgb = ''
    for (let i = 0; i < 3; i++) {
        rgb += Math.floor(Math.random() * 255) + ','

    }
    return rgb = rgb.slice(0, -1)
}


function generarColoresHSL() {
    let h = Math.floor(Math.random() * 360);
    let s = Math.floor(Math.random() * 100);
    let l = Math.floor(Math.random() * 100);

    let hsl = `${h}, ${s}%, ${l}%`

    return hsl


}




//Funcion para generar los colores deacuerdo a la cantidad y el tipo seleccionado

function colorAleatorios(tipo, cantidad) {

    let colores = []

    if (cantidad === undefined && tipo === undefined) {
        cantidad = 6
        tipo = 'Hexa'
    }


    for (let i = 0; i < cantidad; i++) {

        if (coloresBloqueados[i]) {
            colores.push(coloresBloqueados[i])
        } else {
            if (tipo === "Hexa") {
                colores.push(generarColorHexa())
            } else if (tipo === "RGB") {
                colores.push(generarColoresRGB())
            } else {
                colores.push(generarColoresHSL())
            }
        }

    }

    insersionHtml(colores, tipo)
}


//Funcion para insertar los colores en el html
function insersionHtml(colores, tipo) {


    //se valida que el arreglo teng algo
    if (colores.length) {

        // se insertan los colores

        paleta.innerHTML = `
            <h3>Paleta de colores ${tipo}</h3>

            <div class="contenedor-paleta">
                ${colores.map((color, index) => {

            let formatoColor = color

            if (tipo === 'RGB') {
                formatoColor = `rgb(${color})`
            } else if (tipo === "HSL") {
                formatoColor = `hsl(${color})`
            }

            const esBloqueado = coloresBloqueados[index] ? 'bloqueado' : '';

            return `                  
                 <div class="color-paleta ${esBloqueado}" style="background-color: ${formatoColor} ; padding: 2rem;">  
                        <img class='icono-abierto' src='img/candado-abierto.png'/> 
                        <img class='icono-cerrado' src='img/candado-cerrado.png'/>                   
                        <p class='nombre-color'>${color}</p>
                        <img class='copiar-color' src='img/copiar.png'/> 
                    </div>       
                    
       
                 `}).join('')}
            </div>
        
        `
        const copiarColor = document.querySelectorAll(".copiar-color")
        const colorSelected = document.querySelectorAll(".color-paleta")

        copiarColor.forEach(copiarNombre  => {
            copiarNombre .addEventListener('click', e => {
                e.stopPropagation()

                const nombre = copiarNombre.previousElementSibling
                copiarPapeles(nombre.textContent)
            })
        })


        colorSelected.forEach((color, index) => {
            color.addEventListener('click', () => {
                blockColor(colores, index, color)
            })
        })


    } else {
        paleta.innerHTML = `
            <h2 class="paleta-titulo">Escoge el tipo de los colores y el tamaño</h2>
         
         `
    }
}


async function copiarPapeles(nombreColor) {

    console.log(nombreColor)

    const mensaje = document.createElement('P')

    try {
        await navigator.clipboard.writeText(nombreColor)

        mensaje.classList.add('mensaje')
        mensaje.textContent = 'Copiado en el portapapeles'
        body.appendChild(mensaje)

        setTimeout(() => {
            body.removeChild(mensaje)
        }, 3000)


    } catch (error) {
        console.error('error al copiar el color')
    }
}

function blockColor(colores, index, color) {

    if (coloresBloqueados[index]) {
        delete coloresBloqueados[index]
        color.classList.remove('bloqueado')
    } else {
        coloresBloqueados[index] = colores[index]
        color.classList.add('bloqueado')
    }

}