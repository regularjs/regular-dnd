import manager from './manager';
import Regular from 'regularjs';
import Dropable from './Dropable';
import util from './util';

let toStr = ({}).toString;
let dom = Regular.dom;

let Dragable = Regular.extend({

  name: 'dragable',

  template:'{#include this.$body}',

  config (data){

    let $outer = this.$outer;
    let target = data.target;

    if(toStr.call(target) === '[object RegExp]') {
      this._validateTarget = function(name){
        return target.test(name);
      }
    }else if(Array.isArray(target)){
      this._validateTarget = function(name){
        return target.indexOf(name) !== -1;
      }
    }else if(typeof target === 'function'){
      this._validateTarget = function(name){
        return !!target(name)
      }
    }



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


    let callback = function(ev){



      var isTouch = /touch/.test(ev.type);
      if( isTouch ){
        ev= ev.event.touches[0];
      } 
      // disabled right-click
      else if (ev.which !== 1) return;

      ev.stopPropagation()

        
      let pos = util.getPosition( node );

      manager.bindDrag(this, { left: ev.pageX , top: ev.pageY, origin: pos});


    }.bind(this)

    if(!this.data.disabled){
      dom.on(handle, util.MOUSE_DOWN , callback)
    }
    

  },

  _validateTarget: function(){
    return false;
  },

  validate: function(name){

    return this._validateTarget(name);

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




