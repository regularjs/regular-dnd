import ut from './util';
import Regular from 'regularjs';

let drops = {};
let dom = Regular.dom;

function bindDrag(dragable, position){
  manager.drag = dragable;
  manager.startAt = position;
  ut.once( document.body, 'mouseup', onmouseup );
  dom.on( document.body, 'mousemove', onmousemove );
}

function addDrop(name, component){
  drops[name] = component
}

function delDrop(name){
  delete drops[name];
}

function testDrop(pageX, pageY){
  var drag = manager.drag;
  var target = drag.data.target || [];
  for(let i in drops){
    let drop = drops[i];
    if(target.indexOf(drop.data.name) === -1) continue;
    let offset = drop.offset = ut.getDimension(drop.node);
    let test = offset.left < pageX && pageX < (offset.width + offset.left) &&
          offset.top < pageY && pageY < (offset.height + offset.top);

    if(!drop.data.entered){

      if(test){

        drop.data.entered = drag;
        drop.$emit('dragenter', { drag : drag, drop: drop } )
        manager.drop = drop;
        return;
      }

    }else if( !test ){
      drop.data.entered = null;
      drop.$emit('dragleave', { drag: drag, drop: drop})
      manager.drop = null;
    }
    
  }
}


function onmousemove(ev){
  if(!manager.drag) return
  let placeholder = manager.drag.placeholder;
  let style = placeholder.style;
  let startAt = manager.startAt;

  // if (window.getSelection) {
  //    window.getSelection().removeAllRanges();
  // } else if (window.document.selection) {
  //    window.document.selection.empty();
  // }


  style.position = 'absolute';
  style.display = '';
  style.left = ev.pageX - startAt.left + 'px';
  style.top = ev.pageY - startAt.top + 'px';
  manager.testDrop(ev.pageX, ev.pageY);
  let drop  = manager.drop;

  if(drop) {
    drop.$emit('dragmove', {
      left: ev.pageX,
      top: ev.pageX
    })
  }
}

function onmouseup(ev){
  let node = manager.drag;

  dom.off(document.body, 'mousemove', onmousemove)
  if(node){
    node.$emit('dragend');
    let drops = manager.drops;
    manager.drag = null
    for(let i in drops){
      let drop = drops[i];
      let entered = drop.data.entered;
      drop.$update('entered', null);
      if(entered){
        drop.$emit('dragdrop', entered)
      }
    }
  }
}

var manager = {

  drops,
  addDrop,
  delDrop,
  testDrop,

  bindDrag,

  onmousemove,
  onmouseup
}





export default manager;
