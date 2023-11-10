

export function setFullscreen(isFullscreen: boolean): void {
    let doc:any = document.documentElement;
        if (isFullscreen) {
            if(doc.requestFullscreen) {
                doc.requestFullscreen();
            }
        } else {
            if(document.exitFullscreen && doc.fullscreen) {
                document.exitFullscreen();
            }
        }
}