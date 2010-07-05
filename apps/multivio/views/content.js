/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/

/** 
  @class

  The mainContentView of the application

  @author che
  @extends SC.ScrollView
  @since 0.1.0
*/
Multivio.ContentView = SC.ScrollView.extend(
/** @scope Multivio.ContentView.prototype */ {

  /**
    Binds to the zoomValue in the zoom controller.
    
    @binding {Number}
   */
  zoomValueBinding:
      SC.Binding.oneWay('Multivio.zoomController.current_zoom_factor'), 

  /**
    Binds to the currentValue in the rotate controller.
    
    @binding {Number}
   */      
  rotateValueBinding:
      SC.Binding.oneWay('Multivio.rotateController.currentValue'),
 
  /**
    Binds to the imageController's selection

    @binding {url}
  */ 
  selection: null,
  selectionBinding: 'Multivio.imageController.selection', 
  
  /**
    Binds to the preference value in the zoomController
  
    @binding {string}
  */
  preferenceBinding: 
      SC.Binding.oneWay('Multivio.zoomController.currentPreference'),
  localPreference: 'Full', 

  /**
  Content properties
  
  frameWidth {Number} the view width
  frameHeight {Number} the view height
  isAnImage {Boolean}
  maxImageWidth {Number} native image width (only for image)
  maxImageHeight {Number} native image height (only for image)
  */
  
  frameWidth: 0,
  frameHeight: 0,
  
  isAnImage: NO, 
  
  maxImageWidth: 2000,
  maxImageHeight: 2000, 
  
  /**
    ZoomFactor has changed.

    @observes zoomValue
  */  
  doZoom: function () {
    var zoomVal = this.get('zoomValue');
    if (!SC.none(zoomVal)) { 
      this._loadNewImage();
    }
  }.observes('zoomValue'),
  
  /**
    User's preference has changed. Reset initial values.
    
    @observes preference
  */
  preferenceDidChange: function () {
    var pref = this.get('preference');
    //if pref === null set localPreference
    if (!SC.none(pref)) {
      this.set('zoomValue', 1);
      this.localPreference = pref;
      //if its an image and the user chooses native size, 
      //disabled zoom+ and zoom-
      if (pref === Multivio.zoomController.HUNDREDPERCENT && this.isAnImage) {
        Multivio.zoomController.disabledZoomOut();
        Multivio.zoomController.disabledZoomIn();
      }
      this._loadNewImage();
    }
  }.observes('preference'),
  
  /**
  Rotate value has changed. Load new image.
  
  @observes rotateValue
  */
  rotateValueDidChange: function () {
    var rot = this.get('rotateValue');
    if (!SC.none(rot)) {
      this._loadNewImage();
    }
  }.observes('rotateValue'), 
  

  /**
    Callback applied after image has been loaded.
    
    It puts the image in the container and adjust the size 
    (add & remove scroll), then check if zoom buttons.

    @private
    @callback SC.imageCache.load
    @param {String} url
    @param {Image} image
  */
  _adjustSize: function (url, image) {
    SC.RunLoop.begin();
    var content =  this.get('contentView');
    content.set('value', url);
      
    content.adjust('left', undefined);
    content.adjust('width', image.width);
    content.adjust('height', image.height);
      
    this._checkZoomButton();
    SC.RunLoop.end();
    Multivio.logger.debug('ContentView#_adjustSize');
  },
  
  /**
  Verify if zoom buttons should be disabled 
  */
  _checkZoomButton: function () {
    //get maximum and minimum between width & height
    var max = this.get('frameHeight');
    var min = this.get('frameWidth');
    if (min > max) {
      max = this.get('frameWidth');
      min = this.get('frameHeight');
    }
    
    //verify zoom+ 
    var zoomStep = Multivio.zoomController.get('_current_zoom_step');
    zoomStep++;
    var zoomFactor = Multivio.zoomController._zoomFactorForStep(zoomStep);
    var newSize = max * zoomFactor;
    if (this.isAnImage) {
      var maxImage = this.maxImageHeight;
      if (maxImage < this.maxImageWidth) {
        maxImage = this.maxImageWidth;
      }
      if (newSize > maxImage) {
        Multivio.zoomController.disabledZoomOut();
      }
      else {
        var pref = this.localPreference;
        if (pref !== Multivio.zoomController.HUNDREDPERCENT && 
            newSize > Multivio.zoomController.ZOOM_MAX_SIZE) {
          Multivio.zoomController.disabledZoomOut();
        }
      }
    }
    else {
      //its a pdf
      if (newSize > Multivio.zoomController.ZOOM_MAX_SIZE) {
        Multivio.zoomController.disabledZoomOut();
      }
    }
    
    //verify zoom-
    zoomStep = zoomStep - 2;
    zoomFactor = Multivio.zoomController._zoomFactorForStep(zoomStep);
    newSize = min * zoomFactor;
    if (newSize < Multivio.zoomController.ZOOM_MIN_SIZE) {
      Multivio.zoomController.disabledZoomIn();
    } 
  },
  
  /**
  Load the image with adapated width and height 
  
  */
  _loadNewImage: function () {
    var currentSelection = this.get('selection');
    if (!SC.none(currentSelection) && !SC.none(currentSelection.firstObject())) {
      var defaultUrl = currentSelection.firstObject().url;
      var zoomVal = this.get('zoomValue');
    
      //if its the first image get width and height of the view
      var tempWidth = this.get('frameWidth');
      var tempHeight = this.get('frameHeight');
      if (tempWidth === 0) {
        tempWidth = this.get('frame').width;
        tempHeight = this.get('frame').height;
        this.set('frameWidth', tempWidth);
        this.set('frameHeight', tempHeight);
      }
    
      //calculate the image.width to ask to the server 
      var newWidth = zoomVal * tempWidth;
      var newUrl = '';
      var rot = this.get('rotateValue');
      
      switch (this.localPreference) {
      case Multivio.zoomController.FULLPAGE:
        var newHeight = zoomVal * tempHeight;
        newUrl = defaultUrl.replace('width=1500', 'max_width=' +
            parseInt(newWidth, 10) + '&max_height=' + parseInt(newHeight, 10) +
            '&angle=' + rot);
        break;
        
      case Multivio.zoomController.PAGEWIDTH:
        newUrl = defaultUrl.replace('width=1500', 'max_width=' +
            parseInt(newWidth, 10) + '&angle=' + rot);
        break;
        
      case Multivio.zoomController.HUNDREDPERCENT:
        if (this.isAnImage) {
          newUrl = defaultUrl.replace('width=1500', 'max_width=' +
              this.maxImageWidth + '&max_height=' + this.maxImageHeight + 
              '&angle=' + rot);
        }
        else {
          //TO DO size for pdf or new call 
          Multivio.log.error('no native size for a PDF');
        }
        break;
      }
      Multivio.logger.debug('load new image %@'.fmt(newUrl));
      SC.imageCache.loadImage(newUrl, this, this._adjustSize);
    }
  },
 
  /**
    Updates value by observing changes in the imageController's
    selection
    
    @private
    @observes selection
  */ 
  _selectionDidChange: function () {
    var currentSelection = this.get('selection');
    if (!SC.none(currentSelection) && !SC.none(currentSelection.firstObject())) {
      var defaultUrl = currentSelection.firstObject().url;
      var index = defaultUrl.indexOf('&url=');
      var metadataUrl = defaultUrl.substring(index + 5, defaultUrl.length);
      //TO DO get metadata to know if it's a pdf or an image
      //if image get maxW & maxH
      if (defaultUrl.indexOf('pdf') === -1) {
        //TO DO retreive native size of the image in the metadata
        this.isAnImage = YES;
      }
      else {
        Multivio.zoomController.disabledNativePreference();
      }
      //new selection rotate value = 0
      this.rotateValue = 0;
      Multivio.rotateController.resetRotateValue();
      this._loadNewImage();
    }
    
  }.observes('selection')

});
