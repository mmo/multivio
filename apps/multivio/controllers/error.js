/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/

/**
  @class

  Controller for error message handling.

  @author {che, mmo}
  @extends {SC.ObjectController}
  @since {0.1.0}
*/

Multivio.errorController = SC.ObjectController.create(
/** @scope Multivio.errorController.prototype */ {

  /** @property {String} */
  errorCode: '',

  /** @property {String} */
  errorMessage: '',

  /**
    @method

    Initialize the content of the controller

    @param {SC.RecordArray} nodes records of the Core Document Model
  */
  /*
  initialize: function (nodes) {
    this.set('content', nodes);
    Multivio.logger.info('errorController initialized');
  },
  */

  /**
    @method
    
    Return the serverMessage that contains infomation about the error
    
    @property {Hash} serverMessage
  */
  /*
  serverMessage: function () {
    return this.get('content').firstObject().get('serverMessage');
  }.property('content'),
  */


  setErrorData: function (code, message) {
    this.errorCode = code;
    this.errorMessage = message;
  },
  
  showDetails: function () {
    Multivio.usco.showAlertPaneInfo(
        '_Diagnosis'.loc(),
        this.errorCode + '\n\n' + this.errorMessage,
        '_Ok'.loc()
    );
  },
  
  relauchApplication: function () {
    Multivio.initializer._inputParametersDidChange();
  },

  mainText:
    '<div class="error-page">\n' +
    '<h2>' + '_Oops, Something went wrong!'.loc() + '</h2>\n' +
    '<h3>' + '_The application detected a problem.'.loc() + '</h3>\n' +
    '<h3>' + '_You can now:'.loc() + '</h3>\n' +
    '</div>'

});
