/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/

/**
  @class

  View that contains thumbnails

  @author che
  @extends SC.ScrollView
  @since 0.1.0
*/

//VideoApp.numberProps=13;
//Multivio.video.numberProps = 13;

//VideoApp.VideoProperties = SC.View.extend({
  Multivio.videoView = SC.View.extend({
    
  numberProps: 13, 
  
  videoView: null,
  classNames: ['properties'],
  childViews : 'currentTimeLabel currentTimeValue durationLabel durationValue volumeLabel volumeValue sizeLabel sizeValue loadedDataLabel loadedDataValue pausedLabel pausedValue loadedLabel loadedValue endedLabel endedValue canPlayLabel canPlayValue videoWidthLabel videoWidthValue videoHeightLabel  videoHeightValue captionsEnabledLabel captionsEnabledValue timeLabel timeValue'.w(),
  
  currentTimeLabel:SC.LabelView.design({
    layout:{top: 0, left:0, width: 0.5, height: 15},
    textAlign: SC.ALIGN_RIGHT,
    value: 'Current Time:'
  }),
  currentTimeValue:SC.LabelView.design({
    layout:{top: 0, right:0, width: 0.4, height: 15},
    valueBinding: '*owner.videoView.currentTime'
  }),
  durationLabel:SC.LabelView.design({
    layout:{top: 15, left:0, width: 0.5, height: 15},
    textAlign: SC.ALIGN_RIGHT,
    value: 'Duration:'
  }),
  durationValue:SC.LabelView.design({
    layout:{top: 15, right:0, width: 0.4, height: 15},
    valueBinding: '*owner.videoView.duration'
  }),
  volumeLabel:SC.LabelView.design({
    layout:{top: 30, left:0, width: 0.5, height: 15},
    textAlign: SC.ALIGN_RIGHT,
    value: 'Volume:'
  }),
  volumeValue:SC.LabelView.design({
    layout:{top: 30, right:0, width: 0.4, height: 15},
    valueBinding: '*owner.videoView.volume'
  }),
  sizeLabel:SC.LabelView.design({
    layout:{top: 45, left:0, width: 0.5, height: 15},
    textAlign: SC.ALIGN_RIGHT,
    value: 'Size:'
  }),
  sizeValue:SC.LabelView.design({
    layout:{top: 45, right:0, width: 0.4, height: 15},
    valueBinding: '*owner.videoView.size'
  }),
  loadedDataLabel:SC.LabelView.design({
    layout:{top: 60, left:0, width: 0.5, height: 15},
    textAlign: SC.ALIGN_RIGHT,
    value: 'LoadedData:'
  }),
  loadedDataValue:SC.LabelView.design({
    layout:{top: 60, right:0, width: 0.4, height: 15},
    valueBinding: '*owner.videoView.loadedTimeRanges'
  }),
  pausedLabel:SC.LabelView.design({
    layout:{top: 75, left:0, width: 0.5, height: 15},
    textAlign: SC.ALIGN_RIGHT,
    value: 'Paused:'
  }),
  pausedValue:SC.LabelView.design({
    layout:{top: 75, right:0, width: 0.4, height: 15},
    valueBinding: '*owner.videoView.paused'
  }),
  loadedLabel:SC.LabelView.design({
    layout:{top: 90, left:0, width: 0.5, height: 15},
    textAlign: SC.ALIGN_RIGHT,
    value: 'Loaded:'
  }),
  loadedValue:SC.LabelView.design({
    layout:{top: 90, right:0, width: 0.4, height: 15},
    valueBinding: '*owner.videoView.loaded'
  }),
  endedLabel:SC.LabelView.design({
    layout:{top: 105, left:0, width: 0.5, height: 15},
    textAlign: SC.ALIGN_RIGHT,
    value: 'Ended:'
  }),
  endedValue:SC.LabelView.design({
    layout:{top: 105, right:0, width: 0.4, height: 15},
    valueBinding: '*owner.videoView.ended'
  }),
  canPlayLabel:SC.LabelView.design({
    layout:{top: 120, left:0, width: 0.5, height: 15},
    textAlign: SC.ALIGN_RIGHT,
    value: 'Can Play:'
  }),
  canPlayValue:SC.LabelView.design({
    layout:{top: 120, right:0, width: 0.4, height: 15},
    valueBinding: '*owner.videoView.canPlay'
  }),
  videoWidthLabel:SC.LabelView.design({
    layout:{top: 135, left:0, width: 0.5, height: 15},
    textAlign: SC.ALIGN_RIGHT,
    value: 'Width:'
  }),
  videoWidthValue:SC.LabelView.design({
    layout:{top: 135, right:0, width: 0.4, height: 15},
    valueBinding: '*owner.videoView.videoWidth'
  }),
  videoHeightLabel:SC.LabelView.design({
    layout:{top: 150, left:0, width: 0.5, height: 15},
    textAlign: SC.ALIGN_RIGHT,
    value: 'Height:'
  }),
  videoHeightValue:SC.LabelView.design({
    layout:{top: 150, right:0, width: 0.4, height: 15},
    valueBinding: '*owner.videoView.videoHeight'
  }),
  captionsEnabledLabel:SC.LabelView.design({
    layout:{top: 165, left:0, width: 0.5, height: 15},
    textAlign: SC.ALIGN_RIGHT,
    value: 'Captions:'
  }),
  captionsEnabledValue:SC.LabelView.design({
    layout:{top: 165, right:0, width: 0.4, height: 15},
    valueBinding: '*owner.videoView.captionsEnabled'
  }),
  timeLabel:SC.LabelView.design({
    layout:{top: 180, left:0, width: 0.5, height: 15},
    textAlign: SC.ALIGN_RIGHT,
    value: 'Time:'
  }),
  timeValue:SC.LabelView.design({
    layout:{top: 180, right:0, width: 0.4, height: 15},
    valueBinding: '*owner.videoView.time'
  })
});