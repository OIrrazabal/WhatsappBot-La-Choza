const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

// Flow para realizar un pedido
const flowPedido = addKeyword(['Hacer un pedido', '2', 'pedido', 'realizar pedido'])
    .addAnswer([
        '🛍️ *Proceso para realizar un pedido:*',
        '\nPara realizar un pedido, puedes comunicarte a los números:',
        '*0986 868 661* con Alba Ramirez',
        '*0971 897 162* con Emilce Ramirez',
        '\n*Nota:*',
        '📌 El pago es en efectivo al retirar.',
        '🏠 Los pedidos se retiran en el local.',
        '🚫 Por el momento no contamos con delivery.',
        '\nGracias por elegir *LA CHOZA FOOD_BAR 🛖*',
        'Más que un restaurante, un pedacito de tu hogar.',
        '\n*0* 🔙​ Volver al inicio',
    ], { delay: 1500 });

// Flow para menú
const flowMenu = addKeyword(['1', 'Menu', 'menu'])
    .addAnswer('📋 *Nuestro MENU está disponible como imagen:*', { delay: 500 })
    .addAnswer('Aquí está la imagen del menú:', {
        media: 'https://i.imgur.com/mTaDGbT.png',
    })
    .addAnswer(['\n*2* 🛍️ Realizar un Pedido', '\n*0* 🔙​ Volver al inicio']);

// Flow para ubicación
const flowUbicacion = addKeyword(['direccion', '3', 'ubicacion', 'dirección'])
    .addAnswer(['📍 *Nuestra dirección es:* \n24 de Junio &, Brasil, San Lorenzo, San Lorenzo, Paraguay  \nhttps://maps.app.goo.gl/qU6Ewi2foLAb56k98',
        "\n",
        '\n*LA CHOZA FOOD_BAR 🛖*',
        'Más que un restaurante, un pedacito de tu hogar.',
        "\n*0* 🔙​ Volver al inicio",
    ], { delay: 1500 });

// Flow para horarios
const flowHorarios = addKeyword(['Horario', '4', 'horario'])
    .addAnswer([
        '​🕒​ *Nuestro Horario de Atención es :*',
        "\n",
        "👉Miércoles de 15:00 hs a 22:00hs",
        "👉Jueves de 15:00 hs a 22:00hs",
        "👉Viernes de 15:00 hs a 22:00hs",
        "👉Sábados de 15:00 hs a 22:00hs",
        "\n",
        '\n*LA CHOZA FOOD_BAR 🛖*',
        'Más que un restaurante, un pedacito de tu hogar.',
        '\n*0* 🔙​ Volver al inicio',
    ], { delay: 1500 });

// Flow para contacto
const flowContacto = addKeyword(['Contacto', '5', 'contacto'])
    .addAnswer([
        '​​❤️​*Puedes encontrarnos en:*',
        '\n👉*FACEBOOK⭐*',
        '\n👉*INSTAGRAM⭐*',
        '\n👉*TIK TOK⭐*',
        "\n*Aquí:* https://linktr.ee/lachoza.py",
        "\n",
        '\n*LA CHOZA FOOD_BAR 🛖*',
        'Más que un restaurante, un pedacito de tu hogar.',
        '\n*0* 🔙 Volver al inicio',
    ], { delay: 1500 });

// Flow para salir
const flowSalir = addKeyword(['salir', '6', 'exit'])
    .addAnswer(["👋 Gracias por visitar *LA CHOZA FOOD_BAR 🛖*. ",
        "¡Esperamos verte pronto!",
        "\n",
        '\n*LA CHOZA FOOD_BAR 🛖*',
        'Más que un restaurante, un pedacito de tu hogar.',
    ], { delay: 1500 });

// Flow principal de bienvenida utilizando Events.welcome
const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer(['🙌 Hola bienvenido/a a *LA CHOZA FOOD_BAR 🛖*',
        "Más que un restaurante, un pedacito de tu hogar"],
        { delay: 500 }) // 0.5 segundos de retraso
    .addAnswer([
        '🍽️ En *LA CHOZA* preparamos productos 100% caseros y de calidad ',
        '👉 *1* 📋 Menú',
        '👉 *2* 🛍️ Hacer un pedido',
        '👉 *3* 📍 Ubicación',
        '👉 *4* ​🕒​ Horarios',
        '👉 *5* ​​⭐​ Redes Sociales',
        '👉 *6* ​​❌​ Salir ',
    ], { capture: true, delay: 1500 }, async (ctx, { gotoFlow, fallBack }) => {
        const option = ctx.body.trim();
        switch (option) {
            case "1":
                return gotoFlow(flowMenu);
            case "2":
                return gotoFlow(flowPedido);
            case "3":
                return gotoFlow(flowUbicacion);
            case "4":
                return gotoFlow(flowHorarios);
            case "5":
                return gotoFlow(flowContacto);
            case "6":
                return gotoFlow(flowSalir);
            default:
                return fallBack("Respuesta no válida, por favor selecciona una de las opciones.");
        }
    });

// Función principal para iniciar el bot
const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowWelcome, flowMenu, flowPedido, flowUbicacion, flowHorarios, flowContacto, flowSalir]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();

