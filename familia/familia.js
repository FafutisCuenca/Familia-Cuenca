// ============================================================
// DIRECTORIO FAMILIA CUENCA
// ============================================================

let integrantesFamilia = [];


// ============================================================
// INICIALIZAR
// ============================================================

async function iniciarDirectorio() {

    try {

        integrantesFamilia =
            await FamiliaCuenca.cargar();

        mostrarTotal();

        // ----------------------------------------------------
        // DIRECTORIO NORMAL
        // Solamente familiares vivos
        // ----------------------------------------------------

        const familiaresVivos =
            integrantesFamilia.filter(
                persona =>
                    persona.estatus === "Vivo"
            );

        mostrarFamilia(
            familiaresVivos
        );


        // ----------------------------------------------------
        // INICIAR MEMORIA FAMILIAR
        // ----------------------------------------------------

        iniciarMemoriaFamiliar();

    } catch (error) {

        document.getElementById(
            "listaFamilia"
        ).innerHTML = `

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

        console.error(error);

    }

}


// ============================================================
// MOSTRAR TOTAL
// ============================================================

function mostrarTotal() {

    const elemento =
        document.getElementById(
            "totalIntegrantes"
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
        return;
    }


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


    const listaOrdenada =
        [...lista].sort(
            (a, b) =>
                a.nombre.localeCompare(
                    b.nombre,
                    "es"
                )
        );


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

                            ${persona.fecha}

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
// BUSCADOR
// ============================================================

const buscador =
    document.getElementById(
        "buscador"
    );


if (buscador) {

    buscador.addEventListener(
        "input",
        function () {

            const texto =
                this.value.trim();


            // ------------------------------------------------
            // SIN TEXTO
            // Regresar a familiares vivos
            // ------------------------------------------------

            if (!texto) {

                const familiaresVivos =
                    integrantesFamilia.filter(
                        persona =>
                            persona.estatus === "Vivo"
                    );

                mostrarFamilia(
                    familiaresVivos
                );

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


            mostrarFamilia(
                resultados
            );

        }
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
    // Verificar elementos
    // --------------------------------------------------------

    if (!boton || !modal) {

        console.warn(
            "No se encontró el modal de memoria familiar."
        );

        return;

    }


    // --------------------------------------------------------
    // ABRIR
    // --------------------------------------------------------

    function abrirMemoria() {

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
    // CERRAR
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
    // EVENTO BOTÓN
    // --------------------------------------------------------

    boton.addEventListener(
        "click",
        abrirMemoria
    );


    // --------------------------------------------------------
    // BOTÓN CERRAR
    // --------------------------------------------------------

    if (cerrar) {

        cerrar.addEventListener(
            "click",
            cerrarMemoria
        );

    }


    // --------------------------------------------------------
    // CERRAR AL HACER CLIC EN EL FONDO
    // --------------------------------------------------------

    if (fondo) {

        fondo.addEventListener(
            "click",
            cerrarMemoria
        );

    }


    // --------------------------------------------------------
    // ESCAPE
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

}


// ============================================================
// GENERAR LISTA DE FAMILIARES FINADOS
// ============================================================

function generarListaFinados() {

    const contenedor =
        document.getElementById(
            "listaFinados"
        );


    if (!contenedor) {
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


                const foto =
                    persona.foto
                        ? `
                            <img
                                src="${persona.foto}"
                                alt="${persona.nombre}"
                            >
                          `
                        : inicial;


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
// ============================================================

iniciarDirectorio();
