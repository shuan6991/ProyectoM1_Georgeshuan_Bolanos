
// Variables
const boton = document.querySelector('.boton-submit')
const form = document.querySelector('.form-main')
const paleta = document.querySelector('.paleta-colores')
const body = document.querySelector('body')

// Recuperar información de localStorage
const datosGuardados = JSON.parse(
    localStorage.getItem('paletasColores')
) || {
    paletas: {},
    bloqueados: {}
}

// Paletas y colores bloqueados
const paletasGuardadas = datosGuardados.paletas
const coloresBloqueados = datosGuardados.bloqueados


// Guardar información en localStorage
function guardarLocalStorage() {

    localStorage.setItem('paletasColores', JSON.stringify({
        paletas: paletasGuardadas,
        bloqueados: coloresBloqueados
    }))

}


// Evento del DOM
document.addEventListener('DOMContentLoaded', () => {

    setInterval(() => {
        boton.style.backgroundColor = generarColorHexa()
    }, 1000)

    datosForm()

    const tipoInicial = form.querySelector('[name="tipo"]').value

    mostrarPaleta(tipoInicial)

})


// Obtener datos del formulario
function datosForm() {

    const selectorTipo = form.querySelector('[name="tipo"]')

    // Cuando cambia el formato, recuperar su paleta
    selectorTipo.addEventListener('change', () => {

        mostrarPaleta(selectorTipo.value)

    })

    form.addEventListener('submit', e => {

        e.preventDefault()

        const data = new FormData(form)

        const tipo = data.get('tipo')
        const cantidad = Number(data.get('cantidad'))

        colorAleatorios(tipo, cantidad)

    })

}


// Generar colores HEXA
function generarColorHexa() {

    const hexa = "0123456789ABCDEF"

    let color = "#"

    for (let i = 0; i < 6; i++) {

        color += hexa[Math.floor(Math.random() * 16)]

    }

    return color

}


// Generar colores RGB
function generarColoresRGB() {

    let rgb = ''

    for (let i = 0; i < 3; i++) {

        rgb += Math.floor(Math.random() * 256) + ','

    }

    return rgb.slice(0, -1)

}


// Generar colores HSL
function generarColoresHSL() {

    let h = Math.floor(Math.random() * 360)
    let s = Math.floor(Math.random() * 100)
    let l = Math.floor(Math.random() * 100)

    return `${h}, ${s}%, ${l}%`

}


// Generar colores según el formato y la cantidad
function colorAleatorios(tipo, cantidad) {

    const colores = []

    // Recuperar colores anteriores de ese formato
    const coloresAnteriores = paletasGuardadas[tipo] || []

    // Recuperar colores bloqueados de ese formato
    const bloqueados = coloresBloqueados[tipo] || []

    for (let i = 0; i < cantidad; i++) {

        // Si el color está bloqueado, conservarlo
        if (bloqueados[i] && coloresAnteriores[i]) {

            colores.push(coloresAnteriores[i])

        } else {

            // Generar un nuevo color
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
function mostrarPaleta(tipo) {

    if (paletasGuardadas[tipo] && paletasGuardadas[tipo].length) {

        insersionHtml(paletasGuardadas[tipo], tipo)

    } else {

        const cantidad = Number(
            form.querySelector('[name="cantidad"]').value
        ) || 6

        colorAleatorios(tipo, cantidad)

    }

}


// Insertar los colores en el HTML
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
                            />

                            <img
                                class="icono-cerrado"
                                src="img/candado-cerrado.png"
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


        // Evento para bloquear colores
        const colorSelected = document.querySelectorAll('.color-paleta')

        colorSelected.forEach((color, index) => {

            color.addEventListener('click', () => {

                blockColor(colores, tipo, index, color)

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


// Copiar colores
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


// Bloquear y desbloquear colores
function blockColor(tipo, index, color) {

    // Crear arreglo si todavía no existe
    if (!coloresBloqueados[tipo]) {

        coloresBloqueados[tipo] = []

    }

    if (coloresBloqueados[tipo][index]) {

        delete coloresBloqueados[tipo][index]

        color.classList.remove('bloqueado')

    } else {

        coloresBloqueados[tipo][index] = true

        color.classList.add('bloqueado')

    }

    guardarLocalStorage()

}
