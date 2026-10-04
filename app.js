/* ============================================================
   FAMILIA CUENCA
   app.js
============================================================ */


/* ============================================================
   VARIABLES
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


/* ============================================================
   INICIO
============================================================ */

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


/* ============================================================
   CARGAR FAMILIA
============================================================ */

async function cargarFamilia() {

    try {

        const respuesta =
            await fetch("familia.json");

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar familia.json"
            );

        }

        familia = await respuesta.json();

        prepararFiltros();

        actualizarEstadisticas();

        mostrarResultados(familia);

        mostrarCumpleanos();

        actualizarTablero();

    }

    catch (error) {

        console.error(error);

        searchResults.innerHTML = `
            <div class="no-results">
                No fue posible cargar la información familiar.
            </div>
        `;

    }

}


/* ============================================================
   MENÚ
============================================================ */

function configurarMenu() {

    const menuToggle =
        document.getElementById("menuToggle");

    const navigation =
        document.getElementById("navigation");


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


/* ============================================================
   EVENTOS
============================================================ */

function configurarEventos() {

    searchInput.addEventListener(
        "input",
        ejecutarBusqueda
    );


    countryFilter.addEventListener(
        "change",
        ejecutarBusqueda
    );


    genderFilter.addEventListener(
        "change",
        ejecutarBusqueda
    );


    generationFilter.addEventListener(
        "change",
        ejecutarBusqueda
    );


    document
        .getElementById("clearSearch")
        .addEventListener(
            "click",
            () => {

                searchInput.value = "";

                countryFilter.value = "";

                genderFilter.value = "";

                generationFilter.value = "";

                mostrarResultados(familia);

            }
        );


    document
        .getElementById("modalClose")
        .addEventListener(
            "click",
            cerrarModal
        );


    document
        .querySelector(".modal-backdrop")
        .addEventListener(
            "click",
            cerrarModal
        );

}


/* ============================================================
   FILTROS
============================================================ */

function prepararFiltros() {

    const paises =
        [...new Set(
            familia
                .map(persona => persona.pais)
                .filter(Boolean)
        )]
        .sort();


    paises.forEach(pais => {

        const option =
            document.createElement("option");

        option.value = pais;

        option.textContent = pais;

        countryFilter.appendChild(option);

    });


    const generaciones =
        [...new Set(
            familia
                .map(persona => persona.generacion)
                .filter(Boolean)
        )]
        .sort((a, b) => a - b);


    generaciones.forEach(generacion => {

        const option =
            document.createElement("option");

        option.value = generacion;

        option.textContent =
            `Generación ${generacion}`;

        generationFilter.appendChild(option);

    });

}


/* ============================================================
   BÚSQUEDA
============================================================ */

function ejecutarBusqueda() {

    const texto =
        searchInput.value
            .trim()
            .toLowerCase();


    const pais =
        countryFilter.value;


    const genero =
        genderFilter.value;


    const generacion =
        generationFilter.value;


    const resultados =
        familia.filter(persona => {

            const textoCompleto = [

                persona.nombre,
                persona.pais,
                persona.estado,
                persona.ciudad

            ]
            .join(" ")
            .toLowerCase();


            const coincideTexto =
                !texto ||
                textoCompleto.includes(texto);


            const coincidePais =
                !pais ||
                persona.pais === pais;


            const coincideGenero =
                !genero ||
                persona.genero === genero;


            const coincideGeneracion =
                !generacion ||
                String(persona.generacion) === generacion;


            return (
                coincideTexto &&
                coincidePais &&
                coincideGenero &&
                coincideGeneracion
            );

        });


    mostrarResultados(resultados);

}


/* ============================================================
   MOSTRAR RESULTADOS
============================================================ */

function mostrarResultados(resultados) {

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
            .map(persona => crearTarjetaFamilia(persona))
            .join("");


    document
        .querySelectorAll(".family-result")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const id =
                        card.dataset.id;

                    const persona =
                        familia.find(
                            p => p.id === id
                        );

                    if (persona) {

                        abrirPerfil(persona);

                    }

                }
            );

        });

}


/* ============================================================
   TARJETA FAMILIAR
============================================================ */

