/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2013 RERO
  License:    See file license.js
==============================================================================
*/

/**
  @class

  View that contains a miniature overview of the content

  @author che
  @extends View
  @since 0.4.0
*/
Multivio.OverviewView = SC.View.extend( 
/** @scope Multivio.OverviewView.prototype */ {
  
  /**
    Link to a controler of type SC.ObjectController.
    
    This controller need to have:
      - an url for the image
      - an object that contains the visble part of the reference image
      - an object that contains the scrolls 
  */
  overviewController: null,
  
  /**
    name of the children
  */
  imageOverview: null,
  visiblePartIndicator: null,
  
  /**
    Overwrite createChildView to create the view
  */
  createChildViews: function () {
    var childViews = [];
    
    this.imageOverview = this.createChildView(
      SC.ImageView.design({
        useImageCache: NO,
        borderStyle: SC.BORDER_NONE 
      })
    );
    childViews.push(this.imageOverview);
    
    this.visiblePartIndicator = this.createChildView(
      SC.View.design({
        classNames: 'mvo-glass-zone highlight-pane-pan'
      })
    );
    childViews.push(this.visiblePartIndicator);
    
    this.set('childViews', childViews);
  },
  
  /**
    Diplay the received image
  
    @param {String} url the url of the image
    @param {Object} image the image to display or an error
  */
  displayImage: function (url, image) {
    this.imageOverview.set('layout', {
      centerX: 0,
      centerY: 0,
      width: image.width,
      height: image.height
    });
    this.imageOverview.set('value', url);
    this.drawZone();
  },
  
  /**
    Create the childView that represents the visible part 
    of the reference image
  */
  drawZone: function () {
    var vpart = this.get('overviewController').get('visiblePart'),
        frame = this.imageOverview.get('frame');

    if (!SC.none(vpart)) {
      var percentHeight = vpart.height;
      var percentWidth = vpart.width;
      var positionX = Math.round(frame.width * vpart.x);
      var positionY = Math.round(frame.height * vpart.y);

      if (!SC.none(percentHeight)) {
        this.visiblePartIndicator.set('layout', {
          top:    frame.y - 3 + positionY,
          left:   frame.x - 3 + positionX,
          width:  frame.width * percentWidth,
          height: frame.height * percentHeight
        });
      }
    }
  },
  
  /**
    The position or the size of the visible part of the reference image
    has changed. Call the drawZone methode to update it.
    
    @observes .overviewController.visiblePart 
  */
  zonePositionOrSizeDidChange: function () {
    this.drawZone();
  }.observes('.overviewController.visiblePart'),
  
  /**
    The reference image did change. Load the new image.
    
    @observes .overviewController.thumbnailUrl 
  */
  thumbnailUrlDidChange: function () {
    var newUrl = this.get('overviewController').get('thumbnailUrl');
    SC.imageCache.loadImage(newUrl, this, this.displayImage);
  }.observes('.overviewController.thumbnailUrl'),
  
  /**
    On mouse down save mouse pointer position and 
    set isDragging property to YES.
    
    @param {SC.Event} Event fired
  */
  mouseDown: function (evt) {
    // save mouse pointer loc for later use
    this._mouseDownInfo = {
      pageX: evt.pageX,
      pageY: evt.pageY,
      left: this.visiblePartIndicator.get('layout').left,
      top: this.visiblePartIndicator.get('layout').top
    };
    return YES;
  },

  /**
    On mouse up set isDragging property to false

    @param {SC.Event} Event fired
  */  
  mouseUp: function (evt) {
    // apply one more time to set final position
    this.mouseDragged(evt); 
    return YES; // handled!
  },

  /**
    On mouse dragged set the scrolls of the controller

    @param {SC.Event} Event fired
  */
  mouseDragged: function (evt) {
    var info = this._mouseDownInfo;
    var newLeft = info.left + (evt.pageX - info.pageX);
    var newTop = info.top + (evt.pageY - info.pageY);
    
    var newScroll = {};
    var ioframe = this.imageOverview.get('frame');
    var iolayout = this.imageOverview.get('layout');
    newScroll.horizontal = (newLeft - ioframe.x + 3) / iolayout.width;
    newScroll.vertical = (newTop - ioframe.y + 3) / iolayout.height;
    
    this.get('overviewController').set('scrolls', newScroll);
    return YES;
  }

});