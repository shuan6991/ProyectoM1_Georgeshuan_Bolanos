
// Variables
const boton = document.querySelector('.boton-submit')
const form = document.querySelector('.form-main')
const paleta = document.querySelector('.paleta-colores')
const body = document.querySelector('body')

// Obteniendo información guardada en localStorage
const datosGuardados = JSON.parse(
    localStorage.getItem('paletasColores')
) || {
    paletas: {},
    bloqueados: {}
}

//Objetos de paletas y colores bloqueados
const paletasGuardadas = datosGuardados.paletas
const coloresBloqueados = datosGuardados.bloqueados


// Funcion para guardar información en localStorage
function guardarLocalStorage() {

    localStorage.setItem('paletasColores', JSON.stringify({
        paletas: paletasGuardadas,
        bloqueados: coloresBloqueados
    }))

}


// Eventos del DOM
document.addEventListener('DOMContentLoaded', () => {

    setInterval(() => {
        boton.style.backgroundColor = generarColorHexa()
    }, 1000)

    datosForm()

    const tipoInicial = form.querySelector('[name="tipo"]').value
    const cantidadInicial = Number(localStorage.getItem('cantidad')) || 6

    mostrarPaleta(tipoInicial, cantidadInicial)

})


//Funcion para obtener datos del formulario
function datosForm() {

    const selectorTipo = form.querySelector('[name="tipo"]')


    selectorTipo.addEventListener('change', () => {

        const cantidad = localStorage.getItem('cantidad') || 6

        mostrarPaleta(selectorTipo.value, cantidad)

    })

    form.addEventListener('submit', e => {

        e.preventDefault()

        const data = new FormData(form)

        const tipo = data.get('tipo')
        const cantidad = Number(data.get('cantidad'))

        localStorage.setItem('cantidad', cantidad)

        colorAleatorios(tipo, cantidad)

    })

}


//Fucion para generar colores HEXA
function generarColorHexa() {

    const hexa = "0123456789ABCDEF"

    let color = "#"

    for (let i = 0; i < 6; i++) {

        color += hexa[Math.floor(Math.random() * 16)]

    }

    return color

}


//Funcion para generar colores RGB
function generarColoresRGB() {

    let rgb = ''

    for (let i = 0; i < 3; i++) {

        rgb += Math.floor(Math.random() * 256) + ','

    }

    return rgb.slice(0, -1)

}


// Funcion para generar colores HSL
function generarColoresHSL() {

    let h = Math.floor(Math.random() * 360)
    let s = Math.floor(Math.random() * 100)
    let l = Math.floor(Math.random() * 100)

    return `${h}, ${s}%, ${l}%`

}


//Funcion para generar colores según el formato y la cantidad
function colorAleatorios(tipo, cantidad) {

    const colores = []

    const coloresAnteriores = paletasGuardadas[tipo] || []
  
    const bloqueados = coloresBloqueados[tipo] || []

    for (let i = 0; i < cantidad; i++) {

        // Si el color está bloqueado, conservarlo
        if (bloqueados[i] && coloresAnteriores[i]) {

            colores.push(coloresAnteriores[i])

        } else {

         
            if (tipo === 'Hexa') {

                colores.push(generarColorHexa())

            } else if (tipo === 'RGB') {

                colores.push(generarColoresRGB())

            } else {

                colores.push(generarColoresHSL())

            }

        }

    }

    // Actualizar la paleta del formato seleccionado
    paletasGuardadas[tipo] = colores

    guardarLocalStorage()

    insersionHtml(colores, tipo)

}


// Recuperar una paleta guardada
function mostrarPaleta(tipo, cantidadLocal) {

    if (paletasGuardadas[tipo] && paletasGuardadas[tipo].length) {
        coloresFaltantes(paletasGuardadas[tipo], tipo, cantidadLocal)
    } else {

        colorAleatorios(tipo, cantidadLocal)

    }

}


