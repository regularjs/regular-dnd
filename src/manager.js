import ut from './util';
import Regular from 'regularjs';

let drops = {};
let dom = Regular.dom;

function bindDrag(dragable, position){
  manager.drag = dragable;
  manager.startAt = position;
  ut.once( document, 'mouseup', onmouseup );
  dom.on( document, 'mousemove', onmousemove );
  manager.moved = false;
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

    if(manager.drop !== drop){

      if(test){


        drop.$emit('dragenter', { drag : drag, drop: drop } )
        
        if(manager.drop){
          manager.drop.$emit('dragleave', { drag: drag, drop: drop });
        }
        manager.drop = drop;
        return;
      }

    }else if( !test ){

      drop.$emit('dragleave', { drag: drag, drop: drop})
      manager.drop = null;
    }
    
  }
}


function onmousemove(ev){
  if(!manager.drag) return
  ev.preventDefault();
  let placeholder = manager.drag.placeholder;


  let startAt = manager.startAt;

  let drag = manager.drag;
  let data = drag.data;

  if(!manager.moved){

    if(data.placeholder !== false){
      placeholder = drag.placeholder = drag.getPlaceholder(drag.node, drag.data);

      if(placeholder){

        placeholder.style.display = 'none';
        placeholder.style.zIndex = 1000;
        dom.inject( placeholder, document.body);

      }
    }
    manager.drag.$emit('dragstart', startAt);
    manager.moved = true;
  }

  if (window.getSelection) {
     window.getSelection().removeAllRanges();
  } else if (window.document.selection) {
     window.document.selection.empty();
  }

  if(placeholder){
    let style = placeholder.style;
    style.position = 'absolute';
    style.display = '';
    style.left = ev.pageX - startAt.left + 'px';
    style.top = ev.pageY - startAt.top + 'px';
  }
  manager.testDrop(ev.pageX, ev.pageY);
  let drop  = manager.drop;

  manager.drag.$emit('dragmove',  {
    drag,
    drop,
    position:{
      left: ev.pageX, 
      top: ev.pageY
    }
  });

  if(drop) {
    drop.$emit('dragmove', {
      drop,
      drag,
      position:{
        left: ev.pageX-drop.offset.left,
        top: ev.pageY-drop.offset.top
      }
    })
  }
}

function onmouseup(ev){
  let drag = manager.drag;

  dom.off(document, 'mousemove', onmousemove)

  if(!manager.moved) return;
  if(drag){
    let drop = manager.drop;
    drag.$emit('dragend', {
      drop,
      drag,
      position: {
        left: ev.pageX, 
        top: ev.pageY
      }
    });
    if(drop){
      drop.$emit('dragdrop', {
        drag,
        drop,
        position: {
          left: ev.pageX-drop.offset.left,
          top: ev.pageY-drop.offset.top
        }
      })
    }
    manager.drop = null;
    manager.drag = null
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
