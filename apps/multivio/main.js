/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2010 RERO
  License:    See file license.js
==============================================================================
*/

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//

Multivio.main = function main() {

  // Multivio.configurator#readInputParameters() is declared as the callback
  // function that parses the parameters given in the applications's URL; this
  // is done using the SC.routes mechanism.
  SC.routes.add(':', Multivio.configurator, 'readInputParameters');
  
  // Launch the initalization process using Multivio.initializer
  Multivio.initializer.initialize();
};

function main() {
  Multivio.main();
}
