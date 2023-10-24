import { toDevFilePath } from "./url";


export function format1stf(source:any){

    if(!source){
        return {}
    }

    if(typeof source === 'string'){
        try{
            source = JSON.parse(source);
        }catch(e){
            return {}
        }
    }

    source.baseModelUrl = toDevFilePath( source.baseModelUrl)

    return source
}