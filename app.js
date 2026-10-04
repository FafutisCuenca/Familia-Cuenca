/* ============================================================
   FAMILIA CUENCA
   app.js
   Portal principal
   Fuente de datos: /data/familia.json
   Motor: /js/familia-data.js

   FORMATO DE FECHAS DEL JSON:
   DD-MM

   Ejemplo:
   04-01 = 4 de enero
   11-10 = 11 de octubre
   25-12 = 25 de diciembre
============================================================ */

let familia = [];

const searchInput =
    document.getElementById("familySearch");

const countryFilter =
    document.getElementById("countryFilter");

const genderFilter =
    document.getElementById("genderFilter");

const generationFilter =
    document.getElementById("generationFilter");

const searchResults =
    document.getElementById("searchResults");

const birthdayList =
    document.getElementById("birthdayList");


// ============================================================
// INICIO DEL PORTAL
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarPortal
);


async function iniciarPortal() {

    configurarMenu();

    configurarEventos();

    actualizarAnio();

    await cargarFamilia();

}


// ============================================================
// CARGAR FAMILIA
// ============================================================

async function cargarFamilia() {

    try {

        familia =
            await FamiliaCuenca.cargar();


        prepararFiltros();

        actualizarEstadisticas();


        /*
        ========================================================
        OPCIÓN ANTERIOR — MOSTRAR TODA LA FAMILIA
        ========================================================

        Esta opción se conserva comentada.

        Si en algún momento queremos volver a mostrar
        automáticamente todas las tarjetas al entrar al portal,
        basta con quitar los comentarios de la siguiente línea:

        mostrarResultados(familia);

        ========================================================
        NUEVA OPCIÓN
        ========================================================

        La página inicia sin mostrar todas las tarjetas.

        El usuario deberá buscar un familiar o utilizar
        alguno de los filtros para obtener resultados.
        */

        mostrarMensajeInicial();


        mostrarCumpleanos();

        actualizarTablero();


    } catch (error) {

        console.error(
            "Error cargando la Familia Cuenca:",
            error
        );


        if (searchResults) {

            searchResults.innerHTML = `
                <div class="no-results">
                    No fue posible cargar
                    la información familiar.
                </div>
            `;

        }

    }

}


// ============================================================
// MENÚ
// ============================================================

function configurarMenu() {

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );

    const navigation =
        document.getElementById(
            "navigation"
        );


    if (!menuToggle || !navigation) {
        return;
    }


    menuToggle.addEventListener(
        "click",
        () => {

            navigation.classList.toggle(
                "active"
            );

        }
    );


    navigation
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navigation.classList.remove(
                        "active"
                    );

                }
            );

        });

}


// ============================================================
// EVENTOS DEL PORTAL
// ============================================================

function configurarEventos() {

    // --------------------------------------------------------
    // BÚSQUEDA
    // --------------------------------------------------------

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            ejecutarBusqueda
        );

    }


    // --------------------------------------------------------
    // FILTRO PAÍS
    // --------------------------------------------------------

    if (countryFilter) {

        countryFilter.addEventListener(
            "change",
            ejecutarBusqueda
        );

    }


    // --------------------------------------------------------
    // FILTRO GÉNERO
    // --------------------------------------------------------

    if (genderFilter) {

        genderFilter.addEventListener(
            "change",
            ejecutarBusqueda
        );

    }


    // --------------------------------------------------------
    // FILTRO GENERACIÓN
    // --------------------------------------------------------

    if (generationFilter) {

        generationFilter.addEventListener(
            "change",
            ejecutarBusqueda
        );

    }


    // --------------------------------------------------------
    // LIMPIAR BÚSQUEDA
    // --------------------------------------------------------

    const clearSearch =
        document.getElementById(
            "clearSearch"
        );


    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            () => {

                if (searchInput) {
                    searchInput.value = "";
                }

                if (countryFilter) {
                    countryFilter.value = "";
                }

                if (genderFilter) {
                    genderFilter.value = "";
                }

                if (generationFilter) {
                    generationFilter.value = "";
                }


                /*
                Antes:
                
                mostrarResultados(familia);

                Ahora regresamos al estado inicial
                sin mostrar todas las tarjetas.
                */

                mostrarMensajeInicial();

            }
        );

    }


    // --------------------------------------------------------
    // CERRAR PERFIL
    // --------------------------------------------------------

    const modalClose =
        document.getElementById(
            "modalClose"
        );


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            cerrarModal
        );

    }


    // --------------------------------------------------------
    // CERRAR PERFIL AL HACER CLICK EN EL FONDO
    // --------------------------------------------------------

    const modalBackdrop =
        document.querySelector(
            ".modal-backdrop"
        );


    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            cerrarModal
        );

    }

}


