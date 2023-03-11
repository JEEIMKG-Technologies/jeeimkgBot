const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

/*
------------------------------------------
CONEXION DE FIRESTORE DATABASE CON NODE JS
------------------------------------------
*/

const admin = require("firebase-admin");

const serviceAccount = require("./jeeimkgServiceKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://jeeimkg-5705b.firebaseio.com"
});

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
FLOW DE CONVERSION O PREREGISTRO COMO CLIENTE EN JEEIMKG AGENCY
--------------------------------------------------------------------
*/

let nombre;
let tipoNegocio;
let presupuesto;
let objetivo;
let nicho;
let ROI;
let presupuestoOnline;
let area;
let tiempo;
let problemas;
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
        'Para iniciar con tu proceso de *pre-registro*, seleciona con quien quieres interactuar.',
        {
            capture: true, 
            buttons: [
                { body: 'Roberto (Persona)' }, { body: 'Sara (IA Experimental)' }, { body: 'Sigue conmigo (chatbot)' }
            ]
        },
        async (ctx, { flowDynamic, endFlow, fallBack }) => {
            if (ctx.body == 'Roberto (Persona)')
                return endFlow(`Encantado de hablar contigo *${nombre}*, Adios.`)
            else if (ctx.body == 'Sara (IA Experimental)')
                return endFlow(`Encantado de hablar contigo *${nombre}*, Adios.`)
            else if (ctx.body == 'Sigue conmigo (chatbot)')
                return  flowDynamic('Gracias por elegirme...')
            else
                return fallBack()
        }
    )
    .addAnswer(
        [
            '🙋🏻‍♂️ Bienvenido al sistema *de pre-registro*, Lee atentamente las *instrucciones*:',
            '\n❔  Responde con honestidad',
            '🧐  Elije atentanmente que servicio necesitas',
            '📅  Al terminar, deberas agendar una cita con nosotros',
            '💵  Nuestros precios no son cotizables (Precio personalizado según el cliente).',
            '💸  Si quieres cotizar precios deberá ser con uno de nuestros agentes (Roberto).',
            '🙆🏻‍♂️  Se franco, así podremos brindarte un mejor servicio.',
        ]
    )
    .addAnswer(
        ['¿Estas de acuerdo con esto?','Si no es así, puedes cancelar la solicitud.'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud')
            return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',
                buttons:[{body:'⬅️ Volver al Inicio' }]                         
            })
            return flowDynamic(`Perfecto *${nombre}*, Sigamos con el proceso...`)
        }
    )
    .addAnswer(
        ['¿Qué tipo de negocio tienes?'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud')
            return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',
                buttons:[{body:'⬅️ Volver al Inicio' }]                         
            })
            tipoNegocio = ctx.body
            return flowDynamic(`${nombre} tu resumen: *${tipoNegocio}*`)
        }
    )
    .addAnswer(
        ['¿Cuál es tu presupuesto?'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud')
            return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',
                buttons:[{body:'⬅️ Volver al Inicio' }]                         
            })
            presupuesto = ctx.body
            return flowDynamic(`Perfecto *${presupuesto}*, Sigamos con el proceso...`)
        }
    )
    .addAnswer(
        ['¿Cuál es su objetivo principal al contratar servicios de marketing?'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud')
            return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',
                buttons:[{body:'⬅️ Volver al Inicio' }]                         
            })
            objetivo = ctx.body
            return flowDynamic(`Perfecto *${objetivo}*, Sigamos con el proceso...`)
        }
    )
    .addAnswer(
        ['¿Ha trabajado con una agencia de marketing anteriormente?'],
        { capture: true, buttons: [{ body: 'Sí' }, { body: 'No' }] },
        async (ctx, { flowDynamic, fallBack }) => {
            if (ctx.body == 'Sí')
                return flowDynamic('¿Cuál fue su experiencia?')
            else if (ctx.body == 'No')
                return flowDynamic('Perfecto, no te preocupes. Nosotros te guiamos')
            else
                return fallBack()
            
        }
    )
    .addAnswer(
        ['¿Cuál es su nicho de mercado?'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud')
            return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',
                buttons:[{body:'⬅️ Volver al Inicio' }]                         
            })
            nicho = ctx.body
            return flowDynamic(`Perfecto *${nicho}*, Sigamos con el proceso...`)
        }
    )
    .addAnswer(
        ['¿Busca servicios de marketing en línea o fuera de línea?'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud')
            return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',
                buttons:[{body:'⬅️ Volver al Inicio' }]                         
            })
            marketing = ctx.body
            return flowDynamic(`Perfecto *${marketing}*, Sigamos con el proceso...`)
        }
    )
    .addAnswer(
        ['¿Tiene algún plan de marketing en marcha actualmente?'],
        { capture: true, buttons: [{ body: 'Sí' }, { body: 'No' }] },
        async (ctx, { flowDynamic, fallBack }) => {
            if (ctx.body == 'Sí')
                return flowDynamic('¿Cuál es su plan de marketing actual?')
            else if (ctx.body == 'No')
                return flowDynamic('Perfecto, no te preocupes. Nosotros te guiamos')
            else
                return fallBack()
            
        }
    )
    .addAnswer(
        ['¿Cuál es su expectativa de ROI?'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud')
            return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',
                buttons:[{body:'⬅️ Volver al Inicio' }]                         
            })
            ROI = ctx.body
            return flowDynamic(`Perfecto *${ROI}*, Sigamos con el proceso...`)
        }
    )
    .addAnswer(
        ['¿Tiene presencia en las redes sociales?'],
        { capture: true, buttons: [{ body: 'Sí' }, { body: 'No' }] },
        async (ctx, { flowDynamic, fallBack }) => {
            if (ctx.body == 'Sí')
                return flowDynamic('¿Cuál es su plan de marketing actual?')
            else if (ctx.body == 'No')
                return flowDynamic('Perfecto, no te preocupes. Nosotros te guiamos')
            else
                return fallBack()
            
        }
    )
    .addAnswer(
        ['¿Cuál es su presupuesto de publicidad en línea?'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud')
            return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',
                buttons:[{body:'⬅️ Volver al Inicio' }]                         
            })
            presupuestoOnline = ctx.body
            return flowDynamic(`Perfecto *${presupuestoOnline}*, Sigamos con el proceso...`)
        }
    )
    .addAnswer(
        ['¿Cuál es su área geográfica de interés para la promoción?'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud')
            return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',
                buttons:[{body:'⬅️ Volver al Inicio' }]                         
            })
            area = ctx.body
            return flowDynamic(`Perfecto *${area}*, Sigamos con el proceso...`)
        }
    )
    .addAnswer(
        ['¿Está dispuesto a invertir tiempo y recursos en su presencia digital?'],
        { capture: true, buttons: [{ body: 'Sí' }, { body: 'No' }] },
        async (ctx, { flowDynamic, fallBack }) => {
            if (ctx.body == 'Sí')
                return flowDynamic('¿Cuál es su plan de marketing actual?')
            else if (ctx.body == 'No')
                return flowDynamic('Perfecto, no te preocupes. Nosotros te guiamos')
            else
                return fallBack()
            
        }
    )
    .addAnswer(
        ['¿Cuánto tiempo ha estado en el negocio?'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud')
            return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',
                buttons:[{body:'⬅️ Volver al Inicio' }]                         
            })
            tiempo = ctx.body
            return flowDynamic(`Perfecto *${tiempo}*, Sigamos con el proceso...`)
        }
    )
    .addAnswer(
        ['¿Cuál es el tamaño de su negocio?'],
        { capture: true, buttons: [{ body: 'Pequeño' }, { body: 'Mediano'},{ body:'Grande'}] },
        async (ctx, { flowDynamic, fallBack }) => {
            if (ctx.body == 'Pequeño')
                return flowDynamic('¿Cuál es su plan de marketing actual?')
            else if (ctx.body == 'Mediano')
                return flowDynamic('Perfecto, no te preocupes. Nosotros te guiamos')
            else if (ctx.body == 'Grande')
                return flowDynamic('Perfecto, no te preocupes. Nosotros te guiamos')
            else
                return fallBack()
        }
    )
    .addAnswer(
        ['¿Qué problemas espera resolver con la contratación de una agencia de marketing?'],
        { capture: true, buttons: [{ body: '❌ Cancelar solicitud' }] },
        async (ctx, { flowDynamic, endFlow }) => {
            if (ctx.body == '❌ Cancelar solicitud')
            return endFlow({body: '❌ Su solicitud ha sido cancelada ❌',
                buttons:[{body:'⬅️ Volver al Inicio' }]                         
            })
            problemas = ctx.body
            return flowDynamic(`Perfecto *${problemas}*, Sigamos con el proceso...`)
        }
    )
    .addAnswer(
        ['¿Está dispuesto a hacer cambios en su negocio para adaptarse a una estrategia de marketing exitosa?'],
        { capture: true, buttons: [{ body: 'Sí' }, { body: 'No' }] },
        async (ctx, { flowDynamic, fallBack }) => {
            if (ctx.body == 'Sí')
                return flowDynamic('¿Cuál es su plan de marketing actual?')
            else if (ctx.body == 'No')
                return flowDynamic('Perfecto, no te preocupes. Nosotros te guiamos')
            else
                return fallBack()
            
        }
    )
    .addAnswer(
        ['¿Está buscando un plan de marketing a corto o largo plazo?'],
        { capture: true, buttons: [{ body: 'Corto' }, { body: 'Largo' }] },
        async (ctx, { flowDynamic, fallBack }) => {
            if (ctx.body == 'Corto')
                return flowDynamic('¿Cuál es su plan de marketing actual?')
            else if (ctx.body == 'Largo')
                return flowDynamic('Perfecto, no te preocupes. Nosotros te guiamos')
            else
                return fallBack()
            
        }
    )

/*
--------------------------------------------------------------------
FLOWS PRIMARIOS-SECUNDARIOS DEL CHATBOT
--------------------------------------------------------------------
*/

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
