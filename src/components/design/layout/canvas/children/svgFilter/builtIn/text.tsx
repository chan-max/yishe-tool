

/*
    文字类相关
*/

export const neonLightsText = ({
    filterId
}) => {
   return <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" seed="2" stitchTiles="stitch" result="turbulence" />
        <feColorMatrix type="matrix" values="1 0 0 0 0
0 1 0 0 0
0 0 1 0 0
0 0 0 0 1" in="turbulence" result="colormatrix" />
        <feColorMatrix type="saturate" values="4" in="colormatrix" result="colormatrix1" />
        <feComponentTransfer in="colormatrix1" result="componentTransfer">
            <feFuncR type="table" tableValues="1 0 -1" />
            <feFuncG type="table" tableValues="1 0 1" />
            <feFuncB type="table" tableValues="1 -1 1" />
            <feFuncA type="identity" />
        </feComponentTransfer>
        <feMorphology operator="dilate" radius="2 2" in="SourceAlpha" result="morphology" />
        <feFlood flood-color="#ffffff" flood-opacity="1" result="flood" />
        <feComposite in="flood" in2="morphology" operator="in" result="composite" />
        <feComposite in="composite" in2="SourceAlpha" operator="out" result="composite1" />
        <feComposite in="componentTransfer" in2="composite1" operator="in" result="composite2" />
    </filter>
}