// ============================================================
// FILTROS
// ============================================================

function prepararFiltros() {

    if (!countryFilter) {
        return;
    }


    // --------------------------------------------------------
    // PAÍSES
    // --------------------------------------------------------

    const paises =
        FamiliaCuenca.paises();


    paises.forEach(
        pais => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                pais;

            option.textContent =
                pais;

            countryFilter.appendChild(
                option
            );

        }
    );


    // --------------------------------------------------------
    // GENERACIONES
    // --------------------------------------------------------
    //
    // Actualmente no existe el campo
    // "generacion" en familia.json.
    //
    // Se conserva preparado para una futura versión.
    // --------------------------------------------------------

    if (generationFilter) {

        generationFilter.innerHTML = `
            <option value="">
                Todas las generaciones
            </option>
        `;

    }

}


// ============================================================
// BÚSQUEDA
// ============================================================

function ejecutarBusqueda() {

    const texto =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const pais =
        countryFilter
            ? countryFilter.value
            : "";


    const genero =
        genderFilter
            ? genderFilter.value
            : "";


    const generacion =
        generationFilter
            ? generationFilter.value
            : "";


    /*
    ============================================================
    SI NO HAY NINGÚN CRITERIO
    ============================================================

    No mostramos todas las tarjetas.

    Regresamos al mensaje inicial.
    */

    if (
        !texto &&
        !pais &&
        !genero &&
        !generacion
    ) {

        mostrarMensajeInicial();

        return;

    }


    const resultados =
        familia.filter(
            persona => {

                const textoCompleto = [

                    persona.nombre,

                    persona.pais,

                    persona.estado,

                    persona.ciudad

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                const coincideTexto =
                    !texto ||
                    textoCompleto.includes(
                        texto
                    );


                const coincidePais =
                    !pais ||
                    persona.pais === pais;


                const coincideGenero =
                    !genero ||
                    persona.genero === genero;


                const coincideGeneracion =
                    !generacion ||
                    !persona.generacion ||
                    String(
                        persona.generacion
                    ) === generacion;


                return (

                    coincideTexto &&

                    coincidePais &&

                    coincideGenero &&

                    coincideGeneracion

                );

            }
        );


    mostrarResultados(
        resultados
    );

}


// ============================================================
// MENSAJE INICIAL DEL DIRECTORIO
// ============================================================
//
// La página principal NO muestra todas las tarjetas
// al cargar.
//
// Las tarjetas aparecen solamente cuando el usuario
// realiza una búsqueda o utiliza un filtro.
//
// ============================================================

function mostrarMensajeInicial() {

    if (!searchResults) {
        return;
    }


    searchResults.innerHTML = `

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
// MOSTRAR RESULTADOS
// ============================================================

function mostrarResultados(
    resultados
) {

    if (!searchResults) {
        return;
    }


    if (!resultados.length) {

        searchResults.innerHTML = `

            <div class="no-results">

                No encontramos familiares
                con esos criterios.

                <br><br>

                Intenta con otro nombre,
                ciudad o país.

            </div>

        `;

        return;

    }


    searchResults.innerHTML =
        resultados
            .map(
                persona =>
                    crearTarjetaFamilia(
                        persona
                    )
            )
            .join("");


    document
        .querySelectorAll(
            ".family-result"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        const id =
                            card.dataset.id;


                        const persona =
                            familia.find(
                                p =>
                                    p.id === id
                            );


                        if (persona) {

                            abrirPerfil(
                                persona
                            );

                        }

                    }
                );

            }
        );

}


// ============================================================
// TARJETA DE FAMILIAR
// ============================================================

function crearTarjetaFamilia(
    persona
) {

    const inicial =
        obtenerIniciales(
            persona.nombre
        );


    const ubicacion =
        [
            persona.ciudad,
            persona.pais
        ]
            .filter(Boolean)
            .join(", ");


    return `

        <article
            class="family-result"
            data-id="${persona.id}"
        >

            <div class="family-avatar">

                ${inicial}

            </div>


            <h3>

                ${persona.nombre}

            </h3>


            <p>

                ${
                    ubicacion ||
                    "Ubicación no registrada"
                }

            </p>

        </article>

    `;

}


// ============================================================
// INICIALES
// ============================================================

function obtenerIniciales(
    nombre
) {

    const palabras =
        nombre
            .trim()
            .split(" ")
            .filter(Boolean);


    if (
        palabras.length === 0
    ) {

        return "?";

    }


    if (
        palabras.length === 1
    ) {

        return palabras[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (

        palabras[0][0] +

        palabras[1][0]

    ).toUpperCase();

}


// ============================================================
// PERFIL EN POP-UP
// ============================================================

function abrirPerfil(
    persona
) {

    const modal =
        document.getElementById(
            "familyModal"
        );


    const contenido =
        document.getElementById(
            "familyModalContent"
        );


    if (!modal || !contenido) {
        return;
    }


    const inicial =
        obtenerIniciales(
            persona.nombre
        );


    const ubicacion =
        [
            persona.ciudad,
            persona.estado,
            persona.pais
        ]
            .filter(Boolean)
            .join(", ");


    contenido.innerHTML = `

        <div class="modal-profile">

            <div class="modal-avatar">

                ${inicial}

            </div>


            <h2>

                ${persona.nombre}

            </h2>


            <p class="profile-location">

                ${
                    ubicacion ||
                    "Ubicación no registrada"
                }

            </p>


            <div class="profile-data">

                <div>

                    <span>
                        Cumpleaños
                    </span>

                    <strong>
                        ${
                            persona.fecha
                                ? formatearCumpleanos(
                                    persona.fecha
                                  )
                                : "No registrado"
                        }
                    </strong>

                </div>


                <div>

                    <span>
                        País
                    </span>

                    <strong>
                        ${
                            persona.pais ||
                            "No registrado"
                        }
                    </strong>

                </div>


                <div>

                    <span>
                        Estado
                    </span>

                    <strong>
                        ${
                            persona.estado ||
                            "No registrado"
                        }
                    </strong>

                </div>


                <div>

                    <span>
                        Ciudad
                    </span>

                    <strong>
                        ${
                            persona.ciudad ||
                            "No registrada"
                        }
                    </strong>

                </div>


                <div>

                    <span>
                        Género
                    </span>

                    <strong>
                        ${
                            persona.genero === "F"
                                ? "Femenino"
                                : persona.genero === "M"
                                    ? "Masculino"
                                    : "No registrado"
                        }
                    </strong>

                </div>


                <div>

                    <span>
                        Estatus
                    </span>

                    <strong>
                        ${
                            persona.estatus ||
                            "No registrado"
                        }
                    </strong>

                </div>


            </div>

        </div>

    `;


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


// ============================================================
// CERRAR POP-UP
// ============================================================

function cerrarModal() {

    const modal =
        document.getElementById(
            "familyModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


// ============================================================
// ESTADÍSTICAS DEL PORTAL
// ============================================================

function actualizarEstadisticas() {

    const estadisticas =
        FamiliaCuenca.estadisticas();


    animarNumero(
        "totalFamiliares",
        estadisticas.total
    );


    animarNumero(
        "totalPaises",
        estadisticas.paises.length
    );


    animarNumero(
        "totalCiudades",
        estadisticas.ciudades.length
    );


    // --------------------------------------------------------
    // GENERACIONES
    // --------------------------------------------------------
    //
    // Todavía no existe este campo en el JSON.
    // --------------------------------------------------------

    animarNumero(
        "totalGeneraciones",
        0
    );


    const countriesBoard =
        document.getElementById(
            "countriesBoard"
        );


    if (countriesBoard) {

        countriesBoard.textContent =
            `${estadisticas.paises.length} países registrados`;

    }

}


// ============================================================
// ANIMACIÓN DE NÚMEROS
// ============================================================

function animarNumero(
    id,
    objetivo
) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {
        return;
    }


    let actual = 0;


    if (objetivo === 0) {

        elemento.textContent =
            "0";

        return;

    }


    const incremento =
        Math.max(
            1,
            Math.ceil(
                objetivo / 20
            )
        );


    const intervalo =
        setInterval(
            () => {

                actual += incremento;


                if (
                    actual >= objetivo
                ) {

                    actual =
                        objetivo;

                    clearInterval(
                        intervalo
                    );

                }


                elemento.textContent =
                    actual;

            },
            35
        );

}


// ============================================================
// CUMPLEAÑOS
// ============================================================

function mostrarCumpleanos() {

    if (!birthdayList) {
        return;
    }


    const personasConCumple =
        familia.filter(
            persona =>
                persona.fecha
        );


    const ordenados =
        ordenarCumpleanos(
            personasConCumple
        );


    const proximos =
        ordenados.slice(
            0,
            4
        );


    birthdayList.innerHTML =
        proximos
            .map(
                persona =>
                    crearTarjetaCumpleanos(
                        persona
                    )
            )
            .join("");

}


// ============================================================
// ORDENAR CUMPLEAÑOS
// ============================================================

function ordenarCumpleanos(
    lista
) {

    const hoy =
        new Date();


    const ano =
        hoy.getFullYear();


    return [...lista].sort(
        (a, b) => {

            const fechaA =
                convertirFechaCumple(
                    a.fecha,
                    ano
                );


            const fechaB =
                convertirFechaCumple(
                    b.fecha,
                    ano
                );


            return (
                calcularDistanciaCalendario(
                    fechaA,
                    hoy
                )
                -
                calcularDistanciaCalendario(
                    fechaB,
                    hoy
                )
            );

        }
    );

}


// ============================================================
// CONVERTIR CUMPLEAÑOS A FECHA
// ============================================================
//
// IMPORTANTE:
//
// familia.json utiliza:
// DD-MM
//
// Ejemplos:
//
// 04-01 → 4 de enero
// 19-07 → 19 de julio
// 04-09 → 4 de septiembre
// 11-10 → 11 de octubre
// 25-12 → 25 de diciembre
//
// JavaScript utiliza:
// new Date(año, MES, DÍA)
//
// Por eso el mes lleva -1.
// ============================================================

function convertirFechaCumple(
    fecha,
    ano
) {

    if (!fecha) {
        return null;
    }


    const partes =
        fecha.split("-");


    if (partes.length !== 2) {
        return null;
    }


    // DD
    const dia =
        parseInt(
            partes[0],
            10
        );


    // MM
    const mes =
        parseInt(
            partes[1],
            10
        ) - 1;


    if (
        isNaN(dia) ||
        isNaN(mes)
    ) {

        return null;

    }


    return new Date(
        ano,
        mes,
        dia
    );

}


// ============================================================
// DISTANCIA AL PRÓXIMO CUMPLEAÑOS
// ============================================================

function calcularDistanciaCalendario(
    fecha,
    hoy
) {

    if (!fecha) {
        return Infinity;
    }


    const inicio =
        new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            hoy.getDate()
        );


    if (fecha < inicio) {

        fecha.setFullYear(
            fecha.getFullYear() + 1
        );

    }


    return fecha - inicio;

}


// ============================================================
// TARJETA DE CUMPLEAÑOS
// ============================================================
//
// IMPORTANTE:
//
// El JSON es DD-MM.
//
// Por lo tanto:
//
// partes[0] = DÍA
// partes[1] = MES
//
// ============================================================

function crearTarjetaCumpleanos(
    persona
) {

    if (!persona.fecha) {
        return "";
    }


    const partes =
        persona.fecha.split("-");


    if (partes.length !== 2) {
        return "";
    }


    // DD
    const dia =
        parseInt(
            partes[0],
            10
        );


    // MM
    const mesNumero =
        parseInt(
            partes[1],
            10
        );


    const mes =
        obtenerNombreMes(
            mesNumero
        );


    return `

        <article class="birthday-card-item">

            <div class="birthday-day">

                ${dia}

            </div>


            <div class="birthday-month">

                ${mes}

            </div>


            <div class="birthday-name">

                ${persona.nombre}

            </div>


            <div class="birthday-location">

                ${persona.pais || ""}

            </div>

        </article>

    `;

}


// ============================================================
// FORMATEAR CUMPLEAÑOS PARA MOSTRAR AL USUARIO
// ============================================================
//
// Recibe:
//
// DD-MM
//
// Devuelve:
//
// 4 de Enero
//
// Ejemplo:
//
// "04-01" → "4 de Enero"
// "11-10" → "11 de Octubre"
// ============================================================

function formatearCumpleanos(
    fecha
) {

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


    const nombreMes =
        obtenerNombreMes(
            mes
        );


    if (
        !dia ||
        !nombreMes
    ) {

        return fecha;

    }


    return `${dia} de ${nombreMes}`;

}


// ============================================================
// NOMBRE DEL MES
// ============================================================

function obtenerNombreMes(
    numero
) {

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
        numero < 1 ||
        numero > 12
    ) {

        return "";

    }


    return meses[
        numero - 1
    ];

}


// ============================================================
// PRÓXIMO CUMPLEAÑOS DEL TABLERO
// ============================================================

function actualizarTablero() {

    const ordenados =
        ordenarCumpleanos(
            familia.filter(
                persona =>
                    persona.fecha
            )
        );


    const siguiente =
        ordenados[0];


    if (!siguiente) {
        return;
    }


    const nombre =
        document.getElementById(
            "nextBirthdayName"
        );


    const fecha =
        document.getElementById(
            "nextBirthdayDate"
        );


    if (!nombre || !fecha) {
        return;
    }


    nombre.textContent =
        siguiente.nombre;


    // --------------------------------------------------------
    // FORMATO DD-MM
    // --------------------------------------------------------

    const partes =
        siguiente.fecha.split("-");


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


    fecha.textContent =
        `${dia} de ${
            obtenerNombreMes(mes)
        }`;

}


// ============================================================
// AÑO ACTUAL
// ============================================================

function actualizarAnio() {

    const elemento =
        document.getElementById(
            "currentYear"
        );


    if (!elemento) {
        return;
    }


    elemento.textContent =
        new Date().getFullYear();

}


// ============================================================
// POPUP DEL ESCUDO DE LA FAMILIA CUENCA
// ============================================================

function iniciarPopupEscudo() {

    const trigger =
        document.getElementById(
            "escudoTrigger"
        );


    const modal =
        document.getElementById(
            "escudoModal"
        );


    const cerrar =
        document.getElementById(
            "escudoModalClose"
        );


    const fondo =
        document.querySelector(
            ".escudo-modal-backdrop"
        );


    // --------------------------------------------------------
    // VALIDACIÓN
    // --------------------------------------------------------

    if (!trigger || !modal) {
        return;
    }


    // ========================================================
    // ABRIR
    // ========================================================

    function abrirEscudo() {

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


    // ========================================================
    // CERRAR
    // ========================================================

    function cerrarEscudo() {

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


    // ========================================================
    // EVENTOS
    // ========================================================

    trigger.addEventListener(
        "click",
        abrirEscudo
    );


    if (cerrar) {

        cerrar.addEventListener(
            "click",
            cerrarEscudo
        );

    }


    if (fondo) {

        fondo.addEventListener(
            "click",
            cerrarEscudo
        );

    }


    // ========================================================
    // ESCAPE
    // ========================================================

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                cerrarEscudo();

            }

        }
    );

}


// ============================================================
// INICIAR POPUP DEL ESCUDO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarPopupEscudo
);
