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

  leftHandleInset: null,   //until a bug in the way bindings are handled is fixed, these have to be defined
  rightHandleInset: null,  //for the slider to be able to have its notEmpty bindings function and drop in
  handleWidth: null,       //their placeholder values.

  playObserver: function () {
    if (this.getPath('target.paused')) {
      this.get('childViews')[0].get('playButton').set('icon', 'play_new');
    } else {
      this.get('childViews')[0].get('playButton').set('icon', 'pause_new');
    }
  }.observes('*target.paused'),
    
  backgroundView: SC.View.design({
    layout: { left: 0, right: 0, top: 0, bottom: 0 },
    classNames: 'mvo-front-view-transparent',

    childViews: [
      //'firstPageButton',
      'playButton',
      'progressView',
      'timeValue',
      'soundVolumeButton',
      //'lastPageButton',
      'zoomFullScreenButton'
      //'zoomNativeSizeButton'
    ],
    //classNames: 'sc-media-controls',


    firstPageButton: SC.ButtonView.design({
      layout: { centerX: -438, centerY: 0, width: 32, height: 32 },
      titleMinWidth : 0,
      needsEllipsis: NO,
      toolTip: '_FirstPage'.loc(),
      renderStyle: "renderImage",
      icon: 'jump_backwards_new',
      theme: 'mvo-button',
      isEnabledBinding: "Multivio.navigationController.isFirstEnabled",
      target: "Multivio.navigationController", 
      action: "goToFirstPage"
    }),

    playButton: SC.ButtonView.design({
      layout: { centerX: -338, centerY: 0, width: 32, height: 32 },
      titleMinWidth : 0,
      needsEllipsis: NO,
      toolTip: '_PlayPause'.loc(),
      renderStyle: "renderImage",
      icon: 'play_new',
      theme: 'mvo-button',
      isEnabledBinding: "Multivio.navigationController.isFirstEnabled",
      targetBinding: "*owner.parentView.target",
      action: "playPause"
    }),

    progressView: SC.MediaSlider.design({
      layout: { centerX: -64, centerY: 5, width: 500, height: 24 },
      value: 0,
      minimum: 0,
      step: 0.05,
      valueBinding: "*owner.parentView.target.currentTime",
      maximumBinding: "*owner.parentView.target.duration",
      mediaViewBinding: "*owner.parentView.target"
    }),

    timeValue: SC.LabelView.design({
      layout: { centerX: 246, centerY: 0, width: 96, height: 16 },
      layerId: 'time',
      valueBinding: '*owner.parentView.videoView.time'
    }),

    soundVolumeButton: SC.ButtonView.design({
      layout: { centerX: 306, centerY: 0, width: 32, height: 32 },
      title: '',
      titleMinWidth: 35,
      icon: 'sound_volume_new',
      noStyle: YES,
      renderStyle: 'renderImage',
      theme: 'mvo-button'
    }),

    lastPageButton: SC.ButtonView.design({
      layout: { centerX: 318, centerY: 0, width: 32, height: 32 },
      titleMinWidth : 0,
      needsEllipsis: NO,
      toolTip: '_LastPage'.loc(),
      renderStyle: "renderImage",
      icon: 'jump_forward_new',
      theme: 'mvo-button',
      isEnabledBinding: "Multivio.navigationController.isLastEnabled",
      target: "Multivio.navigationController", 
      action: "goToLastPage"
    }),

    zoomFullScreenButton: SC.ButtonView.design({
      layout: { centerX: 338, centerY: 0, width: 32, height: 32 },
      titleMinWidth : 0,
      needsEllipsis: NO,
      name: 'Full',
      toolTip: '_FullScreen'.loc(),
      renderStyle: "renderImage",
      icon: 'full_screen_new',
      theme: 'mvo-button'
      /*
      isEnabledBinding: "Multivio.zoomController.isStateEnabled",
      target: "Multivio.zoomController",
      action: "setPredefinedZoom"
      */
    }),

    zoomNativeSizeButton: SC.ButtonView.design({
      layout: { centerX: 338, centerY: 0, width: 32, height: 32 },
      titleMinWidth : 0,
      needsEllipsis: NO,
      name: 'Native',
      toolTip: '_NativeSize'.loc(),
      renderStyle: "renderImage",
      icon: 'native_size_new',
      theme: 'mvo-button'
      /*
      isEnabledBinding: "Multivio.zoomController.isStateEnabled",
      target: "Multivio.zoomController",
      action: "setPredefinedZoom"
      */
    })
  })
});