/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2013 RERO
  License:    See file license.js
==============================================================================
*/

/**
  @namespace
  @mixin

  Adds support for a 3x3-cell grid-based interface layout.

  It can be applied to a view in order to manage the layout of child
  components on the view's canvas. The view is split into a grid of 3 rows
  and 3 columns so that components can be laid out according to grid-based
  coordinates.

  +-----+---------------+-----+
  |     |               |     | fixed height
  +-----+---------------+-----+
  |     |               |     |
  |     |               |     | elastic height
  |     |               |     |
  +-----+---------------+-----+
  |     |               |     | fixed height
  +----------------------------
   fixed    elastic      fixed
   width     width       width

  The top and bottom rows have fixed height, the leftmost and rightmost
  columns have fixed width, whereas the central row and column are elastic in
  order to fit the canvas.

  @author mmo
  @extends SC.Object
  @since 0.1.0
*/
Multivio.GridLayout3x3 = {

  /**
    Grid cell occupancy matrix
    
    Each position of this 3x3 array, if not null, contains the name of a
    component in the _componentsOnGrid table, and indicates that the
    corresponding grid cell is occupied by that component.


    @property {Array}
    @private
    @default []
  */
  _gridCells: [],

  /**
    Registered components
    
    Each entry is composed as follows
      Key: componentName {String} the name of a component in Multivio.views
      Value: [coordinates {Array}, coveredCells {Array}]
        coordinates: [x, y, xlen, ylen]
        coveredCells: [[x, y], [x, y], [x, y] ... ]

    @property {Object}
    @private
  */
  _componentsOnGrid: {},

  /**
    Grid dimension properties
  */

  /** 
    @property {Number}
    @private 
  */
  _leftStripWidth  : 0,
  /** 
    @property {Number}
    @private 
  */
  _rightStripWidth : 0,
  /** 
    @property {Number}
    @private 
  */
  _headerHeight    : 0,
  /** 
    @property {Number}
    @private 
  */
  _footerHeight    : 0,
  /** 
    @property {Number}
    @private 
  */
  _margin          : 0,

  /**
    Initilize grid

    @param {Object} params layout parameters hash with the following content:
        {Number} leftStripWidth
        {Number} rightStripWidth
        {Number} headerHeight
        {Number} footerHeight
        {Number} marginTop
        {Number} marginRight
        {Number} marginBottom
        {Number} marginLeft
  */
  layOutGrid: function (params) {
    // validate input parameters
    var errMess = Multivio.checkParams(params, {
        'leftStripWidth':  SC.T_NUMBER,
        'rightStripWidth': SC.T_NUMBER,
        'headerHeight':    SC.T_NUMBER,
        'footerHeight':    SC.T_NUMBER,
        'marginTop':       SC.T_NUMBER,
        'marginRight':     SC.T_NUMBER,
        'marginBottom':    SC.T_NUMBER,
        'marginLeft':      SC.T_NUMBER
      });

    if (errMess.length > 0) {
      throw {message: 'Invalid parameters while laying out a GridLayout3x3: ' + errMess};
    }

    this._leftStripWidth  = params.leftStripWidth;
    this._rightStripWidth = params.rightStripWidth;
    this._headerHeight    = params.headerHeight;
    this._footerHeight    = params.footerHeight;
    this._marginTop       = params.marginTop;
    this._marginRight     = params.marginRight;
    this._marginBottom    = params.marginBottom;
    this._marginLeft      = params.marginLeft;

    this._resetLayout();
  },

  /**
    Lay out a component on this view's grid
    
    There are two possible ways of calling this function:
      1) using numeric coordinates
      2) using spreadsheet-style coordinates

    @param {Object} params layout parameters with the following values:
        {String} name   component name
        {Number} x      x coordinate on grid
        {Number} y      y coordinate on grid
        {Number} xlen   x length on grid
        {Number} ylen   y length on grid
      or 
        {String} name   component name
        {String} coord  coordinates with format [A-C][1-3]:[A-C][1-3], example:
          A1:B2, A1:A1, A3:C3...
          they represent the top-left:bottom-right corners of the component on
          the grid
  */
  layOutComponent: function (params) {
    
    var usingNumericCoordinates = !SC.none(params.x) ? YES : NO;

    // validate input parameters
    var errMess = Multivio.checkParams(params, {'name': SC.T_STRING});
    if (errMess.length > 0) {
      var m = 'Invalid parameters while laying out a component ' +
          ' on a GridLayout3x3:' + errMess;
      throw {message: m};
    }

    if (usingNumericCoordinates) {
      errMess = Multivio.checkParams(params, {
        'x':    SC.T_NUMBER,
        'y':    SC.T_NUMBER,
        'xlen': SC.T_NUMBER,
        'ylen': SC.T_NUMBER
      });
      if (errMess.length > 0) {
        m = 'Invalid parameters while laying out a component ' +
            ' on a GridLayout3x3:' + errMess;
        throw {message: m};
      }
    }
    else
    {
      errMess = Multivio.checkParams(params, {'coord': SC.T_STRING});
      if (errMess.length > 0) {
        m = 'Invalid parameters while laying out a component ' +
            ' on a GridLayout3x3:' + errMess;
        throw {message: m};
      }
      if (params.coord && params.coord.length !== 5) {
        m = 'Coordinates are invalid:' + params.coord;
        throw {message: m};
      }
    }

    var componentName   = params.name;
    var componentObject = Multivio.getPath(componentName);
    var x, y, xlen, ylen;

    if (SC.none(componentObject)) {
      m = 'Component object with name %@ not found for laying out on a ' +
          'GridLayout3x3'.fmt(componentName);
      throw {message: m};
    }

    if (usingNumericCoordinates) {
      x =    params.x;
      y =    params.y;
      xlen = params.xlen;
      ylen = params.ylen;
    }
    else {
      // convert spreadsheet-style coordinates into numeric coordinates
      var pos = params.coord.charAt(0);
      x = (pos === 'A') ? 0 : (pos === 'B') ? 1 : (pos === 'C') ? 2 : -1;
      pos = parseInt(params.coord.charAt(1), 10);
      y = pos - 1;
      pos = params.coord.charAt(3);
      xlen = (pos === 'A') ? 0 : (pos === 'B') ? 1 : (pos === 'C') ? 2 : -1;
      xlen = xlen - x + 1;
      pos = parseInt(params.coord.charAt(4), 10);
      ylen = pos - y;
    }

    errMess = '';
    // parameter checking
    if (x < 0 || x > 2 || xlen <= 0 || x + xlen > 3 ||
        y < 0 || y > 2 || ylen <= 0 || y + ylen > 3) {
      if (usingNumericCoordinates) {
        errMess = 'Coordinates are invalid: (%@, %@, %@, %@)'.fmt(
            x, y, xlen, ylen);
      }
      else {
        errMess = 'Coordinates are invalid: %@'.fmt(params.coord);
      }
      throw {message: errMess}; 
    }

    var newLayout = {};

    // define component dimensions
    switch (x) {
    case 0:
      newLayout.left = this._marginLeft;
      break;
    case 1:
      newLayout.left = this._leftStripWidth + this._marginLeft + 1;
      break;
    case 2: 
      newLayout.width =
          this._rightStripWidth - this._marginLeft - this._marginRight;
      break;
    }
    switch (x + xlen) {
    case 1:
      newLayout.width =
          this._leftStripWidth - this._marginLeft - this._marginRight;
      break;
    case 2:
      newLayout.right = this._rightStripWidth + this._marginRight + 1;
      break;
    case 3:
      newLayout.right = this._marginRight;
      break;
    }
    switch (y) {
    case 0:
      newLayout.top = this._marginTop;
      break;
    case 1:
      newLayout.top = this._headerHeight + this._marginTop + 1;
      break;
    case 2:
      newLayout.height =
          this._footerHeight - this._marginTop - this._marginBottom;
      break;
    }
    switch (y + ylen) {
    case 1:
      newLayout.height =
          this._headerHeight - this._marginTop - this._marginBottom;
      break;
    case 2:
      newLayout.bottom = this._footerHeight + this._marginBottom + 1;
      break;
    case 3:
      newLayout.bottom = this._marginBottom;
      break;
    }

    // update cell occupancy registries
    for (var i = x; i < x + xlen; i++) {
      for (var j = y; j < y + ylen; j++) {
        // if cell was previously occupied by another component...
        var componentInCell = this._gridCells[i][j];
        if (!SC.none(componentInCell) && componentInCell !== componentName) {
          // ... remove it from this view
          this.removeComponent(componentInCell);
        }
        // occupy this cell with this component
        this._gridCells[i][j] = componentName;
        // update component's registry
        if (SC.none(this._componentsOnGrid[componentName])) {
          this._componentsOnGrid[componentName] = {
            'coordinates': [x, y, xlen, ylen],
            'coveredCells': []
          };
        }
        this._componentsOnGrid[componentName].coveredCells.push([i, j]);
      }
    }
    
    // append the component to this view with the defined layout
    componentObject.set('layout', newLayout);
    this.appendChild(componentObject);
    componentObject.set('isVisibleInWindow', YES);
  },

  /**
    Remove a component from the view

    @param {String} componentName
  */
  removeComponent: function (componentName) {
    var componentInfo = this._componentsOnGrid[componentName] || {};
    // remove its reference from the cell occupancy matrix
    var componentCells = componentInfo.coveredCells || [];
    for (var c = 0; c < componentCells.length; c++) {
      if (SC.typeOf(componentCells[c]) === SC.T_ARRAY &&
          componentCells[c].length === 2) {
        var x = componentCells[c][0],
            y = componentCells[c][1];
        if (this._gridCells[x][y] === componentName) {
          this._gridCells[x][y] = null;
        }
      }
    }
    // delete its reference from the registered components list
    if (!SC.empty(componentInfo)) {
      // delete it from the component registry
      delete this._componentsOnGrid[componentName];
      // make the component invisible
      var componentObject = Multivio.getPath(componentName);
      if (componentObject.get('isVisibleInWindow')) {
        componentObject.set('isVisibleInWindow', NO);
      }
      // remove it from this view
      this.removeChild(componentObject);
    }
  },
  
  /**
    @private
  */
  _resetLayout: function () {
    // remove all current components from the view
    for (var componentName in this._componentsOnGrid) {
      if (this._componentsOnGrid.hasOwnProperty(componentName)) {
        var componentObject = Multivio.getPath(componentName);
        if (componentObject.get('isVisibleInWindow')) {
          componentObject.set('isVisibleInWindow', NO);
        }
        // remove it from this view
        this.removeChild(componentObject);
      }
    }
    // reset the cell occupancy matrix
    this._gridCells = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ];
  }

};
