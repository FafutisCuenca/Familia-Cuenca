/* ============================================================
   FAMILIA CUENCA
   app.js
   Portal principal
   Fuente de datos: /data/familia.json
   Motor: /js/familia-data.js
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

        /*
         * IMPORTANTE:
         * Ya no cargamos familia.json directamente.
         *
         * Utilizamos el motor central FamiliaCuenca.
         */

        familia =
            await FamiliaCuenca.cargar();


        prepararFiltros();

        actualizarEstadisticas();

        mostrarResultados(familia);

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

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            ejecutarBusqueda
        );

    }


    if (countryFilter) {

        countryFilter.addEventListener(
            "change",
            ejecutarBusqueda
        );

    }


    if (genderFilter) {

        genderFilter.addEventListener(
            "change",
            ejecutarBusqueda
        );

    }


    /*
     * Por ahora el filtro de generaciones
     * no se utiliza porque el JSON maestro
     * todavía no contiene el campo "generacion".
     */

    if (generationFilter) {

        generationFilter.addEventListener(
            "change",
            ejecutarBusqueda
        );

    }


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

                mostrarResultados(familia);

            }
        );

    }


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


    /*
     * PAÍSES
     */

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


    /*
     * GENERACIONES
     *
     * Actualmente no se generan opciones
     * porque "generacion" no existe todavía
     * en familia.json.
     */

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


    /*
     * GENERACIÓN
     *
     * Se conserva la lectura del control,
     * pero no se aplica porque actualmente
     * no existe ese dato en el JSON.
     */

    const generacion =
        generationFilter
            ? generationFilter.value
            : "";


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


                /*
                 * Solo aplicar generación
                 * si algún día existe ese campo.
                 */

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
                            persona.fecha ||
                            "No registrado"
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


    /*
     * Las generaciones todavía no existen
     * en el archivo maestro.
     *
     * Mostramos 0 temporalmente.
     */

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

        elemento.textContent = "0";

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
// CONVERTIR FECHA
// ============================================================

function convertirFechaCumple(
    fecha,
    ano
) {

    const partes =
        fecha.split("-");

    // El formato maestro de familia.json es DD-MM
    const dia =
        parseInt(
            partes[0],
            10
        );

    const mes =
        parseInt(
            partes[1],
            10
        ) - 1;

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

function crearTarjetaCumpleanos(
    persona
) {

    const partes =
        persona.fecha.split("-");


    const mes =
        obtenerNombreMes(
            parseInt(
                partes[0],
                10
            )
        );


    const dia =
        parseInt(
            partes[1],
            10
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


    const partes =
        siguiente.fecha.split("-");


    fecha.textContent =
        `${partes[1]} de ${
            obtenerNombreMes(
                parseInt(
                    partes[0],
                    10
                )
            )
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
