import Dropable from './Dropable';

var DropList = Dropable.extend({

  name: 'droplist',

  init(){
    this.supr();
    let data = this.data;
    let offsets = [];


    this.$on('dragenter', function(){
      let drags = data.drags;
      drags.forEach(function(drag){
        offsets.push(drag.getOffset())
      })
    })

    this.$on('dragleave', function(){

    })
    
    this.$on('dragmove', function(arg){
      
    })
  }
})
