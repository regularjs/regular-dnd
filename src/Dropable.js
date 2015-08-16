import manager from './manager';
import Regular from 'regularjs';
import util from './util';


let Dropable = Regular.extend({
  name: 'dropable',

  template: `
  <div class='{klass} dropable'>{#inc this.$body}</div>
  `,

  config( data ){
    this.data.drags = this.data.drags || [];
    manager.addDrop( data.name, this );
  },

  init( data ){
    this.node = this.$getNode();
  },

  destroy(){
    manager.delDrop( this.data.name, this );
    this.supr();
  }

})

export default Dropable

