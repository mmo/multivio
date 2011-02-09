/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/

/**
  @class

  This controller is used to calculate the rotation angle.

  @author che
  @extends SC.ObjectController
  @since 0.2.0
*/
Multivio.videoController = SC.ObjectController.create(
/** @scope Multivio.rotateController.prototype */ {

  videoSource: null,
  
  initialize: function (url) {
    console.info('initialize ' + url);
    Multivio.sendAction('addComponent', 'videoController');
    
    //var prop = Multivio.getPath('views.mainContentView.content.playerContainer.propertiesView1');
    var ttr = Multivio.getPath('views.mainContentView.content.playerContainer.videoPlayer1.canvasView');
    //prop.set('videoView', ttr);
    
    var sl = Multivio.getPath('views.mainContentView.content.slider');
    sl.set('target', ttr);
    sl.set('videoView', ttr);
    
    // initialize video source depending on browser
    // TODO : assumptions are hard-coded based on current video format support
    if (SC.browser.mozilla) {
      this.set('videoSource', 'http://mirror.cessen.com/blender.org/peach/trailer/trailer_400p.ogg');
    }
    else if (SC.browser.safari) {
      this.set('videoSource', 'http://mirror.cessen.com/blender.org/peach/trailer/trailer_iphone.m4v');
    }
  }

});