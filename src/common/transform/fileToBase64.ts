
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function() {
            resolve(file ? reader.result : '');
        }
        reader.onerror = reject;
        if(file){
            reader.readAsDataURL(file);
        }else{
            resolve('')
        }
    });
}