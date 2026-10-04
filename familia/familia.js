// ============================================================
// DIRECTORIO FAMILIA CUENCA
// ============================================================


let integrantesFamilia = [];


// ============================================================
// INICIALIZAR
// ============================================================

async function iniciarDirectorio() {

    try {

        integrantesFamilia = await FamiliaCuenca.cargar();

        mostrarTotal();

        mostrarFamilia(integrantesFamilia);

    } catch (error) {

        document.getElementById("listaFamilia").innerHTML = `

            <p style="color:red;">
                No fue posible cargar la información familiar.
            </p>

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
    ).textContent = integrantesFamilia.length;

}


// ============================================================
// MOSTRAR FAMILIA
// ============================================================

function mostrarFamilia(lista) {

    const contenedor =
        document.getElementById("listaFamilia");


    if (lista.length === 0) {

        contenedor.innerHTML = `

            <p>
                No se encontraron familiares.
            </p>

        `;

        return;

    }


    contenedor.innerHTML = lista

        .sort((a, b) =>
            a.nombre.localeCompare(
                b.nombre,
                "es"
            )
        )

        .map(persona => `

            <article>

                <h2>
                    ${persona.nombre}
                </h2>

                <p>
                    🎂 ${persona.fecha}
                </p>

                <p>
                    🌎 ${persona.pais || "Información pendiente"}
                </p>

                <p>
                    📍 ${persona.estado || "Información pendiente"}
                    ${persona.ciudad
                        ? " — " + persona.ciudad
                        : ""}
                </p>

                <p>
                    ID: ${persona.id}
                </p>

            </article>

            <hr>

        `)

        .join("");

}


// ============================================================
// BUSCADOR
// ============================================================

document
    .getElementById("buscador")
    .addEventListener(
        "input",
        function () {

            const texto = this.value.trim();

            if (!texto) {

                mostrarFamilia(
                    integrantesFamilia
                );

                return;

            }


            const resultados =
                FamiliaCuenca.buscarPorNombre(
                    texto
                );


            mostrarFamilia(resultados);

        }
    );


// ============================================================
// ARRANCAR
// ============================================================

iniciarDirectorio();
