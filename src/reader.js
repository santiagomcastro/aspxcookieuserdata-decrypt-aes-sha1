"use strict";

class ReaderCookieBuffer {
    constructor(buffer) {
        this.buffer = buffer
    }

    readStringCustomData(){

        let lastKey = -1; 

        // Le quita los espacios en blanco
        const bufferWithoutSpace = this.buffer.filter((positionValue) => positionValue !== 0);

        // Busco la palabra IdUsuario correspondiente al primer campo de JSON de los datos de la cookie a ver si existe
        let idUsuarioPosition = bufferWithoutSpace.indexOf("IdUsuario");

        //En caso de que sea -1 retorno null indicando que no existe
        if(idUsuarioPosition === -1){
            return null
        }

        // Si es > -1, en contro la palabra, por lo que tomo esa posicion y hago un slice de esa posicion - 2 para obtener la primer llave y hasta el largo del bufferWithoutSpace

        let bufferFromIdUsuarioToLenght = 
            bufferWithoutSpace.slice((idUsuarioPosition - 2), bufferWithoutSpace.length);
        
        // Busca la llave de cierre del JSON con los datos del usuario
        bufferFromIdUsuarioToLenght.some((positionValue, index) => {
            if(lastKey === -1 && String.fromCharCode(positionValue) === '}'){
                lastKey = ++index;
                return true;
            }
        });

        // Toma solamente las posiciones entre el inicio del array y lastKey que representa el JSON con los datos del usuario
        const bufferUserData = bufferFromIdUsuarioToLenght.slice(0, lastKey);        

        // Parsea a JSON
        const userDataJSON = JSON.parse(bufferUserData);

        return userDataJSON;
    }
}

module.exports = ReaderCookieBuffer;
