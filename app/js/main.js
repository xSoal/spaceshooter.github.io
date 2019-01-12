
import CanvasGame from './CanvasGame';
import GameComponentsInit from './GameComponentsInit/index.js';

window.addEventListener('load', ()=>{
    let canvasGame = new CanvasGame( document.querySelector('.canvas__ctx') );
    new GameComponentsInit( canvasGame );
});


