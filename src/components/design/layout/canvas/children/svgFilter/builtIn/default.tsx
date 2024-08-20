

import { createFilter } from "..";


/*
    无任何效果的滤镜
*/

export function createDefaultFilter() {
    return createFilter({ id: 'default' }, [])
}

