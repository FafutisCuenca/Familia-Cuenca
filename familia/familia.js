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
        // Por defecto solamente mostramos familiares vivos
        // ----------------------------------------------------

        const familiaresVivos =
            integrantesFamilia.filter(
                persona => persona.estatus === "Vivo"
            );

        mostrarFamilia(
            familiaresVivos
        );

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

    document.getElementById(
        "totalIntegrantes"
    ).textContent =
        integrantesFamilia.length;

}


// ============================================================
// MOSTRAR FAMILIA
// ============================================================

function mostrarFamilia(lista) {

    const contenedor =
        document.getElementById(
            "listaFamilia"
        );


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

document
    .getElementById("buscador")
    .addEventListener(
        "input",
        function () {

            const texto =
                this.value.trim();


            // ------------------------------------------------
            // Si no hay texto, regresamos a los familiares vivos
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
            // Buscamos normalmente
            // ------------------------------------------------

            let resultados =
                FamiliaCuenca.buscarPorNombre(
                    texto
                );


            // ------------------------------------------------
            // IMPORTANTE:
            // El directorio normal nunca muestra finados
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


// ============================================================
// ARRANCAR
// ============================================================

iniciarDirectorio();
