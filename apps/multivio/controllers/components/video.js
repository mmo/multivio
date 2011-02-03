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
  
  initialize: function(url) {
    console.info('initialize '+url);
    Multivio.sendAction('addComponent', 'videoController');
    
    var prop = Multivio.getPath('views.mainContentView.content.playerContainer.propertiesView1');
    var ttr = Multivio.getPath('views.mainContentView.content.playerContainer.videoPlayer1.canvasView');
    prop.set('videoView', ttr);
    
    var sl = Multivio.getPath('views.mainContentView.content.slider1');
      sl.set('target', ttr);
  }
  
}) ;