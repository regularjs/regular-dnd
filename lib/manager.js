import ut from './util';
import Regular from 'regularjs';

let drops = {};
let dom = Regular.dom;
let tid = null;



function bindDrag(dragable, position){
  manager.drag = dragable;
  manager.startAt = position;
  if ( !ut.supportTouch ){
    dom.on( document, ut.MOUSE_MOVE, onmousemove );
    ut.once( document, ut.MOUSE_UP, onmouseup );
  }else{
    tid = setTimeout(function(){
      tid = null;
      dom.on( document, ut.MOUSE_MOVE, onmousemove );
      ut.once( document, ut.MOUSE_UP, onmouseup );
    }, 100)
    ut.once( document, ut.MOUSE_MOVE, function(ev){
      if(tid) clearTimeout(tid)
      tid = null;
    });
    ut.once( document, ut.MOUSE_UP, function(ev){
      if(tid) clearTimeout(tid)
      tid = null;
    });
  }
  manager.moved = false;
  
}

function addDrop(name, component){
  drops[name] = component
}

function delDrop(name){
  delete drops[name];
}


function getActiveDrop(drag, drops){
  let ret = [];
  for(let i in drops){
    let drop = drops[i];
    if(drag.validate(drop.data.name))  ret.push(drop)
  }
  return ret;
}


function testDrop(pageX, pageY){
  var drag = manager.drag;
  for(let i in drops){
    let drop = drops[i];
    if(!drag.validate(drop.data.name)) continue;
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
  if(+new Date - tid)
  if(!manager.drag) return

  ev.stopPropagation();
  ev.preventDefault();
  let placeholder = manager.drag.placeholder;

  if(/touch/.test(ev.type)) ev=ev.event.touches[0];


  let startAt = manager.startAt;

  let drag = manager.drag;
  let data = drag.data;

  if(!manager.moved ){

    if(ev.pageX ===startAt.left && ev.pageY ===startAt.top ) return;

    if(data.placeholder !== false){
      placeholder = drag.placeholder = drag.getPlaceholder(drag.node, drag.data);

      if(placeholder){

        placeholder.style.display = 'none';
        placeholder.style.zIndex = 1000;
        dom.inject( placeholder, document.body);

      }
    }
    manager.drag.$emit('dragstart', {position: startAt});
    var actives = getActiveDrop(drag, drops);
    manager.$emit('active', {drag: drag, drops: actives})
    actives.forEach(function(active){
      active.$emit('active', {drag: drag, drop: active})
    })
    manager.moved = true;

    manager.testDrop(ev.pageX, ev.pageY);
    return true;
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
    style.left = ev.pageX - startAt.left + startAt.origin.left + 'px';
    style.top = ev.pageY - startAt.top + startAt.origin.top + 'px';
  }
  manager.testDrop(ev.pageX, ev.pageY);
  let drop  = manager.drop;

  manager.drag.$emit('dragmove',  {
    drag,
    drop,
    position:{
      left: ev.pageX, 
      top: ev.pageY
    },
    origin: startAt.origin
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
    // 测试是否有viewport存在
    // var viewport = drop.data.viewport;

    // if( viewport ){
    //   var dimension = ut.getDimension(viewport);
      
    // }
    
  }
  return true
}

function onmouseup(ev){
  let drag = manager.drag;
  let startAt = manager.startAt;

  if(/touch/.test(ev.type)) ev=ev.event.changedTouches[0];

  dom.off( document, ut.MOUSE_MOVE, onmousemove );
  
  ev.stopPropagation();

  if(!manager.moved || (ev.pageX ===startAt.left && ev.pageY ===startAt.top ) ) return;
  if(drag){
    let drop = manager.drop;
    drag.$emit('dragend', {
      drop,
      drag,
      position: {
        left: ev.pageX, 
        top: ev.pageY
      },
      origin:startAt.origin
      event:ev,
    });
    if(drop){
      drop.$emit('dragdrop', {
        drag,
        drop,
        position: {
          left: ev.pageX-drop.offset.left,
          top: ev.pageY-drop.offset.top
        },
        event:ev
      })
    }
    manager.$emit('dragend', {drag: manager.drag, drop: manager.drop, event: ev})
    manager.drop = null;
    manager.drag = null
  }
}

var Manager = Regular.extend({
  drops,
  addDrop,
  delDrop,
  testDrop,

  bindDrag,

  onmousemove,
  onmouseup
});

var manager = new Manager;





export default manager;
