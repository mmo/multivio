/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2013 RERO
  License:    See file license.js
==============================================================================
*/

/** 
  @class

  This controller manages all palettes.   the behavior of the palette view. 
  A palette view is a non modal view.

  @author che
  @extends SC.ObjectController
  @since 0.3.0
*/

Multivio.paletteController = SC.ObjectController.create(
/** @scope Multivio.paletteController.prototype */ {
  
  /**
    local variable used by this controller
  */
  defaultWidth: 320,
  activeButton: null,
  thumbnailSize: null,
  metadata: null,
  
  /**
    Possible values: 'list' (default), 'grid'
  */
  thumbnailMode: 'list',
  
  /**
    variable used to say if the toolbar has been actived by the user.
    If the button is active the toolbar is permanently visible
  */
  isHorizontalToolbarActive: null,
  
  /**
    Return the layout position of the palette
    
    @param {Boolean} withDefaultWidth says if used the default width or not
  */
  paletteLayout: function (withDefaultWidth) {
    // retreive the view to append the palette
    var toAppend = Multivio.getPath('views.mainContentView.content');
    var viewHeight = toAppend.get('frame').height;
    var layout = [];
    layout.bottom = 150;
    layout.top = toAppend.get('parentView').get('frame').y + 5;
    layout.left = toAppend.get('frame').x + 15;
    if (withDefaultWidth) {
      layout.width = this.defaultWidth;
    }
    else {
      layout.width = 150;
    }
    return layout;
  },
  
  /**
    Metatada button has been pressed show the metadataPalette or hide it
    
    @param {SC.Button} button the button pressed
  */
  showMetadata: function (button) {
    var metadataView = Multivio.getPath('views.metadataPalette');
    // no activeButton => show this palette
    if (SC.none(this.activeButton)) {
      button.set('isActive', YES);
      this.activeButton = button;
      // retreive the view and set the content
      var textField = metadataView.get('contentView').get('childViews')[0];
      textField.set('content', Multivio.metadataController.getTranslatedMetadata());
      metadataView.set('layout', this.paletteLayout(YES));
      metadataView.append();
    }
    else {
      // if activeButton = button close the palette
      // else replace the palette by an other one
      if (this.activeButton !== button) {
        this.hidePalette(this.activeButton.name);
        this.showOtherPalette(button);
      }
      else {
        this.activeButton = null;
        metadataView.remove();
      }
    }
  },
  
  /**
    Thumbnails button has been pressed show the thumbnailPalette or hide it
    
    @param {SC.Button} button the button pressed
  */
  showThumbnails: function (button) {
    var thumbnailsView = Multivio.getPath('views.thumbnailPalette');
    // no activeButton => show this palette
    if (SC.none(this.activeButton)) {
      button.set('isActive', YES);
      this.activeButton = button;
      thumbnailsView.set('layout', this.paletteLayout(NO));
      this.adjustThumbnailLayoutToMode();
      thumbnailsView.append();
    }
    else {
      if (this.activeButton !== button) {
        this.hidePalette(this.activeButton.name);
        this.showOtherPalette(button);
      }
      else {
        this.activeButton = null;
        thumbnailsView.remove();
      }
    }
  },

  /**
    Adjust the thumbnail palette layout according to current mode:
    'list' or 'grid'
  */
  adjustThumbnailLayoutToMode: function () {
    var pal = Multivio.getPath('views.thumbnailPalette');
    var vframe = Multivio.getPath('views.mainContentView.frame');
    var layout = pal.layout;
    if (this.get('thumbnailMode') === 'list') {
      delete layout['right'];
      layout['width'] = 150;
    }
    else {
      // put the thumbnail grid width at 60% of the whole window width
      delete layout['width'];
      layout['right'] = parseInt(vframe.width * 0.4, 10);
    }
    pal.adjust(layout);
  }.observes('thumbnailMode', 'Multivio.views.mainContentView.frame'),

  /**
    Tree button has been pressed show the treePalette or hide it
    
    @param {SC.Button} button the button pressed
  */
  showTree: function (button) {
    var treeView = null;
    if (Multivio.masterController.get('isTimeNavigationEnabled')) {
      Multivio.calendarController.initialize();
      treeView = Multivio.getPath('views.calendarPalette');
    }
    else {
      treeView = Multivio.getPath('views.treePalette');
    }
    // no activeButton => show this palette
    if (SC.none(this.activeButton)) {
      button.set('isActive', YES);
      this.activeButton = button;
      treeView.set('layout', this.paletteLayout(YES));
      treeView.append();
    }
    else {
      if (this.activeButton !== button) {
        this.hidePalette(this.activeButton.name);
        this.showOtherPalette(button);
      }
      else {
        this.activeButton = null;
        treeView.remove();
      }
    }
  },
  
  /**
    Tree button has been pressed show the treePalette or hide it

    @param {SC.Button} button the button pressed
  */
  showSearch: function (button) {
    var searchPalette = Multivio.getPath('views.searchPalette');
    // no activeButton => show this palette
    if (SC.none(this.activeButton)) {
      button.set('isActive', YES);
      this.activeButton = button;
      searchPalette.set('layout', this.paletteLayout(YES));
      searchPalette.append();
    }
    else {
      if (this.activeButton !== button) {
        this.hidePalette(this.activeButton.name);
        this.showOtherPalette(button);
      }
      else {
        this.activeButton = null;
        searchPalette.remove();
      }
    }
  },
  
	/**
    Help button has been pressed show the helpPalette or hide it
    
    @param {SC.Button} button the button pressed
  */
  showHelpPalette: function (button) {
    var helpView = Multivio.getPath('views.helpPalette');
    // no activeButton => show this palette
    if (SC.none(this.activeButton)) {
      button.set('isActive', YES);
      this.activeButton = button;
      helpView.set('layout', this.paletteLayout(YES));
      helpView.append();
    }
    else {
      // if activeButton = button close the palette
      // else replace the palette by an other one
      if (this.activeButton !== button) {
        this.hidePalette(this.activeButton.name);
        this.showOtherPalette(button);
      }
      else {
        this.activeButton = null;
        helpView.remove();
      }
    }
  },
  
  /**
    Toolbar button has been pressed show the toolbar or hide it

    @param {SC.Button} button the button pressed
  */
  showHorizontalToolbar: function (button) {
    if (this.isHorizontalToolbarActive) {
      button.set('isActive', NO);
      this.set('isHorizontalToolbarActive', NO);
    }
    else {
      button.set('isActive', YES);
      this.set('isHorizontalToolbarActive', YES);
    } 
  },
  
  /**
    Download button has been pressed retreive currentFile url and is size

    @param {SC.Button} button the button pressed
  */
  downloadFile: function (button) {
    var fileName =  Multivio.masterController.get('currentFile');
    if (Multivio.masterController.isGrouped) {
      var phys = Multivio.CDM.getPhysicalstructure(Multivio.CDM.getReferer());
      var pos = Multivio.masterController.get('currentPosition');
      fileName = phys[pos - 1].url;
    }
    
    var fileMeta = Multivio.CDM.getFileMetadata(fileName);
    // if metadata is already in the CDM show the paneInfo
    if (fileMeta !== -1) {
      this.showPaneInfo();
    }
    // else create a binding
    else {
      this.bind('metadata', SC.Binding.from('Multivio.CDM.fileMetadata').oneWay());
    }
  },
  
  /**
    Show a paneInfo with the size of the file and ask the user if he want
    to download the file.
  */
  showPaneInfo: function () {
    var fileName =  Multivio.masterController.get('currentFile');
    if (Multivio.masterController.isGrouped) {
      var phys = Multivio.CDM.getPhysicalstructure(Multivio.CDM.getReferer());
      var pos = Multivio.masterController.get('currentPosition');
      fileName = phys[pos - 1].url;
    }

    var fileMeta = SC.none(this.get('metadata')) ? 
        Multivio.CDM.getFileMetadata(fileName) : this.get('metadata')[fileName];
        
    if (!SC.none(fileMeta) && fileMeta !== -1) {
      var fileSize = SC.none(fileMeta.fileSize) ? -1 : fileMeta.fileSize;
      if (fileSize === -1) {
        fileSize = '_unknown size'.loc();
      }
      else {
        // convert file size
        switch (true) {
        case fileSize <= 1024:
          fileSize = fileSize + ' Bytes';
          break;
        
        case fileSize <= Math.pow(1024, 2):
          fileSize = (fileSize / 1024);
          fileSize = Math.round(fileSize * 100) / 100;
          fileSize = fileSize + ' KB';
          break;
          
        case fileSize <= Math.pow(1024, 3):
          fileSize = (fileSize / Math.pow(1024, 2));
          fileSize = Math.round(fileSize * 100) / 100;
          fileSize = fileSize + ' MB';
          break;
        
        case fileSize <= Math.pow(1024, 4):
          fileSize = (fileSize / Math.pow(1024, 3));
          fileSize = Math.round(fileSize * 100) / 100;
          fileSize = fileSize + ' GB';
          break;
        
        default:
          Multivio.logger.info('bigger than GB');
          break;
        }
      }
    
      Multivio.usco.showAlertPaneInfoWithController(
          '_File download'.loc(),
          fileName + ' (' + fileSize + ')',
          '_Continue'.loc(),
          '_Cancel'.loc(),
          this);
    }
  }.observes('metadata'),
  
  /**
    Delegate method of the Multivio.usco.showAlertPaneInfoWithController
    Open a new tab with the file to download or do nothing.
    
    @param {String} pane the pane instance
    @param {} status
  */
  alertPaneDidDismiss: function (pane, status) {
    switch (status) {
    case SC.BUTTON1_STATUS:
      var file = pane.description;
      file = file.split('(');
      // open a new tab to download the file
      window.open(file[0]);
      break;
        
    case SC.BUTTON2_STATUS:
      break;
    }
  },
  
  /**
    Call the method to show the good palette
    
    @param {SC.Button} the button pressed
  */
  showOtherPalette: function (button) {
    switch (button.name) {
    case 'thumbnails': 
      this.showThumbnails(button);
      break;
    case 'tree':
      this.showTree(button);
      break;
    case 'metadata':
      this.showMetadata(button);
      break;
    case 'search':
      this.showSearch(button);
      break;
    case 'help':
      /* CAUTION: Do not use the name showHelp() - it's a JavaScript reserved word */
      this.showHelpPalette(button);
      break;
      
    default:
      Multivio.logger.info('unable to show the selected palette');
      break;
    }
  },
  
  /**
    Remove the palette that contains this button
    
    @param {String} the name of the button
  */
  hidePalette: function (buttonName) {
    if (!SC.none(this.activeButton)) {
      var hidePaletteName = !SC.none(buttonName) ? buttonName : 
          this.activeButton.name;
      
      switch (hidePaletteName) {
      case 'thumbnails': 
        Multivio.getPath('views.thumbnailPalette').remove(); 
        break;
      case 'tree':
        if (Multivio.masterController.get('isTimeNavigationEnabled')) {
          Multivio.getPath('views.calendarPalette').remove();
        }
        else {
          Multivio.getPath('views.treePalette').remove();
        }
        break;
      case 'metadata':
        Multivio.getPath('views.metadataPalette').remove();
        break;
      case 'search':
        Multivio.getPath('views.searchPalette').remove();
        break;
      case 'help':
        Multivio.getPath('views.helpPalette').remove();
        break;
      
      default:
        Multivio.logger.info('unable to hide the selected palette');
        break;
      }
      this.activeButton.set('isActive', NO);
      this.activeButton = null;
    }
  }

});
