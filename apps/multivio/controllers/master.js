/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/

/** 
  @class

  This is the application's master controller. It serves as communication
  hub between the controllers of the different widgets.

  In this case it holds a reference to the currently selected object,
  in order to keep the thumbnail and tree views synchronized.

  @author mmo, che
  @extends SC.Objectcontroller
  @since 0.1.0
*/

Multivio.masterController = SC.ObjectController.create(
/** @scope Multivio.masterController.prototype */ {

  /**
    The url of the file_position object
  
    @property {file}
  */
  currentFile: null,
  
  /**
    The index of the file_position
  
    Now it's a number but it can be something else
  
    @property {position}
  */
  currentPosition: null,
  
  /**
    Boolean that say if files must be grouped or not
  */
  isGrouped: NO,
    
  /**
    The type of the current file
  
    @property {currentFileType}
  */
  currentFileType: null,
  
  /**
    Boolean that says if the application is in a loading state
    
    @default NO
  */
  isLoadingContent: NO,
  isNew: NO,

  zoomState: null,
  
  listOfFiles: null,
  currentFilePosition: null,
    
  /**
    Binds to the cdm fileMetadata

    @binding {String}
  */
  metadata: null,
  metadataBinding: SC.Binding.oneWay("Multivio.CDM.fileMetadata"),
  
  physicalStructure: null,
  physicalStructureBinding: SC.Binding.oneWay("Multivio.CDM.physicalStructure"),
  
  /**
    The number of the currently selected search result.
    If none selected, this value is -1.
  
    @property {currentSearchResultSelectionIndex}
  */
  currentSearchResultSelectionIndex: -1,
  
  /**
    The url of the file selected for the search scope. 
    
    This value is stored here to keep track of the 
    scope when navigating search results on all files
    and we need to switch files (this information would
    be lost when the search controller is reinitialised
    after a change of the current file).
  
    @property {currentSearchFile}
  */
  currentSearchFile: null,
   
  /**
    Initialize masterController. Get the referer (the url given to multivio) 
    of the document and set it as the currentFile
  */
  initialize: function () {
    // change application state
    Multivio.makeFirstResponder(Multivio.WAITING);
    this.listOfFiles = null;
    this.isGrouped = NO;
    var reference = Multivio.CDM.getReferer();
    this.set('currentFile', reference);
    Multivio.CDM.getPhysicalstructure(reference);
    this.zoomState = Multivio.configurator.get('zoomParameters').initState;
    Multivio.logger.info('masterController initialized');
  },
  
  /**
    Reset variables
  */
  reset: function () {
    this.set('currentFile', null);
    this.set('currentPosition', null);
    this.set('currentFileType', null);
  },

  /**
    Multivio.CDM.metadata has changed.Set new type.
  
    @observe metadata
  */
  metadataDidChange: function () {
    var meta = this.get('metadata');
    if (!SC.none(meta)) { 
      var cf = this.get('currentFile');
      var currentMeta = this.get('metadata')[cf];
      if (currentMeta !== -1) {
        Multivio.sendAction('fileMetadataDidChange', cf);
        this.set('currentFileType', currentMeta.mime);
      }
    }
  }.observes('metadata'),
  
  /**
     Multivio.CDM.physicalStructure has changed. Set list of file.

     @observe metadata
   */
  physicalStructureDidChange: function () {
    var ph = this.get('physicalStructure');
    if (!SC.none(ph)) {
      var refPh = this.get('physicalStructure')[Multivio.CDM.getReferer()];
      if (refPh !== -1 && SC.none(this.listOfFiles)) {
        if (refPh.length !== 1) {
          this.listOfFiles = [];
          for (var i = 0; i < refPh.length; i++) {
            this.listOfFiles[i] = refPh[i];
          }
          this.currentFilePosition = 0;
        } 
      }
    }
  }.observes('physicalStructure'),
  
  currentFilePositionDidChange: function () {
    this.currentFileType = null;
    var newFilePos =  this.get('currentFilePosition');
    var newFile = this.listOfFiles[newFilePos];
    this.set('currentFile', newFile.url);
  }.observes('currentFilePosition'),
  
  setCurrentFilePosition: function (fileUrl) {
    if (!SC.none(this.listOfFiles)) {
      for (var i = 0; i < this.listOfFiles.length; i++) {
        if (this.listOfFiles[i].url === fileUrl) {
          this.set('currentFilePosition', i);
          break;
        }
      }
    }
  },
  
  /**
    Set current position to 1 or to the initial position
  */
  selectFirstPosition: function () {
    var newPos = Multivio.configurator.get('initialPosition');
    if (this.get('isGrouped')) {
      if (newPos < 1 || newPos > this.listOfFiles.length) {
        newPos = 1;
      }
      this.set('currentPosition', newPos);
    }
    else {
      this.set('currentPosition', newPos);
      if (newPos !== 1) {
        Multivio.configurator.set('initialPosition', 1);
      }
    }
    Multivio.logger.debug('MasterController set currentPosition 1');
  },
  
  /**
     Set current position to the max
   */
  selectLastPosition: function () {
    var cur = this.get('currentFile');
    var curM = this.get('metadata')[cur];
    if (!SC.none(curM.nPages)) {
      this.set('currentPosition', curM.nPages);
    }
    else {
      this.set('currentPosition', this.get('physicalStructure')[cur].length);
    }
  },
  
  /**
    Select the first file of the Document and set currentfile with this value
  */ 
  selectFirstFile: function () {
    var initDoc = Multivio.configurator.get('initialFile');
    if (initDoc === 1) {
      // get logical structure of the document
      var logSt = Multivio.CDM.getLogicalStructure(this.get('currentFile'));
      if (!SC.none(logSt)) {
        var validUrl = logSt[0].file_position.url;
        // if a file_position has no url we need to get the next file_position 
        if (SC.none(validUrl)) {
          var childs = logSt[0].childs;
          for (var i = 0; i < childs.length; i++) {
            var temp = childs[i];  
            if (!SC.none(temp.file_position.url)) {
              validUrl = temp.file_position.url;
              break;
            }
          }
        }
        this.set('currentFile', validUrl);
      }
      else {
        // get physical structure
        var phSt = Multivio.CDM.getPhysicalstructure(this.get('currentFile'));
        this.set('currentFile', phSt[0].url);
      }
    }
    else {
      var listOfDoc = Multivio.CDM.getPhysicalstructure(Multivio.CDM.getReferer());
      // if initialDocNr is too small or too big select the first document
      if (initDoc < 1 || initDoc > listOfDoc.length) {
        initDoc = 0;
      }
      else {
        initDoc--;
      }
      var newDoc = listOfDoc[initDoc].url;
      this.set('currentFile', newDoc);  
    }
  },
  
  /**
    Initialize new controllers depending of the currentFileType
  
    @observes currentFileType
  */
  currentFileTypeDidChange: function () {
    var ct = this.get('currentFileType');
    var cf = this.get('currentFile');
    var listOfControllerss = Multivio.layoutController.getListOfControllers(ct);
    
    for (var i = 0; i < listOfControllerss.length; i++) {
      var oneController = listOfControllerss[i];
      Multivio[oneController].initialize(cf);
      // if we need zoomController set it state
      if (oneController === 'zoomController') {
        Multivio.zoomController.setZoomState(this.zoomState);
      }
    }
  }.observes('currentFileType'),
  
  /**
    A new file has been selected, retrieves metadata for it
  
    @observes currentFile
  */ 
  currentFileDidChange: function () {
    if (!SC.none(this.get('currentFile'))) {
      this.set('isNew', YES);
      // TODO: why not this.set('currentFileType', null) ?
      this.currentFileType = null;
      this.set('currentPosition', null);
      var cf = this.get('currentFile');
      this.setCurrentFilePosition(cf);
      var meta = Multivio.CDM.getFileMetadata(cf);
      // meta === -1 => fileMetadata not in the client wait until fileMetadata
      // is available => metadataDidChange
      if (meta !== -1) {
        this.set('currentFileType', meta.mime);
      }
    }
  }.observes('currentFile'),
  
  /**
    isLoadingContent has changed, show the navigation view
  
    @observes isLoadingContent
  */
  isLoadingContentDidChange: function () {
    var prop = this.get('isLoadingContent');
    // if isLoading, show waiting
    if (prop) {
      Multivio.getPath('views.mainContentView.navigation').showWaiting();
    }
    //else remove waiting or replace it with the name of the file and the position
    else {
      if (this.get('isNew')) {
        var fileName = 'unknown';
        if (this.get('isGrouped')) {
          var phys = Multivio.CDM.getPhysicalstructure(Multivio.CDM.getReferer());
          var pos = this.get('currentPosition');
          if (!SC.none(pos)) {
            Multivio.getPath('views.mainContentView.navigation').
                showView(phys[pos - 1].label, pos + '/' + phys.length);
            this.set('isNew', NO);
          }
        }
        else {
          if (SC.none(this.listOfFiles) || this.listOfFiles.length === 0) {
            fileName = undefined;
          }
          else {
            for (var i = 0; i < this.listOfFiles.length; i++) {
              if (this.listOfFiles[i].url === this.get('currentFile')) {
                fileName = this.listOfFiles[i].label;
                break;
              }
            }
          }
          var max = Multivio.CDM.getFileMetadata(this.get('currentFile')).nPages;
          if (SC.none(max)) {
            if (!SC.none(this.listOfFiles)) {
              max = this.listOfFiles.length;
            }
            else {
              max = 1;
            }
          }
          if (!SC.none(this.get('currentPosition'))) {
            var page = this.get('currentPosition') + '/' + max;
            Multivio.getPath('views.mainContentView.navigation').
                showView(fileName, page);
            this.set('isNew', NO);
          }
        }
      }
      else {
        Multivio.getPath('views.mainContentView.navigation').hideView();
      }
    }
  }.observes('isLoadingContent'),
  
  /**
    CurrentPosition has changed. This method is only used to verify 
    that synchronisation works fine.
  
    @observe currentPosition
  */
  currentPositionDidChange: function () {
    if (!SC.none(this.get('currentPosition'))) {
      this.set('isNew', YES);
    }
    console.info('currentPosition did Change....');
    console.info('new Val = ' + this.get('currentPosition'));
  }.observes('currentPosition')
  
});
