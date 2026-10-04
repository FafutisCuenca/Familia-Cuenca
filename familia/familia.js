// ============================================================
// DIRECTORIO FAMILIA CUENCA
// ============================================================

let integrantesFamilia = [];


// ============================================================
// INICIALIZAR DIRECTORIO
// ============================================================

async function iniciarDirectorio() {

    try {

        // ----------------------------------------------------
        // CARGAR DATOS
        // ----------------------------------------------------

        integrantesFamilia =
            await FamiliaCuenca.cargar();


        // ----------------------------------------------------
        // MOSTRAR TOTAL
        // ----------------------------------------------------

        mostrarTotal();


        // ====================================================
        // DIRECTORIO NORMAL
        // ====================================================
        //
        // ANTES:
        // Al entrar se mostraban todas las tarjetas
        // de familiares vivos.
        //
        // Se conserva esa opción comentada para poder
        // habilitarla nuevamente en el futuro.
        // ====================================================


        /*
        // ----------------------------------------------------
        // OPCIÓN ANTERIOR
        // MOSTRAR TODAS LAS TARJETAS DE FAMILIARES VIVOS
        // ----------------------------------------------------

        const familiaresVivos =
            integrantesFamilia.filter(
                persona =>
                    persona.estatus === "Vivo"
            );

        mostrarFamilia(
            familiaresVivos
        );

        */


        // ====================================================
        // NUEVA OPCIÓN
        // NO MOSTRAR TARJETAS AL ENTRAR
        //
        // El usuario debe realizar una búsqueda.
        // ====================================================

        mostrarMensajeInicial();


        // ----------------------------------------------------
        // INICIAR BUSCADOR
        // ----------------------------------------------------

        iniciarBuscador();


        // ----------------------------------------------------
        // INICIAR MEMORIA FAMILIAR
        // ----------------------------------------------------

        iniciarMemoriaFamiliar();


        console.log(
            "Directorio Familia Cuenca iniciado correctamente."
        );


    } catch (error) {

        console.error(
            "Error cargando Familia Cuenca:",
            error
        );


        const contenedor =
            document.getElementById(
                "listaFamilia"
            );


        if (contenedor) {

            contenedor.innerHTML = `

                <div class="tarjeta-familiar">

                    <h2>
                        Error cargando la información
                    </h2>

                    <p>
                        No fue posible cargar
                        los datos de la Familia Cuenca.
                    </p>

                </div>

            `;

        }

    }

}


// ============================================================
// MOSTRAR MENSAJE INICIAL
// ============================================================
//
// No se generan tarjetas al entrar.
// Se muestra únicamente una invitación a utilizar
// el buscador.
//
// ============================================================

function mostrarMensajeInicial() {

    const contenedor =
        document.getElementById(
            "listaFamilia"
        );


    if (!contenedor) {

        console.warn(
            "No se encontró #listaFamilia"
        );

        return;

    }


    contenedor.innerHTML = `

        <div class="directorio-mensaje-inicial">

            <div class="directorio-mensaje-icono">
                🔎
            </div>

            <h2>
                Busca un familiar
            </h2>

            <p>
                Escribe un nombre, apellido,
                ciudad o país para comenzar.
            </p>

        </div>

    `;

}


// ============================================================
// MOSTRAR TOTAL
// ============================================================

function mostrarTotal() {

    // --------------------------------------------------------
    // Intentamos encontrar el contador actual
    // --------------------------------------------------------

    const elemento =
        document.getElementById(
            "totalIntegrantes"
        ) ||
        document.getElementById(
            "totalFamiliares"
        );


    if (elemento) {

        elemento.textContent =
            integrantesFamilia.length;

    }

}


// ============================================================
// MOSTRAR FAMILIA
// ============================================================

