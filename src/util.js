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
  for(let i of list){
    if(list[i] === item){
      list.splice(i)
      return i;
    }
  }
  return -1;
}

function once(elem, ev, handle){
  function real(){ handle.apply(this, arguments); dom.off(elem, ev, real) }
  dom.on( elem, ev, real );
}

export default {

  getPosition,
  getOffset,
  getDimension,

  remove,

  once
}