//Funcion para ajustar el tamaño seleccionado en todos los tipos
function coloresFaltantes(colores, tipo, cantidad) {  

    const bloqueados = coloresBloqueados[tipo] || []

    for (let i = colores.length; i < cantidad; i++) {

        if (bloqueados[i] && paletasGuardadas[tipo][i]) {

            colores.push(paletasGuardadas[tipo][i])

        } else {

            if (tipo === 'Hexa') {

                colores.push(generarColorHexa())

            } else if (tipo === 'RGB') {

                colores.push(generarColoresRGB())

            } else {

                colores.push(generarColoresHSL())

            }

        }

    }

    paletasGuardadas[tipo] = colores

    guardarLocalStorage()

    insersionHtml(colores, tipo)

}

//Funcion para Insertar los colores en el HTML
function insersionHtml(colores, tipo) {

    if (colores.length) {

        const bloqueados = coloresBloqueados[tipo] || []

        paleta.innerHTML = `
            <h3>Paleta de colores ${tipo}</h3>

            <div class="contenedor-paleta">

                ${colores.map((color, index) => {

            let formatoColor = color

            if (tipo === 'RGB') {
                formatoColor = `rgb(${color})`
            } else if (tipo === 'HSL') {
                formatoColor = `hsl(${color})`
            }

            const esBloqueado = bloqueados[index]
                ? 'bloqueado'
                : ''

            return `
                        <div
                            class="color-paleta ${esBloqueado}"
                            style="background-color: ${formatoColor}; padding: 2rem;"
                        >

                            <img
                                class="icono-abierto"
                                src="img/candado-abierto.png"
                                style="display: ${esBloqueado ? 'none' : 'block'}"
                            />

                            <img
                                class="icono-cerrado"
                                src="img/candado-cerrado.png"
                                style="display: ${esBloqueado ? 'block' : 'none'}"s
                            />

                            <p class="nombre-color">${color}</p>

                            <img
                                class="copiar-color"
                                src="img/copiar.png"
                            />

                        </div>
                    `

        }).join('')}

            </div>
        `

        // Evento para copiar colores
        const copiarColor = document.querySelectorAll('.copiar-color')

        copiarColor.forEach(copiarNombre => {

            copiarNombre.addEventListener('click', e => {

                e.stopPropagation()

                const nombre = copiarNombre.previousElementSibling

                copiarPapeles(nombre.textContent)

            })

        })


        const colorSelected = document.querySelectorAll('.color-paleta')

        // Evento para bloquear colores
        colorSelected.forEach((color, index) => {

            const candadoAbierto = color.querySelector('.icono-abierto')
            const candadoCerrado = color.querySelector('.icono-cerrado')

            candadoAbierto.addEventListener('click', (e) => {
                e.stopPropagation()
                blockColor(tipo, index, color)

            })

            candadoCerrado.addEventListener('click', (e) => {

                e.stopPropagation()
                blockColor(tipo, index, color)

            })

        })

    } else {

        paleta.innerHTML = `
            <h2 class="paleta-titulo">
                Escoge el tipo de los colores y el tamaño
            </h2>
        `

    }

}


// Funcion para Copiar colores
async function copiarPapeles(nombreColor) {

    const mensaje = document.createElement('p')

    try {

        await navigator.clipboard.writeText(nombreColor)

        mensaje.classList.add('mensaje')
        mensaje.textContent = 'Copiado en el portapapeles'

        body.appendChild(mensaje)

        setTimeout(() => {

            mensaje.remove()

        }, 3000)

    } catch (error) {

        console.error('Error al copiar el color', error)

    }

}

//Funcion para bloquerar colores
function blockColor(tipo, index, elemento) {

    if (!coloresBloqueados[tipo]) {
        coloresBloqueados[tipo] = []
    }

    const bloqueado = coloresBloqueados[tipo][index]

    if (bloqueado) {

        delete coloresBloqueados[tipo][index]

    } else {

        coloresBloqueados[tipo][index] = true

    }

    // Seleccionar iconos de candados
    const candadoAbierto = elemento.querySelector('.icono-abierto')
    const candadoCerrado = elemento.querySelector('.icono-cerrado')

  
    if (bloqueado) {

        candadoAbierto.style.display = 'block'
        candadoCerrado.style.display = 'none'

    } else {

        candadoAbierto.style.display = 'none'
        candadoCerrado.style.display = 'block'

    }

    // Agregar o quitar clase
    elemento.classList.toggle('bloqueado', !bloqueado)

    guardarLocalStorage()

}