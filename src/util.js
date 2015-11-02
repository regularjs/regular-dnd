/**
 * util for regular-dnd
 */
import Regular from 'regularjs'

let win = window;
let extend = Regular.util.extend;
let dom = Regular.dom;

function getPosition( elem ){
  let 
    doc = elem && elem.ownerDocument,
    docElem = doc.documentElement,
    body = doc.body, 

    box = elem.getBoundingClientRect? 
      elem.getBoundingClientRect(): { top: 0, left: 0 },

    clientTop = docElem.clientTop || body.clientTop || 0,
    clientLeft = docElem.clientLeft || body.clientLeft || 0,
    scrollTop = win.pageYOffset || docElem.scrollTop,
    scrollLeft = win.pageXOffset || docElem.scrollLeft;

  return {
    top: box.top + scrollTop - clientTop,
    left: box.left + scrollLeft - clientLeft
  }
}

function getOffset( elem ){

  let width = elem.offsetWidth;
  let height = elem.offsetHeight;

  return { width, height }
}

function getDimension( elem ){

  return extend( getOffset(elem), getPosition(elem) )
}

function remove(list, item){
  if(!list) return -1;
  for(let i =0, len = list.length; i < len; i++){
    if(list[i] === item){
      list.splice(i, 1)
      return i;
    }
  }
  return -1;
}

function once(elem, ev, handle){
  function real(){ handle.apply(this, arguments); dom.off(elem, ev, real) }
  dom.on( elem, ev, real );
}

function isInRect(position, dim){
  if(!position || !dim) return false;

  return position.left > dim.left && (position.left < dim.left + dim.width) &&
    position.top > dim.top && (position.top < dim.top + dim.height);

}

function getInRanges(offset, ranges){

  for(let len = ranges.length; len-- ;){
    let rg = ranges[len];

    if(isInRect(offset, rg)){

      return {
        index: len,
        dimension: {
          width: rg.width,
          height: rg.height,
          left: offset.left - rg.left,
          top: offset.top - rg.top
        }
      }

    }
  }
}

function getDirection(){

}




export default {

  getPosition,
  getOffset,
  getDimension,

  isInRect,
  getInRanges,
  getDirection,

  remove,

  extend,

  once
}

