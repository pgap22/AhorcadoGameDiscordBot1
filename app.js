const {
    error
} = require('console');
const {
    Client,
    MessageEmbed,
    ClientUser
} = require('discord.js');
const fs = require('fs')
const client = new Client()
var wordForStartGame = "iniciarahorcado";
var listaPalabras = fs.readFileSync('./palabras/palabras.txt').toString().split("\n");
var palabraAdivinar = [];
var juegoActivo = false;
var palabraEjemplo = [];
var intentosActuales = 0;
var i = 0;
var checker = 0;
var pista = 0;
var userInput;
let playerChoice = false;
var playerSoloName;
var startSolo;
var playerIsAlreadyDone = false;
var intentosLimite;
var setDifficulty = "normal"
var playerDifficultySelect;
var playerDifficultySelectInGame = false
var feedback = false;
var feedbackPlayer = "";

client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity("AhorcadoGame World Cup", {
        type: 'COMPETING'
    }).catch(console.error)
});
client.on('message', message => {

    if (!message.guild) return 0;

    if (message.content.toLowerCase() == "?atajos") {
        const Atajos = new MessageEmbed()
            .setColor("BLUE")
            .setDescription("**Estos son los atajos del bot** \n\n Para iniciar el juego puedes usar **?start**\n\n Para elegir una palabra de forma rapida puedes hacerlo asi **=B, =A, =O**")
            message.channel.send(Atajos)
        }

    function elegirpalabra(mode) {

        if (mode == "dev") {
            return "isla de las marvinas"
        }
        if (mode == "normal") {
            let preWord = listaPalabras[Math.floor(Math.random() * listaPalabras.length) + 1]

            return preWord;
        }
        if (mode == "hardcore") {
            let preWord = listaPalabras[Math.floor(Math.random() * listaPalabras.length) + 1]


            console.log(preWord)

            while (preWord.length < 18) {

                preWord = listaPalabras[Math.floor(Math.random() * listaPalabras.length) + 1]
                console.log(preWord)

            }
            if (preWord.length >= 18) {

                console.log("-----", preWord)
                return preWord;

            }
        }

        if (mode == "hard") {
            let preWord = listaPalabras[Math.floor(Math.random() * listaPalabras.length) + 1]


            console.log(preWord)

            while (preWord.length <= 9) {

                preWord = listaPalabras[Math.floor(Math.random() * listaPalabras.length) + 1]
                console.log(preWord)

            }
            if (preWord.length >= 10) {

                console.log("-----", preWord)
                return preWord

            }
        }
    }

    const PlayerDecidir = new MessageEmbed()
        .setColor("PURPLE")
        .setTitle("Seleccion de modo de juego")
        .setDescription("Como deseas jugar **AhorcadoGame**\n Escribe dependiendo de como quieras jugar\n\n**Solitario/Cooperativo**\n Si juegas cooperativo todos podran elegir una letra\n\nSi juegas solitario solo tú podras elegir una letra")

    const SetMode = new MessageEmbed()
        .setColor('#00aae4')
        .setTitle('Modo de dificultad')

    if (message.content.toLowerCase() == "?mode" & !playerDifficultySelectInGame) {
        if (juegoActivo) {
            message.channel.send(new MessageEmbed().setDescription("No puedes elegir la dificultad en partida!").setColor("RED").setTitle("Error D:"))
            if (!playerIsAlreadyDone) {
                message.channel.send(PlayerDecidir)

            }
            return 0;
        } else {
            playerDifficultySelect = true
            const ListMode = new MessageEmbed()
                .setColor('#6a9eda')
                .setTitle('Seleccion de dificultad')
                .setDescription('Que dificultad\n\n**Normal: ** Partida clasica sin complicacion\n\n**Hard:** Menos intentos y palabras con mas letras\n\n**HARDCORE** Solo un intento por partida y palabras aun mas largas')
            message.channel.send(ListMode)

        }
    } else if (message.content.toLowerCase().startsWith("?mode") & !playerDifficultySelectInGame) {
        if (juegoActivo) {
            message.channel.send(new MessageEmbed().setDescription("No puedes elegir la dificultad en partida!").setColor("RED").setTitle("Error D:"))
            message.channel.send(PlayerDecidir)
            return 0;
        }
        setDifficulty = message.content.toLowerCase().slice(6).trim().split().toString()
        console.log(setDifficulty)
        if (setDifficulty != "normal") {
            if (setDifficulty != "hard") {
                if (setDifficulty != "hardcore") {
                    setDifficulty = "normal"
                }
            }
        }
        playerDifficultySelect = false
        message.channel.send(SetMode.setDescription("El modo **" + setDifficulty.toUpperCase() + "** a sido establecido"))
    }

    if (playerDifficultySelect & message.content.toLowerCase() == "hardcore") {

        setDifficulty = "hardcore"
        console.log(setDifficulty)
        message.channel.send(SetMode.setDescription("El modo **" + setDifficulty.toUpperCase() + "** a sido establecido"))
        playerDifficultySelect = false
    }


    if (playerDifficultySelect & message.content.toLowerCase() == "normal") {
        setDifficulty = "normal"
        console.log(setDifficulty)
        message.channel.send(SetMode.setDescription("El modo **" + setDifficulty.toUpperCase() + "** a sido establecido"))
        playerDifficultySelect = false
    }

    if (playerDifficultySelect & message.content.toLowerCase() == "hard") {

        setDifficulty = "hard"
        console.log(setDifficulty)
        message.channel.send(SetMode.setDescription("El modo **" + setDifficulty.toUpperCase() + "** a sido establecido"))
        playerDifficultySelect = false

    }



    if (message.content == '<@!862373023101616168>') {
        const Ayuda = new MessageEmbed()
            .setColor("BROWN")
            .setDescription("Parece que necesitas ayuda\n Para jugar **AhorcadoGame** tienes que escribir los siguiente **IniciarAhorcado** y podras jugar :D\n\n**Deseas cambiar la dificultad?**\nUsa ?Mode para cambiar la dificultad!\n\nDeseas apoyar a AhorcadoGame?\nTu **Feedback** puede ayudar al desarollo de AhorcadoGame! Escribe **?feedback** para apoyar!  \n\n\n\n**Tip secreto:** Puedes utilizar el atajo **Ej. ?mode normal ** para poner mas rapido la dificultad que quieres :eyes:")
            .setTitle("Ayuda AhorcadoGame")
        message.channel.send(Ayuda)
    }


    if (message.content == "ejemplo") {

    }



    let a = [];
    //Mecanismo ON or OF
    if ((message.content.toLowerCase() == wordForStartGame & !juegoActivo & !playerDifficultySelect) || (message.content.toLowerCase() == "?start" & !juegoActivo & !playerDifficultySelect)) {

        elegirpalabra(setDifficulty).toLowerCase().slice().trim().split('').forEach((word) => {
            (word == ' ') ? palabraAdivinar.push('**_**') & palabraEjemplo.push('**_**'): palabraAdivinar.push(word) & palabraEjemplo.push("#")
        })
        console.log(palabraAdivinar)
        intentosLimite = palabraAdivinar.length + 2
        console.log(palabraAdivinar)
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$")
        console.log("la dificultad es " + setDifficulty)
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$")
        juegoActivo = true;

        let textoBienvenida = "Bienvenido **" + message.author.username + "** al juego AhorcadoGame un prototipo del famoso juego ahorcado en Discord!"
        const Bienvenida = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("===========\n AhorcadoGame\n===========")
            .setDescription("-".repeat(textoBienvenida.length) + "\n" + textoBienvenida + "\n" + "-".repeat(textoBienvenida.length))
            .setImage(message.author.displayAvatarURL());



        message.channel.send(Bienvenida)



        const Instrucciones = new MessageEmbed()
            .setColor("BLUE")
            .setTitle("**INSTRUCCIONES**")
            .addField("Intentos", "Depende de la palabra tienes intentos Limitados", true)
            .addField("Seleccion de letra", "Para elegir una letra debes de escribir lo siguiente: Letra: [La letra que quieres sin los corchetes]", true)
            .addField("Ejemplo", "Letra: A", true)
            .setDescription("Ojo a las instrucciones, puedes empezar ya!")
            .setImage("https://pbs.twimg.com/media/Ek-zeK-XEAERPqO.jpg")

        setTimeout(() => {
            message.channel.send(Instrucciones)

        }, 2000);

        const PlayerDecidir = new MessageEmbed()
            .setColor("PURPLE")
            .setTitle("Seleccion de modo de juego")
            .setDescription("Como deseas jugar **AhorcadoGame**\n Escribe dependiendo de como quieras jugar\n\n**Solitario/Cooperativo**\n Si juegas cooperativo todos podran elegir una letra\n\nSi juegas solitario solo tú podras elegir una letra\n\n Si en algun momento quieres abandonar la partida usa **?leave**")

        setTimeout(() => {
            message.channel.send(PlayerDecidir)
        }, 2500);
        playerChoice = true
        playerSoloName = message.author.username;


    } else if ((message.content.toLowerCase() == wordForStartGame & juegoActivo) || (message.content.toLowerCase() == "?start" & juegoActivo)) {
        message.channel.send("Ya hay un juego activo!");
    } else if ((message.content.toLowerCase() == wordForStartGame & !juegoActivo & playerDifficultySelect) || (message.content.toLowerCase() == "?start" & !juegoActivo & playerDifficultySelect)) {
        message.channel.send("Espera selecciona antes una difficultad antes de iniciar");
    }

    if (message.content.toLowerCase().startsWith("solitario") & playerChoice & message.author.username == playerSoloName) {
        //a
        playerIsAlreadyDone = true;
        playerChoice = false;

        console.log(palabraAdivinar)

        const PalabraToGuess = new MessageEmbed()
            .setColor("YELLOW")
            .setDescription("Esta es la palabra que tienes que adivinar!\nRecuerda que los # siginifican que son las letras faltantes !")
            .addField("-".repeat(10) + "\n" + "Palabra para adivinar\n" + "-".repeat(10), palabraEjemplo.toString())
        if (setDifficulty == "hardcore") {
            PalabraToGuess.setDescription("Esta es la palabra que tienes que adivinar!\nRecuerda que los # siginifican que son las letras faltantes !\n\n **SOLO TIENES UN INTENTO**")
        }

        message.channel.send(PalabraToGuess)

        //z
        startSolo = true;
        
    } else if (message.content.toLowerCase().startsWith("cooperativo") & playerChoice & message.author.username == playerSoloName) {
        playerChoice = false;
        playerIsAlreadyDone = true;

        console.log(palabraAdivinar)

        const PalabraToGuess = new MessageEmbed()
            .setColor("YELLOW")
            .setDescription("Esta es la palabra que tienes que adivinar!\nRecuerda que los # siginifican que son las letras faltantes !")
            .addField("-".repeat(10) + "\n" + "Palabra para adivinar\n" + "-".repeat(10), palabraEjemplo.toString())

        if (setDifficulty == "hardcore") {
            PalabraToGuess.setDescription("Esta es la palabra que tienes que adivinar!\nRecuerda que los # siginifican que son las letras faltantes !\n\n**SOLO TIENES UN INTENTO**")

        }

        message.channel.send(PalabraToGuess)

    }

    if ((juegoActivo & message.content.toLowerCase().startsWith('letra:') & intentosActuales < intentosLimite & playerIsAlreadyDone) || (juegoActivo & message.content.toLowerCase().startsWith('=') & intentosActuales < intentosLimite & playerIsAlreadyDone)) {
        if (startSolo & message.author.username != playerSoloName) {
            return 0
        }

        if (setDifficulty == "hardcore") {
            intentosActuales = palabraAdivinar.length + 1
        }

        if (setDifficulty == "hard") {
            intentosLimite = 5
        }
        (message.content.toLowerCase().startsWith('letra:')) ? userInput = message.content.slice(6).trim().split('').toString().toLowerCase(): userInput = message.content.slice(1).trim().split('').toString().toLowerCase();
        intentosActuales += 1

        console.log("El UserInput es igual a " + userInput)

        for (i = 0; i < palabraAdivinar.length; i++) {
            if (userInput == palabraAdivinar[i]) {
                console.log("La letra a sido adivinada el lugar (" + i + ") " + userInput);
                palabraEjemplo[i] = userInput;
                checker = i;


            }
        }


        console.log("***********************************")
        console.log(palabraEjemplo)
        console.log("***********************************")

        console.log("--------------------------------")
        console.log(palabraAdivinar)        
        console.log("--------------------------------")

        if (userInput == palabraAdivinar[checker]) {
            intentosActuales -= 1

            const PalabraToGuess = new MessageEmbed()
                .setColor("YELLOW")
                .setDescription("Esta es la palabra que tienes que adivinar!\nRecuerda que los # siginifican que son las letras faltantes !\n**Parce que has adivinado una letra sigue asi!**\nTienes " + intentosActuales + "/" + (intentosLimite) + " Intentos")
                .addField("-".repeat(10) + "\n" + "Palabra para adivinar\n" + "-".repeat(10), palabraEjemplo.toString().toUpperCase())

            if (setDifficulty == "hardcore") {
                PalabraToGuess.setDescription("Esta es la palabra que tienes que adivinar!\nRecuerda que los # siginifican que son las letras faltantes !\n**Parce que has adivinado una letra sigue asi!**\nSOLO TIENES UN INTENTO")

            }
            message.channel.send(PalabraToGuess.setColor("GREEN"))
            console.log(checker)
        }
        if (userInput != palabraAdivinar[checker]) {

            const PalabraToGuess = new MessageEmbed()
                .setColor("YELLOW")
                .setDescription("Esta es la palabra que tienes que adivinar!\nRecuerda que los # siginifican que son las letras faltantes !\n**Parece que ta has equivocado!**\nTienes " + intentosActuales + "/" + (intentosLimite) + " Intentos\n\n**Recuerda que si eres <@&833532338092638218> o <@&868965434790117456> puedes usar el comando Pista?** !")
                .addField("-".repeat(10) + "\n" + "Palabra para adivinar\n" + "-".repeat(10), palabraEjemplo.toString().toUpperCase())
            if (setDifficulty == "hardcore") {
                PalabraToGuess.setDescription("Esta es la palabra que tienes que adivinar!\nRecuerda que los # siginifican que son las letras faltantes !\n**Parece que ta has equivocado!**\n\nSOLO TIENES UN INTENTO\n\n**Recuerda que si eres <@&833532338092638218> o <@&868965434790117456> puedes usar el comando Pista?** !")

            }
            message.channel.send(PalabraToGuess.setColor("RED"))
        }

        if (palabraEjemplo.toString() == palabraAdivinar.toString()) {
            if (setDifficulty == "hardcore") {
                 if(!startSolo) return 0;
                message.member.roles.add('868965434790117456').catch(console.error)
                const WinHardcore = new MessageEmbed()
                    .setColor("BLACK")
                    .setTitle("HARDCORE AHORCADOGAME WINNER")
                    .setDescription("Wow acabas de ganar **AhorcadoGame** en modo **Harcore** felicidades acabas de ganar un rol! <@&868965434790117456>")
                message.channel.send(WinHardcore)
                /*
                Poner solo cuando quiera mods :D
                message.guild.owner.send(new MessageEmbed().setColor("YELLOW").setTitle(playerSoloName).setDescription("JAJAJ LE DEBES MOD AL QUE ESTA ARRIBA\n\n si sos ciego es este **"+playerSoloName+"**"))
                message.author.send(new MessageEmbed().setDescription("Constancia de MOD").setTitle("NEW MOD :D"))
                */

            }


            const HasAdivinado = new MessageEmbed()
                .setTitle("HAS GANADO! :D")
                .setColor("#39FF14")
                .setDescription("Has adivinado correctamente la palabra VAMOS QUE BUENA CAMPEON, FIERA, NUMERO 1!\n**Muy Facil?** Usa **?mode** para cambiar la dificultad!\n\nPuedes volver a jugar escribiendo **IniciarAhorcado**")

            if (setDifficulty == "hardcore") {
                HasAdivinado.setDescription("Has adivinado correctamente la palabra VAMOS QUE BUENA CAMPEON, FIERA, NUMERO 1!\nPuedes volver a jugar escribiendo **IniciarAhorcado**")

            }

            message.channel.send(HasAdivinado)
            if (!startSolo) {
                const CooperativeWin = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("Ganador :D")
                    .setDescription("Ala has sido el que adivino la palabra en esta sesion cooperativa **Sigue asi!** Recuerda que puedes seguir jugando este juego escribiendo **IniciarAhorcado**")
                message.author.send(CooperativeWin)
            }
            palabraEjemplo = [];
            palabraAdivinar = [];
            juegoActivo = false;
            intentosActuales = 0;
            pista = false;
            startSolo = false
            playerSoloName = "";
            playerIsAlreadyDone = false;
        }


        if (intentosActuales == intentosLimite & juegoActivo) {
            console.log(intentosActuales)

            const IntentosAcabados = new MessageEmbed()
                .setColor("WHITE")
                .setDescription("Vaya parece que se acabaron tus intentos pero puedes volver a jugar escribiendo **IniciarAhorcado** \n\n**Muy dificil?** Cambiar la dificultad con **?mode** !\nLa palabra era " + palabraAdivinar.toString().toUpperCase())
                .setTitle("Que lastima has perdido! D:")



            message.channel.send(IntentosAcabados)
            juegoActivo = false;
            palabraEjemplo = [];
            palabraAdivinar = [];
            intentosActuales = 0;
            pista = false;
            startSolo = false
            playerSoloName = "";
            playerIsAlreadyDone = false;
        }

    }

    if (message.content.toLowerCase().startsWith('pista?') & !pista & playerSoloName == message.author.username & juegoActivo) {

        let rolEpico = '833532338092638218'
        for (let i = 0; i <= message.member._roles.length; i++) {
            if (i == message.member._roles.length) {
                if (message.member._roles[i] != rolEpico || '868965434790117456' != message.member._roles[i] || '841803049047556096' != message.member._roles[i]) {
                    const NoVip = new MessageEmbed()
                        .setColor("RED")
                        .setTitle("Error D:")
                        .setDescription("Parece que no eres <@&833532338092638218> o <@&868965434790117456> \n\n **VAMOS INTENTEMOS CONSEGUIR ESOS ROLES!**")
                    message.channel.send(NoVip)
                }
            }
            if (rolEpico == message.member._roles[i] || '841803049047556096' == message.member._roles[i] || '868965434790117456' == message.member._roles[i]) {
                console.log("El usuario " + message.author.username + " ha usado un comodin")
                if (juegoActivo) {
                    pista = true
                    for (i = 0; i < palabraAdivinar.length; i++) {
                        if (palabraEjemplo[i] != palabraAdivinar[i]) {
                            const PistaV = new MessageEmbed()
                                .setColor("WHITE")
                                .setDescription(`Me huele que es la letra: **${palabraAdivinar[i].toUpperCase()}** `)
                                .setTitle("**Pista 1/1**")
                                .setFooter("Powered by Pgap22#9444")

                            message.channel.send(PistaV)

                            return 0;
                        }

                    }

                }
            }
        }

    } else if (message.content.toLowerCase().startsWith('pista?') & pista & playerSoloName == message.author.username & juegoActivo) {
        const PistaAgotada = new MessageEmbed()
            .setColor("YELLOW")
            .setTitle("Pista agotada D:")
            .setDescription("-".repeat(50) + "\nSolo tienes disponible una pista por partida!\n" + "-".repeat(50))

        message.channel.send(PistaAgotada)

    } else if (juegoActivo & message.content.toLowerCase().startsWith('?leave') & intentosActuales < intentosLimite & message.author.username == playerSoloName) {
        const AbandonarGame = new MessageEmbed()
            .setColor("YELLOW")
            .setDescription("Has abandonado la partida\n\n Pero puedes volver a jugar escribiendo **IniciarAhorcado** ")
            .setTitle("Partida de AhorcadoGame Cancelada D:")
        message.channel.send(AbandonarGame)
        juegoActivo = false;
        palabraEjemplo = [];
        palabraAdivinar = [];
        intentosActuales = 0;
        pista = false;
        startSolo = false
        playerSoloName = "";
        playerIsAlreadyDone = false;
    }
    
    if (message.content.toLowerCase().startsWith('?feedback')) {
        feedbackPlayer = message.author.username
        feedback = true;
        const FeedBack = new MessageEmbed()
            .setColor("BLUE")
            .setDescription("Hola gracias por apoyar AhorcadoGame \n\n**IMPORTANTE** para escribir tu peticion empieza tu mensaje con un **¿**\n\nEjemplo:**[ ¿Mi peticion es agregar mas palabras ]** ")
            .setTitle("FEEDBACK")
        message.channel.send(FeedBack)
    }
    if (message.content.toLowerCase().startsWith('¿') & feedback & feedbackPlayer === message.author.username) {
        let peticion = message.content.slice(1)
        message.guild.owner.send(new MessageEmbed().setColor("GREEN").setTitle(feedbackPlayer).setDescription(`La peticion es: **${peticion}**`).setFooter("Powered By pgap22 jajaj estoy solo yo lo veo xd"))
        const Succesfull = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Feedback Enviado!")
            .setDescription("Su peticion a sido enviada correctamente!\n\n**Gracias por enviar tu feedback**")
        message.channel.send(Succesfull)

        feedback = false;
        feedbackPlayer = "";
    }



});

client.login('');
