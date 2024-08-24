declare module '@/api'

declare module '@/components'


declare module "*.vue" {
    import Vue from "@/vue";
    export default Vue;
}


interface Window {
    mc: any;
    utils: any
}

declare enum Typess {
    a = 666
}
