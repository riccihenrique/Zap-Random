import jimp from 'jimp';
import wa from '@open-wa/wa-automate';
import path from 'path';
import axios from 'axios';

function getImage() { // get random image
    return `https://picsum.photos/400/400?random=${Math.random()}`;
}

(async function sendMessage() {

    const url = getImage(); 
    // Read the fonts to write the image
    const font78 = await jimp.loadFont(path.resolve("fonts/font78.fnt"));
    const font28 = await jimp.loadFont(path.resolve("fonts/font28.fnt"));

    const client = await wa.create(); // connect with whatsapp web
    const contacts = await client.getAllContacts(); // get all contacts
    const amigos = contacts.filter(c => c.formattedName.includes('Mor') /*|| c.formattedName.includes('Pistola')*/); // filter the contacts

    const text = await axios.get('http://asdfast.beobit.net/api/?type=word&length=7'); // get a random text
    const textTranslated = await axios.get(`https://api.mymemory.translated.net/get?q=${text.data.text}!&langpair=la|pt-br`); // translate the text (because it's in latin)

    for(let i = 0; i < amigos.length; i++) {// Create a custom message for each contact filtered above
        const img = await jimp.read(url); // read img from Url
        
        let newImg = await img.print(font28, 10, 10, "Bom dia"); // Add msg
        
        newImg = await img.print(font78, 3, 50, amigos[i].pushname + '...'); // Get the name in whatsapp
        newImg = await newImg.print(font28, 100, 300, 'e bora cod'); // Add msg
        
        const base64 = await newImg.getBase64Async(jimp.MIME_JPEG); // convert the image to base64
        await client.sendFile(amigos[i].id._serialized, base64, 'Bom dia.jpg', textTranslated.data.responseData.translatedText); // Send the image
    }
})()

