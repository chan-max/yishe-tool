import { useMagicKeys ,whenever} from '@vueuse/core'

const useKeys = useMagicKeys({
  passive: false,
  onEventFired:(e) => {
     // e.preventDefault()
  }
})

export function onShortcutTrigger(keys:string|string[],callback){
  if(typeof keys === 'string'){
    keys = [keys]
  }
  keys.forEach((key) => {
    whenever(useKeys[key],callback)
  })
}