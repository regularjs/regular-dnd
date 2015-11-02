import manager from './manager';
import Regular from 'regularjs';
import Dropable from './Dropable';
import util from './util';

let dom = Regular.dom;

let Dragable = Regular.extend({

  name: 'dragable',

  template:'{#include this.$body}',

  config (data){

    let $outer = this.$outer;
    if( !($outer instanceof Dropable)) return 

    this.drop = $outer;

    $outer.$emit('add_drag', this);

  },

  init() {
    let data = this.data;
    let node = this.node = dom.element(this);

    dom.addClass(node, 'dragable');

    let body;

    this.$on('dragend', function(){
      if(!this.placeholder) return;
      dom.remove(this.placeholder)
      this.placeholder = null;
    })

    let handle = this.handle = data.handle && node.querySelector(data.handle) || node;


    dom.on(handle, 'mousedown' , function(ev){

      // disabled right-click
      if(ev.which !== 1) return;


        
      let pos = util.getPosition( node );

      manager.bindDrag(this, { left: ev.pageX - pos.left, top: ev.pageY - pos.top});

    }.bind(this))

  },
  getPlaceholder: function(node, key){
    return node.cloneNode(true)
  }

})

Dropable.Handler = Regular.extend({
  template: '{#inc this.$body}',
  config: function(){
    if(this.$outer instanceof Dropable){
      this.$outer.data.header = this;
    }
  }
})

export default Dragable;