function crearTarjetaFamilia(persona) {

    const inicial =
        obtenerIniciales(persona.nombre);


    const ubicacion =
        [persona.ciudad, persona.pais]
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
                ${ubicacion || "Ubicación no registrada"}
            </p>

        </article>

    `;

}


/* ============================================================
   INICIALES
============================================================ */

function obtenerIniciales(nombre) {

    const palabras =
        nombre
            .trim()
            .split(" ")
            .filter(Boolean);


    if (palabras.length === 1) {

        return palabras[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        palabras[0][0] +
        palabras[1][0]
    ).toUpperCase();

}


/* ============================================================
   PERFIL
============================================================ */

function abrirPerfil(persona) {

    const modal =
        document.getElementById("familyModal");

    const contenido =
        document.getElementById(
            "familyModalContent"
        );


    const inicial =
        obtenerIniciales(persona.nombre);


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
                ${ubicacion || "Ubicación no registrada"}
            </p>


            <div class="profile-data">

                <div>

                    <span>
                        Cumpleaños
                    </span>

                    <strong>
                        ${
                            persona.fecha
                            || "No registrado"
                        }
                    </strong>

                </div>


                <div>

                    <span>
                        Generación
                    </span>

                    <strong>
                        ${
                            persona.generacion
                            ? `Generación ${persona.generacion}`
                            : "No registrada"
                        }
                    </strong>

                </div>


                <div>

                    <span>
                        País
                    </span>

                    <strong>
                        ${
                            persona.pais
                            || "No registrado"
                        }
                    </strong>

                </div>


                <div>

                    <span>
                        Ciudad
                    </span>

                    <strong>
                        ${
                            persona.ciudad
                            || "No registrada"
                        }
                    </strong>

                </div>


                <div>

                    <span>
                        Estatus
                    </span>

                    <strong>
                        ${
                            persona.estatus
                            || "No registrado"
                        }
                    </strong>

                </div>


                <div>

                    <span>
                        Último evento
                    </span>

                    <strong>
                        ${
                            persona.ultimoEvento
                            || "No registrado"
                        }
                    </strong>

                </div>

            </div>

        </div>

    `;


    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* ============================================================
   CERRAR MODAL
============================================================ */

function cerrarModal() {

    const modal =
        document.getElementById("familyModal");

    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* ============================================================
   ESTADÍSTICAS
============================================================ */

function actualizarEstadisticas() {

    const total =
        familia.length;


    const paises =
        new Set(
            familia
                .map(p => p.pais)
                .filter(Boolean)
        );


    const ciudades =
        new Set(
            familia
                .map(p => p.ciudad)
                .filter(Boolean)
        );


    const generaciones =
        new Set(
            familia
                .map(p => p.generacion)
                .filter(Boolean)
        );


    animarNumero(
        "totalFamiliares",
        total
    );


    animarNumero(
        "totalPaises",
        paises.size
    );


    animarNumero(
        "totalCiudades",
        ciudades.size
    );


    animarNumero(
        "totalGeneraciones",
        generaciones.size
    );


    const countriesBoard =
        document.getElementById(
            "countriesBoard"
        );


    countriesBoard.textContent =
        `${paises.size} países registrados`;

}


/* ============================================================
   ANIMACIÓN NÚMEROS
============================================================ */

function animarNumero(id, objetivo) {

    const elemento =
        document.getElementById(id);

    if (!elemento) return;


    let actual = 0;

    const incremento =
        Math.max(
            1,
            Math.ceil(objetivo / 20)
        );


    const intervalo =
        setInterval(() => {

            actual += incremento;


            if (actual >= objetivo) {

                actual = objetivo;

                clearInterval(intervalo);

            }


            elemento.textContent =
                actual;

        }, 35);

}


/* ============================================================
   CUMPLEAÑOS
============================================================ */

function mostrarCumpleanos() {

    if (!birthdayList) return;


    const personasConCumple =
        familia.filter(
            persona => persona.fecha
        );


    const ordenados =
        ordenarCumpleanos(
            personasConCumple
        );


    const proximos =
        ordenados.slice(0, 4);


    birthdayList.innerHTML =
        proximos
            .map(persona =>
                crearTarjetaCumpleanos(persona)
            )
            .join("");


}


/* ============================================================
   ORDENAR CUMPLEAÑOS
============================================================ */

function ordenarCumpleanos(lista) {

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


            return
                calcularDistanciaCalendario(
                    fechaA,
                    hoy
                )
                -
                calcularDistanciaCalendario(
                    fechaB,
                    hoy
                );

        }
    );

}


/* ============================================================
   CONVERTIR FECHA
============================================================ */

function convertirFechaCumple(
    fecha,
    ano
) {

    const partes =
        fecha.split("-");


    const mes =
        parseInt(partes[0], 10) - 1;


    const dia =
        parseInt(partes[1], 10);


    return new Date(
        ano,
        mes,
        dia
    );

}


/* ============================================================
   DISTANCIA CALENDARIO
============================================================ */

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


/* ============================================================
   TARJETA CUMPLEAÑOS
============================================================ */

function crearTarjetaCumpleanos(persona) {

    const partes =
        persona.fecha.split("-");


    const mes =
        obtenerNombreMes(
            parseInt(partes[0], 10)
        );


    const dia =
        parseInt(partes[1], 10);


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


/* ============================================================
   NOMBRE MES
============================================================ */

function obtenerNombreMes(numero) {

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


    return meses[numero - 1];

}


/* ============================================================
   TABLERO
============================================================ */

function actualizarTablero() {

    const ordenados =
        ordenarCumpleanos(
            familia.filter(
                p => p.fecha
            )
        );


    const siguiente =
        ordenados[0];


    if (!siguiente) return;


    const nombre =
        document.getElementById(
            "nextBirthdayName"
        );


    const fecha =
        document.getElementById(
            "nextBirthdayDate"
        );


    nombre.textContent =
        siguiente.nombre;


    const partes =
        siguiente.fecha.split("-");


    fecha.textContent =
        `${partes[1]} de ${
            obtenerNombreMes(
                parseInt(partes[0], 10)
            )
        }`;

}


/* ============================================================
   AÑO FOOTER
============================================================ */

function actualizarAnio() {

    const elemento =
        document.getElementById(
            "currentYear"
        );


    elemento.textContent =
        new Date().getFullYear();

}
