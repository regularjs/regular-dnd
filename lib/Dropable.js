import manager from './manager';
import Regular from 'regularjs';
import util from './util';


let Dropable = Regular.extend({
  name: 'dropable',

  template: `
  <div class='{klass} dropable'>{#inc this.$body}</div>
  `,

  config( data ){
    manager.addDrop( data.name, this );
  },

  init( data ){
    this.node = Regular.dom.element(this);
  },

  destroy(){
    manager.delDrop( this.data.name, this );
    this.supr();
  }

})

export default Dropable

