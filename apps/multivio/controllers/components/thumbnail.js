/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/

/** @class

  This controller manages the behavior of the thumbnail view. It depends on
  the master controller.

  @extends {SC.ArrayController}
  @since {0.1.0}
*/

Multivio.thumbnailController = SC.ArrayController.create(
/** @scope Multivio.thumbnailController.prototype */ {

  allowsMultipleSelection: NO,

  /**
    @binding {Multivio.coreDocumentNode}
    
    Binds to the masterController's masterSelection
   */
  masterSelectionBinding: "Multivio.masterController.masterSelection",

  /**
    A conversion table (masterSelectionId -> thumbnail) used to quickly
    determine the thumbnail associated with a certain master selection
    
    @private
   */
  _cdmNodeToThumbnail: {},
  
  /**
    @method

    Initialize this controller, create the sub-model and then set its content

    @param {SC.RecordArray} nodes are records of the CDM
  */
  initialize: function (nodes) {
    this._createSubmodel(nodes);
    var thumbnails = Multivio.store.find(Multivio.Thumbnail);
    this.set('content', thumbnails);
    Multivio.logger.info('thumbnailController initialized');
  },
  
  /**
    @method

    Create the thumbnail submodel from the CDM nodes
    
    @private
    @param {SC.RecordArray} nodes are records of the CDM    
  */
  _createSubmodel: function (nodes) {
    nodes.forEach(function (node) {
      if (node.get('isLeafNode')) {
        var cdmNodeId = node.get('guid');
        var id = 'f%@'.fmt(cdmNodeId);
        // to create thumbnail url
        var defaultUrl = node.get('urlDefault');
        var sequenceNumber = node.get('sequenceNumber');
        var pageNumber = !SC.none(node.get('localSequenceNumber')) ?
            node.get('localSequenceNumber') : 0;
        var thumbnailUrl = Multivio.configurator.getThumbnailUrl(
            defaultUrl, pageNumber);

        var thumbnailHash = {
            guid: id,
            url: thumbnailUrl,
            pageNumber: sequenceNumber,
            coreDocumentNode: cdmNodeId
          };
        // create a new thumbnail record
        var thumbnail = Multivio.store.createRecord(
          Multivio.Thumbnail, thumbnailHash, id);
      }
    });
  },
   
  /**
    @method 
    
    If 'content' changes, the _cdmNodeToThumbnail conversion table must
    be updated (this should only happen once, during aplication setup)

    @observes {content}    
    @private
  */
  _contentDidChange: function () {
    var newTable = {};
    var thumbnails = Multivio.store.find(Multivio.Thumbnail);
    if (thumbnails && thumbnails.isEnumerable) {
      for (var i = 0; i < thumbnails.length(); i++) {
        var thumbnail = thumbnails.objectAt(i);
        var coreDocumentNodeId = thumbnail.get('coreDocumentNode').get('guid');
        newTable[coreDocumentNodeId] = thumbnail;
      }
    }
    this.set('_cdmNodeToThumbnail', newTable);

  }.observes('content'),

  /**
    @method
    
    Updates the masterSelection binding if the currently selected thumbnail 
    has changed.
    
    @observes {selection}
  */
  _selectionDidChange: function () {
    if (!SC.none(this.get('selection')) &&
        !SC.none(this.get('selection').firstObject())) {
      var coreDocumentNode =
          this.get('selection').firstObject().get('coreDocumentNode');
      // make sure the selection has actually changed, (to avoid loopbacks)
      if (SC.none(this.get('masterSelection')) ||
          coreDocumentNode !== this.get('masterSelection')) {
        SC.RunLoop.begin();
        this.set('masterSelection', coreDocumentNode);
        SC.RunLoop.end();

        Multivio.logger.debug('thumbnailController#_selectionDidChange: %@'.
            fmt(this.get('selection').firstObject()));
      }
    }
  }.observes('selection'),

  /**
    @method
    
    Updates thumbnail selection by observing changes in master controller's
    master selection
    
    @observes {masterSelection}
  */
  _masterSelectionDidChange: function () {
    // find the thumbnail that corresponds to the current master selection
    var currentThumbnailSelection = !SC.none(this.get('selection')) ?
        this.get('selection').firstObject() : undefined;
    var currentMasterSelection = this.get('masterSelection');
    if (!SC.none(currentMasterSelection)) {
      var newThumbnail =
          this.get('_cdmNodeToThumbnail')[currentMasterSelection.get('guid')];

      // make sure the selection has actually changed, (to avoid loopbacks)
      if (SC.none(currentThumbnailSelection) ||
          (newThumbnail && newThumbnail !== currentThumbnailSelection)) {
        SC.RunLoop.begin();
        this.set('selection', SC.SelectionSet.create().addObject(newThumbnail));
        SC.RunLoop.end();
        Multivio.logger.debug('thumbnailController#_masterSelectionDidChange: %@'.
            fmt(this.get('masterSelection').get('guid')));
      }
    }
  }.observes('masterSelection')

});