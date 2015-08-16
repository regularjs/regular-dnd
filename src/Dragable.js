import manager from './manager';
import Regular from 'regularjs';
import Dropable from './Dropable';
import util from './util';

let dom = Regular.dom;

let Dragable = Regular.extend({

  name: 'dragable',

  template:'{#include this.$body}',

  config (){
    let $outer = this.$outer;
    if( !($outer instanceof Dropable)) return 

    let drags = $outer.data.drags;
    drags.push(this);

    this.$on('$destroy', () => util.remove(drags, this) );

  },

  init() {
    let data = this.data;
    let handle = this.handle = this.$getNode();

    let body;

    this.$on('dragend', function(){
      dom.remove(this.placeholder)
      this.placeholder = null;
    })

    dom.on(handle, 'mousedown' , function(ev){
      let placeholder = this.placeholder = handle.cloneNode(true);
      let pos = util.getPosition( handle );
      dom.inject( placeholder, document.body);
      placeholder.style.display = 'none';
      manager.bindDrag(this, { left: ev.pageX - pos.left, top: ev.pageY - pos.top});
    }.bind(this))

  },

  getOffset(){
    return util.getOffset(this.handle);
  }
})

export default Dragable;
