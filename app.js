const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

/*
--------------------------------------------------------------------
FLOWS SECUNDARIOS (FLOWS YA EXISTENTES ANTES DE LOS PRIMARIOS)
--------------------------------------------------------------------
*/

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowPort2 = addKeyword([])
.addAnswer(['🏢 En *Jóvenes Emprendedores e Innovadores* nos enfocamos en crear las mejores experiencias para nuestros cliente.'])
.addAnswer('🤳🏻 Llevamos más de 3 años contigo, orgullosamente hemos hecho esto en el camino.',{
    media:'https://jeeimkg-static.s3.us-west-1.amazonaws.com/images/secondary.jpg'
})

const flowAudiovisual = addKeyword(['audiovisual','fotografia','video','videos','fotografias','photo']).addAnswer(
    '¡Hola bienvenido!',
    '\nAcontinuación nuestros trabajos de fotografía y video'
)
.addAnswer(
    '📸 Realizamos sesiones profesionales en estudio y exteriores',{
        media:'https://jeeimkg-static.s3.us-west-1.amazonaws.com/images/secondary.jpg'
    }
)
.addAnswer(
    '🎞️ Tambien videos cortos para redes y videos publicitarios',{
        media:'https://jeeimkg-static.s3.us-west-1.amazonaws.com/images/secondary.jpg'
    }
)
.addAnswer(
    '*Conoce más de nostros*',
    'visita nuestro sitio en behance y reacciona a todo nuestro protafolio de fotografía: https://www.behance.net/JEEIMKG_PHOTOGRAPHY'
)
.addAnswer(
    [
        'Escribe "*Menu*" para regresar al menu principal.'
    ],
    null,
    null,
    [flowSecundario]
)

const flowPublicidad = addKeyword(['publicidad','facebook ads','ads']).addAnswer(
    '¡Hola bienvenido!',
    '\nHemos mejorado las ventas y leads de decenas de empresas'
)
.addAnswer(
    '📢 Estos son nuestros resultados, conocelos...',{
        media:'https://jeeimkg-static.s3.us-west-1.amazonaws.com/images/secondary.jpg'
    }
)
.addAnswer(
    '*Conoce más de nostros*',
    'visita nuestras redes y conoce más sobre publicidad: https://www.behance.net/JEEIMKG_PHOTOGRAPHY'
)
.addAnswer(
    [
        'Escribe "*Menu*" para regresar al menu principal.'
    ],
    null,
    null,
    [flowSecundario]
)

const flowMedia = addKeyword(['social media','socialmedia']).addAnswer(
    'Plan de social media',
    '\nTener un plan de social media es importante para conectar con tus clientes a traves de redes'
)
.addAnswer(
    '📲 Esto es algo de lo que hacemos...',{
        media:'https://jeeimkg-static.s3.us-west-1.amazonaws.com/images/secondary.jpg'
    }
)
.addAnswer(
    '*Conoce más de nostros*',
    'visita nuestras redes y conoce más sobre social media: https://www.behance.net/JEEIMKG_PHOTOGRAPHY'
)
.addAnswer(
    [
        'Escribe "*Menu*" para regresar al menu principal.'
    ],
    null,
    null,
    [flowSecundario]
)

const flowDesarrollo = addKeyword(['desarrollo','software']).addAnswer(
    '💻 Desarrollamos software de calidad a medida',{
        media:'https://jeeimkg-static.s3.us-west-1.amazonaws.com/images/secondary.jpg'
    }
)
.addAnswer(
    '*Conoce más de nostros*',
    'visita nuestra web: https://jeeimkg.com'
)
.addAnswer(
    [
        'Escribe "*Menu*" para regresar al menu principal.'
    ],
    null,
    null,
    [flowSecundario]
)

