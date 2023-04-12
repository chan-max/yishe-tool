import { AmbientLight, PointLight, Scene } from "three";

export function setBasicLight(scene:Scene){
    const alight = new AmbientLight( 0xffffff,0.6 );
    scene.add( alight );
    var light = new PointLight(0xffffff, 1, 30, 1);
    light.position.set(0,0,20);
    scene.add(light);
}