function mostrarFamilia(lista) {

    const contenedor =
        document.getElementById(
            "listaFamilia"
        );


    if (!contenedor) {

        console.warn(
            "No se encontró #listaFamilia"
        );

        return;

    }


    // --------------------------------------------------------
    // SIN RESULTADOS
    // --------------------------------------------------------

    if (lista.length === 0) {

        contenedor.innerHTML = `

            <div class="tarjeta-familiar">

                <h2>
                    No encontramos familiares
                </h2>

                <p>
                    Intenta con otro nombre
                    o palabra.
                </p>

            </div>

        `;

        return;

    }


    // --------------------------------------------------------
    // ORDEN ALFABÉTICO
    // --------------------------------------------------------

    const listaOrdenada =
        [...lista].sort(
            (a, b) =>
                a.nombre.localeCompare(
                    b.nombre,
                    "es"
                )
        );


    // --------------------------------------------------------
    // GENERAR TARJETAS
    // --------------------------------------------------------

    contenedor.innerHTML =
        listaOrdenada.map(
            persona => {

                const inicial =
                    persona.nombre
                        .charAt(0)
                        .toUpperCase();


                const ubicacion = [

                    persona.ciudad,
                    persona.estado,
                    persona.pais

                ]
                    .filter(Boolean)
                    .join(", ");


                const iconoGenero =
                    persona.genero === "F"
                        ? "👩"
                        : "👨";


                const textoGenero =
                    persona.genero === "F"
                        ? "Femenino"
                        : "Masculino";


                const iconoEstatus =
                    persona.estatus === "Vivo"
                        ? "🟢"
                        : "⚪";


                const foto =
                    persona.foto
                        ? `
                            <img
                                src="${persona.foto}"
                                alt="${persona.nombre}"
                            >
                          `
                        : inicial;


                return `

                    <article
                        class="tarjeta-familiar"
                        onclick="abrirPerfil('${persona.id}')"
                        style="cursor:pointer;"
                    >

                        <div class="avatar">

                            ${foto}

                        </div>


                        <h2>

                            ${persona.nombre}

                        </h2>


                        <div class="dato">

                            🎂

                            <strong>
                                Cumpleaños:
                            </strong>

                            ${formatearFecha(persona.fecha)}

                        </div>


                        <div class="dato">

                            ${iconoGenero}

                            <strong>
                                Género:
                            </strong>

                            ${textoGenero}

                        </div>


                        <div class="dato">

                            🌎

                            <strong>
                                Ubicación:
                            </strong>

                            ${
                                ubicacion ||
                                "Información pendiente"
                            }

                        </div>


                        <div class="dato">

                            ${iconoEstatus}

                            <strong>
                                Estatus:
                            </strong>

                            ${persona.estatus}

                        </div>


                        <span class="id-familiar">

                            ${persona.id}

                        </span>

                    </article>

                `;

            }
        ).join("");

}


// ============================================================
// ABRIR PERFIL
// ============================================================

function abrirPerfil(id) {

    window.location.href =
        `perfil.html?id=${encodeURIComponent(id)}`;

}


// ============================================================
// INICIAR BUSCADOR
// ============================================================

function iniciarBuscador() {

    // --------------------------------------------------------
    // Soportar ambos IDs posibles
    // --------------------------------------------------------

    const buscador =
        document.getElementById("buscador") ||
        document.getElementById("familySearch");


    if (!buscador) {

        console.warn(
            "No se encontró el campo de búsqueda."
        );

        return;

    }


    // --------------------------------------------------------
    // EVENTO INPUT
    // --------------------------------------------------------

    buscador.addEventListener(
        "input",
        function () {

            const texto =
                this.value.trim();


            // ------------------------------------------------
            // SIN TEXTO
            // Regresar al mensaje inicial.
            //
            // Ya NO mostramos todas las tarjetas.
            // ------------------------------------------------

            if (!texto) {

                mostrarMensajeInicial();

                return;

            }


            // ------------------------------------------------
            // BUSCAR
            // ------------------------------------------------

            let resultados =
                FamiliaCuenca.buscarPorNombre(
                    texto
                );


            // ------------------------------------------------
            // EL DIRECTORIO NORMAL NO MUESTRA FINADOS
            // ------------------------------------------------

            resultados =
                resultados.filter(
                    persona =>
                        persona.estatus === "Vivo"
                );


            // ------------------------------------------------
            // MOSTRAR RESULTADOS
            // ------------------------------------------------

            mostrarFamilia(
                resultados
            );

        }
    );


    console.log(
        "Buscador inicializado correctamente."
    );

}


// ============================================================
// MEMORIA FAMILIAR
// ============================================================

function iniciarMemoriaFamiliar() {

    const boton =
        document.getElementById(
            "mostrarFinados"
        );


    const modal =
        document.getElementById(
            "finadosModal"
        );


    const cerrar =
        document.getElementById(
            "finadosModalClose"
        );


    const fondo =
        document.querySelector(
            ".finados-modal-backdrop"
        );


    // --------------------------------------------------------
    // VERIFICAR BOTÓN
    // --------------------------------------------------------

    if (!boton) {

        console.warn(
            "No se encontró el botón #mostrarFinados."
        );

        return;

    }


    // --------------------------------------------------------
    // VERIFICAR MODAL
    // --------------------------------------------------------

    if (!modal) {

        console.error(
            "No se encontró el modal #finadosModal."
        );

        return;

    }


    // --------------------------------------------------------
    // ABRIR MODAL
    // --------------------------------------------------------

    function abrirMemoria() {

        console.log(
            "Abriendo memoria familiar..."
        );


        // Generar la lista cada vez que se abre
        generarListaFinados();


        modal.classList.add(
            "active"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }


    // --------------------------------------------------------
    // CERRAR MODAL
    // --------------------------------------------------------

    function cerrarMemoria() {

        modal.classList.remove(
            "active"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    }


    // --------------------------------------------------------
    // BOTÓN PRINCIPAL
    // --------------------------------------------------------

    boton.addEventListener(
        "click",
        abrirMemoria
    );


    // --------------------------------------------------------
    // BOTÓN X
    // --------------------------------------------------------

    if (cerrar) {

        cerrar.addEventListener(
            "click",
            cerrarMemoria
        );

    }


    // --------------------------------------------------------
    // CLIC EN EL FONDO
    // --------------------------------------------------------

    if (fondo) {

        fondo.addEventListener(
            "click",
            cerrarMemoria
        );

    }


    // --------------------------------------------------------
    // TECLA ESC
    // --------------------------------------------------------

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains(
                    "active"
                )
            ) {

                cerrarMemoria();

            }

        }
    );


    console.log(
        "Memoria familiar inicializada correctamente."
    );

}