const flowDesign = addKeyword(['diseño','design']).addAnswer(
    '🎨 Diseñamos tu marca',
    'Diseñamos experiencias inmersivas para tu marca.'
)
.addAnswer(
    ' Nuestras creaciones...',{
        media:'https://jeeimkg-static.s3.us-west-1.amazonaws.com/images/secondary.jpg'
    }
)
.addAnswer(
    '*Conoce más de nostros*',
    'visita nuestras redes y conoce más sobre publicidad: https://www.behance.net/JEEIMKG_DESIGN'
)
.addAnswer(
    [
        'Escribe "*Menu*" para regresar al menu principal.'
    ],
    null,
    null,
    [flowSecundario]
)

/*
--------------------------------------------------------------------
FLOWS PRIMARIOS-SECUNDARIOS DEL CHATBOT
--------------------------------------------------------------------
*/

let nombre;
const flowClient = addKeyword(['pertenezco','⬅️ Volver al Inicio'])
    .addAnswer(
        ['Antes de empezar...','\n*¿Cuál es tu nombre?*'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },

        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud')
            return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',    // Aquí terminamos el flow si la condicion se comple
                buttons:[{body:'⬅️ Volver al Inicio' }]                      // Y además, añadimos un botón por si necesitas derivarlo a otro flow        
            })
            nombre = ctx.body
            return flowDynamic(`Encantado *${nombre}*, continuamos...`)
        }
    )
    .addAnswer(
        'Para iniciar con tu proceso de *pre-registro*, seleciona con quien quieres interactuar:',
        {capture: true, buttons: [{ body: 'Roberto (Persona)' }, { body: 'Sara (IA Experimental)' }, { body: 'Sigue conmigo (chatbot)' }]},
        async (ctx, { flowDynamic, endFlow, fallBack }) => {
            if (ctx.body == 'Roberto (Persona)')
                return endFlow(`Encantado de hablar contigo *${nombre}*, Adios.`)
            else if (ctx.body == 'Sara (IA Experimental)')
                return flowDynamic('2')
            else if (ctx.body == 'Sigue conmigo (chatbot)')
                return flowDynamic('1')
            else
                return fallBack()
        }
    )

const flowPortafolio = addKeyword(['portafolio', 'Portfolio', 'trabajos']).addAnswer(
    [
        '👨🏻‍💻 Visita nuestras páginas y conoce nuestro trabajo',
        '*Fotografía:* https://www.behance.net/JEEIMKG_PHOTOGRAPHY',
        '*Diseño:* https://www.behance.net/JEEIMKG_DESIGN',
        '*Desarrollo:* https://jeeimkg.com/work/development',
        '\n*2* Para saber más.',
    ],
    null,
    null,
    [flowPort2]
)

const flowServicios = addKeyword(['Servicios', 'Servicio', 'services']).addAnswer(
    [
        '🤷🏻‍♂️ ¿Qué es lo que te interesa ahora mismo?, Escriba una de las siguientes opciones:',
        '🎞️ *Audiovisual* video y fotografía',
        '📢 *Publicidad* Marketing y Publicidad',
        '📲 *Social Media* Gestión y creación (contenido)',
        '💻 *Desarrollo* Aplicaciones móviles y web',
        '🎨 *Diseño* Productos y contenidos digitales'
    ],
    null,
    null,
    [flowAudiovisual,flowPublicidad,flowMedia,flowDesarrollo,flowDesign]
)

/*
--------------------------------------------------------------------
FLOW PRINCIPAL, ESTE FLOW DA LA BIENVENIDA AL CLIENTE
--------------------------------------------------------------------
*/

const flowPrincipal = addKeyword(['principal','menu','hola', 'ole', 'ola', 'alo','buenas','info','quiero información'])
    .addAnswer(['🙌 Hola bienvenido a *jeeimkg Services*'])
    .addAnswer(
        [
            '¿En que te podemos ayudar?, selecciona una de las siguientes opciones:',
            '👉 *Portafolio* para ver nuestro trabajo',
            '👉 *Servicios*  para ver nuestros servicios',
            '👉 *Pertenezco* convertirte en cliente',
            '👉 *Chat* para hablar con nuestra IA',
        ],
        null,
        null,
        [flowPortafolio, flowServicios, flowClient]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
