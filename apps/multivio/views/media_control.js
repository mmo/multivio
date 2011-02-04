/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file license.js
==============================================================================
*/

/**
  @class

  @author che
  @extends SC.View
  @since 0.4.0
*/
Multivio.mediaControlView = Multivio.FileButtonView.extend({
  
  childViews: 'backgroundView '.w(),
  
   target: null,
   
   videoView: null,
   
   leftHandleInset:null,   //until a bug in the way bindings are handled is fixed, these have to be defined
   rightHandleInset:null,  //for the slider to be able to have its notEmpty bindings function and drop in
   handleWidth:null,       //their placeholder values.
 
   playObserver: function(){
     if(this.getPath('target.paused')){
       this.get('childViews')[0].get('playButton').set('icon', 'go_forward_new');
     }else{
       this.get('childViews')[0].get('playButton').set('icon', 'native_size_new');
     }
   }.observes('*target.paused'),
    
  backgroundView: SC.View.design({
    layout: { left: 0, right: 0, top: 0, bottom: 0 },
    classNames: 'mvo-front-view-transparent',
    
   
  
    childViews: 'playButton timeValue progressView volumeButton volumeView volumeValue'.w(),
    //classNames: 'sc-media-controls',
  

  
    playButton: SC.ButtonView.design({
      title: '',
      titleMinWidth: 35,
      icon: 'go_forward_new',
      noStyle: YES,
      layout: { top: 5, left: 5, width: 32, height:32 },
      action: "playPause",
      targetBinding: "*owner.parentView.target",
      renderStyle: 'renderImage',
      theme: 'mvo-button'
    }),
    /*timeLabel:SC.LabelView.design({
      layout:{top: 28, left: 20, width: 40, height: 15},
      textAlign: SC.ALIGN_RIGHT,
      value: 'Time:'
    }),*/
    timeValue:SC.LabelView.design({
      layout:{top: 28, left: 25, width: 78, height: 15},
      layerId: 'time',
      valueBinding: '*owner.parentView.videoView.time'
    }),
    
    progressView: SC.MediaSlider.design({
      layout: { top: 12, left: 50, right: 100, height:20 },
      value:0,
      minimum: 0,
      step:0.05,
      valueBinding: "*owner.parentView.target.currentTime" ,
      maximumBinding: "*owner.parentView.target.duration",
      mediaViewBinding: "*owner.parentView.target"
    }),
    
    volumeButton: SC.ButtonView.design({
      title: '',
      titleMinWidth: 35,
      icon: 'sound_new',
      noStyle: YES,
      layout: { top: 5, right: 60, width: 32, height:32 },
      action: "playPause",
      targetBinding: "*owner.parentView.target",
      renderStyle: 'renderImage',
      theme: 'mvo-button'
    }),
    
    
    volumeView: SC.MediaSlider.design({
      layout: { top: 12, width:50, right: 10, height:20 },
      value:0,
      minimum: 0,
      step:0.1
    }),
    
    volumeValue:SC.LabelView.design({
      layout:{top: 28, right: 30, width: 30, height: 15},
      valueBinding: '*owner.videoView.volume'
    })
  })
});