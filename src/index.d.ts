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




declare module '*.svg' {
    const content: any;
    export default content;
}

declare module 'wordcloud' {
    const WordCloud: any;
    export default WordCloud;
}
