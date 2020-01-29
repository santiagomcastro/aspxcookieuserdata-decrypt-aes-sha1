"use strict";

class ReaderCookieBuffer {
    constructor(buffer) {
        this.buffer = buffer
    }

    readStringCustomData(){
        let first, last; 

        this.buffer.forEach( (positionValue, index) => {
            if (String.fromCharCode(positionValue) === '{'){
                first = index;
            }
            else if(String.fromCharCode(positionValue) === '}'){
                last = ++index;
            }
        });

        const bufferUserData = this.buffer.slice(first, last);

        const bufferUserDataWithoutSpace = bufferUserData.filter((positionValue) => positionValue !== 0);

        const userDataJSON = JSON.parse(bufferUserDataWithoutSpace);

        return userDataJSON;
    }
}

module.exports = ReaderCookieBuffer;
