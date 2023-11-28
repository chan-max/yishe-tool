import { resolveFilePath} from "./url";


export function format1stf(source:any){

    if(!source){
        return null
    }

    if(typeof source === 'string'){
        try{
            source = JSON.parse(source);
        }catch(e){
            return {}
        }
    }
    
    return source
}