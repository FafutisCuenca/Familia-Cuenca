// ============================================================
// MOTOR DE DATOS - FAMILIA CUENCA
// Archivo: /js/familia-data.js
// Fuente maestra: /data/familia.json
// ============================================================

const FamiliaCuenca = (() => {

    let integrantes = [];

    // --------------------------------------------------------
    // UBICACIÓN DEL ARCHIVO MAESTRO
    // --------------------------------------------------------
    // Obtiene la URL real del propio archivo
    // familia-data.js y desde ahí localiza:
    //
    // /data/familia.json
    //
    // Esto permite utilizar el mismo motor desde
    // cualquier carpeta del portal.
    // --------------------------------------------------------

    const scriptFamilia =
        [...document.scripts].find(
            script =>
                script.src.includes(
                    "/js/familia-data.js"
                )
        );

    const rutaDatos =
        scriptFamilia
            ? new URL(
                "../data/familia.json",
                scriptFamilia.src
              )
            : null;

    // --------------------------------------------------------
    // Cargar datos
    // --------------------------------------------------------

async function cargar() {

    try {

        if (!rutaDatos) {
            throw new Error(
                "No se encontró el archivo familia-data.js"
            );
        }

        const respuesta =
            await fetch(rutaDatos);


        if (!respuesta.ok) {

            throw new Error(
                `No se pudo cargar familia.json (${respuesta.status})`
            );

        }


        integrantes =
            await respuesta.json();


        console.log(
            `Familia Cuenca: ${integrantes.length} registros cargados.`
        );


        return integrantes;


    } catch (error) {

        console.error(
            "Error cargando los datos de la Familia Cuenca:",
            error
        );

        throw error;

    }

}

    // --------------------------------------------------------
    // Obtener todos los integrantes
    // --------------------------------------------------------

    function todos() {
        return integrantes;
    }


    // --------------------------------------------------------
    // Buscar por ID
    // --------------------------------------------------------

    function buscarPorId(id) {

        return integrantes.find(
            persona => persona.id === id
        );

    }


    // --------------------------------------------------------
    // Buscar por nombre
    // --------------------------------------------------------

    function buscarPorNombre(texto) {

        const busqueda = texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        return integrantes.filter(persona => {

            const nombre = persona.nombre
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            return nombre.includes(busqueda);

        });

    }


    // --------------------------------------------------------
    // Filtrar por país
    // --------------------------------------------------------

    function porPais(pais) {

        return integrantes.filter(
            persona => persona.pais === pais
        );

    }


    // --------------------------------------------------------
    // Filtrar por género
    // --------------------------------------------------------

    function porGenero(genero) {

        return integrantes.filter(
            persona => persona.genero === genero
        );

    }


    // --------------------------------------------------------
    // Filtrar por estatus
    // --------------------------------------------------------

    function porEstatus(estatus) {

        return integrantes.filter(
            persona => persona.estatus === estatus
        );

    }


    // --------------------------------------------------------
    // Cumpleaños por mes
    // --------------------------------------------------------

    function porMes(mes) {

        return integrantes.filter(
            persona => persona.mes === mes
        );

    }


    // --------------------------------------------------------
    // Cumpleaños por fecha
    // --------------------------------------------------------

    function porFecha(fecha) {

        return integrantes.filter(
            persona => persona.fecha === fecha
        );

    }


    // --------------------------------------------------------
    // Obtener países existentes
    // --------------------------------------------------------

    function paises() {

        return [
            ...new Set(
                integrantes
                    .map(persona => persona.pais)
                    .filter(Boolean)
            )
        ].sort();

    }


    // --------------------------------------------------------
    // Obtener estados
    // --------------------------------------------------------

    function estados() {

        return [
            ...new Set(
                integrantes
                    .map(persona => persona.estado)
                    .filter(Boolean)
            )
        ].sort();

    }


    // --------------------------------------------------------
    // Obtener ciudades
    // --------------------------------------------------------

    function ciudades() {

        return [
            ...new Set(
                integrantes
                    .map(persona => persona.ciudad)
                    .filter(Boolean)
            )
        ].sort();

    }


    // --------------------------------------------------------
    // Estadísticas básicas
    // --------------------------------------------------------

    function estadisticas() {

        const total = integrantes.length;

        const mujeres = integrantes.filter(
            p => p.genero === "F"
        ).length;

        const hombres = integrantes.filter(
            p => p.genero === "M"
        ).length;

        const vivos = integrantes.filter(
            p => p.estatus === "Vivo"
        ).length;

        const finados = integrantes.filter(
            p => p.estatus === "Finado"
        ).length;

        const conPais = integrantes.filter(
            p => p.pais
        ).length;

        const sinPais = integrantes.filter(
            p => !p.pais
        ).length;

        return {

            total,

            mujeres,

            hombres,

            vivos,

            finados,

            conPais,

            sinPais,

            paises: paises(),

            estados: estados(),

            ciudades: ciudades()

        };

    }


    // --------------------------------------------------------
    // API pública
    // --------------------------------------------------------

    return {

        cargar,

        todos,

        buscarPorId,

        buscarPorNombre,

        porPais,

        porGenero,

        porEstatus,

        porMes,

        porFecha,

        paises,

        estados,

        ciudades,

        estadisticas

    };

})();
