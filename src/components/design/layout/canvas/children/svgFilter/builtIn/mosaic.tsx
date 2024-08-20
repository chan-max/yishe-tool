
import { createFilter } from "..";
import { canvasStickerOptions } from "../../..";
import { createFeFlood, createFeFloodDefaultOptions } from "../effect/flood";
import { createFeComposite, createFeCompositeDefaultOptions, FeCompositeOperator } from '../effect/composite';
import { createFeTile, createFeTileDefaultOptions, } from "../effect/tile";
import { createFeMorphology, createFeMorphologyDefaultOptions, FeMorphologyOperator } from "../effect/morphology";

import { SvgFilterInput } from '../effect'



export function createMosaicFilter() {

    // return <filter id="mosaic">
    //     <feFlood x="4" y="4" height="2" width="2" />
    //     <feComposite width="8" height="8" />
    //     <feTile result="a" />
    //     <feComposite in="SourceGraphic" in2="a" operator="in" />
    //     <feMorphology operator="dilate" radius="4" />
    // </filter>



    let floodOptions = createFeFloodDefaultOptions()
    floodOptions.x.value = 2
    floodOptions.y.value = 2
    floodOptions.width.value = 2
    floodOptions.height.value = 2

    let compositeOptions = createFeCompositeDefaultOptions()
    compositeOptions.width.value = 4
    compositeOptions.height.value = 4



    let tileOptions = createFeTileDefaultOptions()
    tileOptions.result = 'a'

    let compositeOptions2 = {
        x: null,
        y: null,
        width: null,
        height: null,
        operator: FeCompositeOperator.In,
        in: SvgFilterInput.SourceGraphic,
        in2: 'a'
    }



    let morphologyOptions = createFeMorphologyDefaultOptions()
    morphologyOptions.radiusX.value = 2
    morphologyOptions.radiusY.value = 2
    morphologyOptions.operator = FeMorphologyOperator.DILATE


    return createFilter({ id: 'mosaic' }, [
        createFeFlood(floodOptions),
        createFeComposite(compositeOptions),
        createFeTile(tileOptions),
        createFeComposite(compositeOptions2),
        createFeMorphology(morphologyOptions)
    ])
}

