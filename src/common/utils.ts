


function sleep(ms) {
    return new Promise((resolve, reject) => {
        return setTimeout(() => {
            resolve(void 0)
        }, ms);
    })
}


const CM2PX: number = (function () {
    var el = document.createElement('input');
    var body = document.body;
    el.setAttribute("style", "width:1cm !important;height:1cm !important;border-width:0px !important;padding:0px !important;margin:0px !important;");
    el.id = "id_" + new Date().getTime();
    el.type = "hidden";
    body.appendChild(el);
    var targetEle = document.getElementById(el.id);
    return Number(window.getComputedStyle(targetEle).width.match(/^\d+\.?\d*/)[0]);
}());


const isPromise = (val) => {
    return val.catch && val.then;
};


export function formatUrl(url) {
    if (!url) {
        return
    }
    url = url.trim();
    return url.startsWith('http') ? url : 'https://' + url;
}








class Utils {

    IN2CM = 2.539999918

    CM2PX = CM2PX //  1厘米等于多少像素

    sleep = sleep

    formatUrl = formatUrl

    isPromise = isPromise


    // 单位转换
    pxToCM(px) {
        return px / this.CM2PX
    }

    pxToMM(px) {
        return px / this.CM2PX * 10
    }

    pxToIn(px) {
        return px / this.CM2PX / this.IN2CM
    }

}


export default new Utils()
