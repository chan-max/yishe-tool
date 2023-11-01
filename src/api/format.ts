import { resolveFilePath} from "./url";


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

    source.baseModelUrl = resolveFilePath( source.baseModelUrl)

    
    source?.decals?.forEach((decal) => {
        decal.src = resolveFilePath(decal.src)
    })
    return source
}