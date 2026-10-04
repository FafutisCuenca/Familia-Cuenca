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

            <div class="tarjeta-familiar">

                <h2>No encontramos familiares</h2>

                <p>
                    Intenta con otro nombre o palabra.
                </p>

            </div>

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

        .map(persona => {

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


            return `

                <article
                    class="tarjeta-familiar"
                    onclick="abrirPerfil('${persona.id}')"
                    style="cursor:pointer;"
                >

                    <div class="avatar">

                        ${
                            persona.foto

                            ? `<img
                                src="${persona.foto}"
                                alt="${persona.nombre}"
                              >`

                            : inicial

                        }

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

                        ${
                            persona.genero === "F"
                                ? "👩"
                                : "👨"
                        }

                        ${
                            persona.genero === "F"
                                ? "Femenino"
                                : "Masculino"
                        }

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

                        ${
                            persona.estatus === "Vivo"
                                ? "🟢"
                                : "⚪"
                        }

                        ${persona.estatus}

                    </div>


                    <span class="id-familiar">

                        ${persona.id}

                    </span>

                </article>

            `;

        })

        .join("");

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