// ============================================================
// GENERAR LISTA DE FAMILIARES FINADOS
// ============================================================

function generarListaFinados() {

    const contenedor =
        document.getElementById(
            "listaFinados"
        );


    // --------------------------------------------------------
    // VERIFICAR CONTENEDOR
    // --------------------------------------------------------

    if (!contenedor) {

        console.error(
            "No se encontró #listaFinados."
        );

        return;

    }


    // --------------------------------------------------------
    // FILTRAR FINADOS
    // --------------------------------------------------------

    const finados =
        integrantesFamilia.filter(
            persona =>
                persona.estatus === "Finado"
        );


    console.log(
        "Familiares finados encontrados:",
        finados.length
    );


    // --------------------------------------------------------
    // SI NO EXISTEN
    // --------------------------------------------------------

    if (finados.length === 0) {

        contenedor.innerHTML = `

            <div class="finados-empty">

                <p>
                    Aún no hay familiares registrados
                    en esta sección.
                </p>

            </div>

        `;

        return;

    }


    // --------------------------------------------------------
    // ORDEN ALFABÉTICO
    // --------------------------------------------------------

    const listaOrdenada =
        [...finados].sort(
            (a, b) =>
                a.nombre.localeCompare(
                    b.nombre,
                    "es"
                )
        );


    // --------------------------------------------------------
    // GENERAR TARJETAS
    // --------------------------------------------------------

    contenedor.innerHTML =
        listaOrdenada.map(
            persona => {

                const inicial =
                    persona.nombre
                        .charAt(0)
                        .toUpperCase();


                const ubicacion = [

                    persona.ciudad,
                    persona.estado,
                    persona.pais

                ]
                    .filter(Boolean)
                    .join(", ");


                // ------------------------------------------------
                // FOTO
                // ------------------------------------------------

                const foto =
                    persona.foto
                        ? `
                            <img
                                src="${persona.foto}"
                                alt="${persona.nombre}"
                            >
                          `
                        : inicial;


                // ------------------------------------------------
                // INFORMACIÓN
                // ------------------------------------------------

                const datosPersona = [

                    persona.fecha
                        ? `🎂 ${formatearFecha(persona.fecha)}`
                        : "",

                    ubicacion
                        ? `🌎 ${ubicacion}`
                        : ""

                ]
                    .filter(Boolean)
                    .join(" · ");


                // ------------------------------------------------
                // TARJETA
                // ------------------------------------------------

                return `

                    <article
                        class="finado-card"
                        onclick="abrirPerfil('${persona.id}')"
                        style="cursor:pointer;"
                    >

                        <div class="finado-avatar">

                            ${foto}

                        </div>


                        <div class="finado-info">

                            <h3>
                                ${persona.nombre}
                            </h3>


                            <p>
                                ${datosPersona}
                            </p>


                            <span class="finado-generacion">
                                En nuestra memoria
                            </span>

                        </div>

                    </article>

                `;

            }
        ).join("");

}


// ============================================================
// FORMATEAR FECHA
// Formato original del JSON: DD-MM
// ============================================================

function formatearFecha(fecha) {

    if (!fecha) {

        return "";

    }


    const partes =
        fecha.split("-");


    if (partes.length !== 2) {

        return fecha;

    }


    const dia =
        parseInt(
            partes[0],
            10
        );


    const mes =
        parseInt(
            partes[1],
            10
        );


    const meses = [

        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"

    ];


    if (
        !dia ||
        !mes ||
        !meses[mes - 1]
    ) {

        return fecha;

    }


    return `${dia} de ${meses[mes - 1]}`;

}


// ============================================================
// ARRANCAR
// Esperamos a que todo el HTML esté cargado
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        iniciarDirectorio();

    }
);
