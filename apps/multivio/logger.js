/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/

//require('configurator');
//require('models/core_document_node');
 
/**
Define Log levels
*/
Multivio.LOG_ERROR = 40000;
Multivio.LOG_WARN = 30000;
Multivio.LOG_INFO = 20000;
Multivio.LOG_DEBUG = 10000;


/**
  @class
 
  Object logger.
 
  @author {che, fca, mmo}
  @extends {Object}
  @since {0.1.0}
*/
 
Multivio.logger = SC.Object.create(
/** @scope Multivio.logger.prototype */ {
 
  _errorLogger: undefined,
  _warningLogger: undefined,
  _infoLogger: undefined,
  _debugLogger: undefined,
 
  loggers: [],
 
  /**
    @method
 
    Initialize loggers, set level and add appender(s)

    We use 4 loggers => error, warning, info, debug; each one corresponds to a
    log level. The use of several loggers, one per log level, instead of a
    single global logger, is because log4js does not allow different appenders
    to receive different log levels.
  */
  init: function () {

    // force deactivation of console logging associated with Ajax loggging,
    // as done by Log4js (this overrides the last lines of code in log4js.js)
    var log4jsLogger = Log4js.getLogger("Log4js");
    log4jsLogger.setLevel(Log4js.Level.OFF);

    // initialize loggers by level
    this._errorLogger = Log4js.getLogger("error");
    this._errorLogger.setLevel(Log4js.Level.ERROR);
    this.loggers.push(this._errorLogger);
    
    this._warningLogger = Log4js.getLogger("warning");
    this._warningLogger.setLevel(Log4js.Level.WARN);
    this.loggers.push(this._warningLogger);
    
    this._infoLogger = Log4js.getLogger("info");
    this._infoLogger.setLevel(Log4js.Level.INFO);
    this.loggers.push(this._infoLogger);
    
    this._debugLogger = Log4js.getLogger("debug");
    this._debugLogger.setLevel(Log4js.Level.DEBUG);
    this.loggers.push(this._debugLogger);
 
    // create appenders according to the configuration in Multivio.CONFIG.log
    // (see file core.js)
    var appenders = Multivio.configurator.getPath('logParameters.log');
    for (var appender in appenders) {
      if (appenders.hasOwnProperty(appender)) {
        var level = Multivio.get(appenders[appender]);
        var appenderObject = undefined;
        switch (appender) {
        // TODO check if the ajax appender is removed in case a server is not available
        case 'ajax':
          appenderObject = new Log4js.AjaxAppender(
              Multivio.configurator.getPath('logParameters.logFile'));
          appenderObject.setLayout(new Log4js.BasicLayout());
          //appenderObject.setLayout(new Log4js.JSONLayout());
          break;
        case 'console' :
          appenderObject = new Log4js.ConsoleAppender(false);
          break;
        case 'browserConsole':
          appenderObject = new Log4js.BrowserConsoleAppender(true);
          break;
        }
        if (appenderObject) this._attachAppender(appenderObject, level);
      }
    }
    this.info('end of logger.init');
  },
  
  /**
    @method
 
    Attach the given appender to the appropriate log level logger
 
    It also attaches it to all log levels above it. For example, if log level =
    LOG_INFO, then the appender should also be attached to warningLogger and
    errorLogger.
 
    @private
    @param {Object} appender
    @param {Number} level
  */
  _attachAppender: function (appender, level) {
    for (var i = 0; i < this.loggers.length; i++) {
      var aLogger = this.loggers[i];
      if (aLogger.level.level >= level) {
        aLogger.addAppender(appender);
      }
    }
  },
  
  /**
    @method
    
    Create a log of error
    
    @param {String} message
  */
  error: function (message) {
    try {
      this._errorLogger.error(message);
    }
    catch (e) {
      this.logException(e, 'Error writing log');
    }
  },

  /**
    @method
    
    Create a log of warning
    
    @param {String} message
  */ 
  warning: function (message) {
    try {
      this._warningLogger.warn(message);
    }
    catch (e) {
      this.logException(e, 'Error writing log');
    }
  },
 
  /**
    @method
    
    Create a log of info
    
    @param {String} message
  */
  info: function (message) {
    try {
      this._infoLogger.info(message);
    }
    catch (e) {
      this.logException(e, 'Error writing log');
    }
  },
 
  /**
    @method
    
    Create a log of debug
    
    @param {String} message
  */
  debug: function (message) {
    try {
      this._debugLogger.debug(message);
    }
    catch (e) {
      this.logException(e, 'Error writing log');
    }
  },
 
  /**
    @method
    
    Create a log of logException
    
    @param {String} message
  */ 
  logException: function (ex, localMessage) {
    var exDetails = "{\n";
    for (var key in ex) {
      if (ex.hasOwnProperty(key)) {
        exDetails += "\t## '%@': '%@',\n ".fmt(key, ex[key]);
      }
    }
    if (exDetails.length > 4) {
      // remove ", " at the end of last property
      exDetails = exDetails.substring(0, exDetails.length - 4);
    }
    exDetails += "}\n";
    var completeMessage = 
        'Exception caught, with the following ' +
        'local message: "%@"\n'.loc(localMessage) +
        'Exception details: \n' +
        '%@\n'.loc(exDetails);
    try {

      Multivio.errorController.setErrorData(
          'some code', completeMessage);
      Multivio.initializer._showErrorPage();


      this.error(completeMessage);
    }
    catch (e) {
      completeMessage =
          'PANIC: could not output the following error message ' +
          'in a convenient way.\n' +
          completeMessage;
      alert(completeMessage);
    }
  }
 
});


// /**
//   @class
// 
//   This is a Log4js-based appender customized for Multivio usage.
// 
//   It writes Log4js.LoggingEvent objects to the Multivio.errorController
//   object, so that they can be used by the application's own error processing
//   mechanism.
// 
//   @author mmo
//   @extends Log4js.Appender
//   @since 0.2.0
//  */
// Multivio.ErrorControllerAppender = function () {
//   this.currentLine = 0;
// };
// Log4js.ErrorControllerAppender.prototype = Log4js.extend(new Log4js.Appender(), {  
// 
// 
//   //categoryName, level, message, exception, logger
// 
//   /**
//    * @param loggingEvent event to be logged
//    * @see Log4js.Appender#doAppend
//    */
//   doAppend: function (loggingEvent) {
//     var now = new Date();
//     var lines = loggingEvent.message.split("\n");
//     var headTag = document.getElementsByTagName("head")[0];
// 
//     for (var i = 1; i <= lines.length; i++) {
//       var value = lines[i - 1];
//       if (i === 1) {
//         value = loggingEvent.level.toString() + ": " + value;
//       } else {
//         value = "> " + value;
//       }
// 
//       var metaTag = document.createElement("meta");
//       metaTag.setAttribute("name", "X-log4js:" + this.currentLine);
//       metaTag.setAttribute("content", value);
//       headTag.appendChild(metaTag);
//       this.currentLine += 1;
//     }
//   },
// 
//   /** 
//    * toString
//    */
//   toString: function () {
//     return "Multivio.ErrorControllerAppender"; 
//   }
// });
