/**
==============================================================================
Project: Multivio - https://www.multivio.org/
Copyright: (c) 2009-2010 RERO
License: See file license.js
==============================================================================
*/

sc_require('views/content');
sc_require('views/thumbnail');
sc_require('views/thumbnail_content');
sc_require('views/tree');
sc_require('views/file_button');
sc_require('views/metadata');
sc_require('views/search');

/**
@class
The main page object contains all views configuration
*/
Multivio.views = SC.Page.design(
/** @scope Multivio.views.prototype */ {

  /**
    Main content view
  */
  mainContentView: SC.View.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },
    acceptsFirstResponder: YES,
    isKeyResponder: YES,
    controllers: [ 'zoomController', 'navigationController', 'searchController',
        'imageController',  'treeController', 'thumbnailController'],
      
    childViews: 'leftButtons innerMainContent bottomButtons'.w(),
      
    bottomButtons: Multivio.FileButtonView.design({
      //layout: {bottom: -40, centerX: 24, width: 728, height: 150},
      layout: {bottom: -40, centerX: 24, width: 828, height: 150},
      classNames: 'mvo-front-view',
      
      childViews: 'backgroundView '.w(),
      
      backgroundView: SC.View.design({
        layout: { left: 0, right: 0, top: 40, bottom: 40 },
        classNames: 'mvo-front-view-transparent',
      
        childViews: 'navigationView zoomView rotateView'.w(),
        
        //navigation
        navigationView: SC.View.design({
          layout: { centerX: 0, centerY: 0, width: 192, height: 32 },

          childViews: 'firstPageView previousPageView textPageView nextPageView lastPageView'.w(),

          firstPageView: SC.ButtonView.design({
            layout: { centerX: -80, centerY: 0, width: 32, height: 32 },
            titleMinWidth : 0,
            needsEllipsis: NO,
            toolTip: '_FirstPage'.loc(),
            renderStyle: "renderImage",
            icon: 'jump_backwards_new',
            theme: 'mvo-button',
            isEnabledBinding: "Multivio.navigationController.isFirstEnabled",
            target: "Multivio.navigationController", 
            action: "goToFirstPage"
          }),

          previousPageView: SC.ButtonView.design({
            layout: { centerX: -48, centerY: 0,  width: 32, height: 32 },
            titleMinWidth : 0,
            needsEllipsis: NO,
            toolTip: '_PreviousPage'.loc(),
            renderStyle: "renderImage",
            icon: 'go_backwards_new',
            theme: 'mvo-button',
            isEnabledBinding: "Multivio.navigationController.isPreviousEnabled",
            target: "Multivio.navigationController", 
            action: "goToPreviousPage"
          }),    

          textPageView: SC.TextFieldView.design({ 
            layout: { centerX: 0, centerY: -1, width: 50, height: 24 },
            textAlign: SC.ALIGN_CENTER,
            valueBinding: 'Multivio.navigationController.currentPage',
            isEnabledBinding: 'Multivio.navigtionController.isCurrentPageEnabled'
          }),

          nextPageView: SC.ButtonView.design({
            layout: { centerX: 48, centerY: 0, width: 32, height: 32 },
            titleMinWidth : 0,
            needsEllipsis: NO,
            toolTip: '_NextPage'.loc(),
            acceptsFirstResponder: YES,
            renderStyle: "renderImage",
            icon: 'go_forward_new',
            theme: 'mvo-button',
            isEnabledBinding: "Multivio.navigationController.isNextEnabled",
            target: "Multivio.navigationController", 
            action: "goToNextPage"
          }),

          lastPageView: SC.ButtonView.design({
            layout: { centerX: 80, centerY: 0, width: 32, height: 32 },
            titleMinWidth : 0,
            needsEllipsis: NO,
            toolTip: '_LastPage'.loc(),
            renderStyle: "renderImage",
            icon: 'jump_forward_new',
            theme: 'mvo-button',
            isEnabledBinding: "Multivio.navigationController.isLastEnabled",
            target: "Multivio.navigationController", 
            action: "goToLastPage"
          })
        }),    

        //zoom
        zoomView: SC.View.design({
          //layout: { centerX: 240, centerY: 0, width: 192, height: 32 },
          layout: { centerX: 240, centerY: 0, width: 224, height: 32 },
          
          //childViews: 'zoomOutView zoomInView zoomFullSizeView zoomFullWidthView zoomNativeSizeView'.w(),
          childViews: 'zoomOutView zoomInView zoomPredefinedView'.w(),

          zoomOutView: SC.ButtonView.design({
            layout: { centerX: -80, centerY: 0, width: 32, height: 32 },
            titleMinWidth : 0,
            needsEllipsis: NO,
            toolTip: '_Zoom-'.loc(),
            renderStyle: "renderImage",
            icon: 'zoom_minus_new',
            theme: 'mvo-button',
            isEnabledBinding: "Multivio.zoomController.isZoomOutAllowed",
            target: "Multivio.zoomController", 
            action: "doZoomOut"
          }),

          zoomInView: SC.ButtonView.design({
            layout: { centerX: -48, centerY: 0, width: 32, height: 32 },
            titleMinWidth : 0,
            needsEllipsis: NO,
            toolTip: '_Zoom+'.loc(),
            renderStyle: "renderImage",
            icon: 'zoom_plus_new',
            theme: 'mvo-button',
            isEnabledBinding: "Multivio.zoomController.isZoomInAllowed",
            target: "Multivio.zoomController", 
            action: "doZoomIn"
          }),

          /*
          zoomFullSizeView: SC.ButtonView.design({
            layout: { centerX: 16, centerY: 0, width: 32, height: 32 },
            titleMinWidth : 0,
            needsEllipsis: NO,
            toolTip: '_FullSize'.loc(),
            renderStyle: "renderImage",
            icon: 'full_size_new',
            theme: 'mvo-button',
            isEnabledBinding: "Multivio.zoomController.isStateEnabled",
            target: "Multivio.zoomController", 
            action: "doFullSizeZoom"
          }),

          zoomFullWidthView: SC.ButtonView.design({
            layout: { centerX: 48, centerY: 0, width: 32, height: 32 },
            titleMinWidth : 0,
            needsEllipsis: NO,
            toolTip: '_FullWidth'.loc(),
            renderStyle: "renderImage",
            icon: 'full_width_new',
            theme: 'mvo-button',
            isEnabledBinding: "Multivio.zoomController.isStateEnabled",
            target: "Multivio.zoomController", 
            action: "doFullWidthZoom"
          }),

          zoomNativeSizeView: SC.ButtonView.design({
            layout: { centerX: 80, centerY: 0, width: 32, height: 32 },
            titleMinWidth : 0,
            needsEllipsis: NO,
            toolTip: '_NativeSize'.loc(),
            renderStyle: "renderImage",
            icon: 'native_size_new',
            theme: 'mvo-button',
            isEnabledBinding: "Multivio.zoomController.isStateEnabled",
            target: "Multivio.zoomController", 
            action: "doNativeSizeZoom"
          })
          */

          zoomPredefinedView: SC.SegmentedView.design({
            layout: { centerX: 48, centerY: 0, width: 128, height: 24 },
            items: [
              {title: "", value: "Full", icon: sc_static("images/icons/16x16/full_size_dark_16x16.png"), enabled: YES },
              {title: "", value: "Width", icon: sc_static("images/icons/16x16/full_width_dark_16x16.png"), enabled: YES },
              {title: "", value: "Native", icon: sc_static("images/icons/16x16/100_percent_dark_16x16.png"), enabled: YES }
            ],
            itemTitleKey: 'title',
            itemValueKey: 'value',
            itemIconKey: 'icon',
            itemIsEnabledKey: 'enabled',
            valueBinding: "Multivio.zoomController.currentZoomState",
            isEnabledBinding: 'Multivio.zoomController.isStateEnabled',
            target: "Multivio.zoomController",
            action: "setPredefinedZoom"
          })

        }),

        //rotate
        rotateView: SC.View.design({
          layout: { centerX: -160, centerY: 0, width: 64, height: 32 },
          layerId: "rotatePageId",

          childViews: 'rotateLeftView rotateRightView'.w(),

          rotateLeftView: SC.ButtonView.design({
            layout: { centerX: -16, centerY: 0, width: 32, height: 32 },
            layerId: "rotateLeftPageId",
            titleMinWidth : 0,
            needsEllipsis: NO,
            toolTip: '_RotateLeft'.loc(),
            renderStyle: "renderImage",
            icon: 'rotate_left_new',
            theme: 'mvo-button',
            target: "Multivio.rotateController",
            isEnabledBinding: 'Multivio.rotateController.isLeftAllow', 
            action: "rotateLeft"
          }),

          rotateRightView: SC.ButtonView.design({
            layout: { centerX: 16, centerY: 0, width: 32, height: 32 },
            layerId: "rotateRightPageId",
            titleMinWidth : 0,
            needsEllipsis: NO,
            toolTip: '_RotateRight'.loc(),
            renderStyle: "renderImage",
            icon: 'rotate_right_new',
            theme: 'mvo-button',
            target: "Multivio.rotateController",
            isEnabledBinding: 'Multivio.rotateController.isRigthAllow',
            action: "rotateRight"
          })
        })
      })
    }),
    
    leftButtons: SC.View.design({
      layout: { top: 0, left: 4, bottom: 0, width: 40},
      //classNames: 'mvo-front-view',
      classNames: 'workspace_black',
      
      childViews: [
        SC.ButtonView.design({
          layout: { top: 10, centerX: 0, width: 32, height: 32 },
          titleMinWidth : 0,
          needsEllipsis: NO,
          name: 'tree',
          toolTip: '_Tree'.loc(),
          renderStyle: "renderImage",
          icon: 'tree_new',
          theme: 'mvo-button',
          target: "Multivio.paletteController",
          action: "showTree"
        }),
        SC.ButtonView.design({
          layout: { top: 50, centerX: 0, width: 32, height: 32 },
          titleMinWidth : 0,
          needsEllipsis: NO,
          name: 'thumbnails',
          toolTip: '_Thumbnails'.loc(),
          renderStyle: "renderImage",
          icon: 'thumbnails_new',
          theme: 'mvo-button',
          target: "Multivio.paletteController",
          action: "showThumbnails"
        }),
        SC.ButtonView.design({
          layout: { top: 90, centerX: 0, width: 32, height: 32 },
          titleMinWidth : 0,
          needsEllipsis: NO,
          name: 'search',
          toolTip: '_Search'.loc(),
          renderStyle: "renderImage",
          icon: 'search_new',
          theme: 'mvo-button',
          target: "Multivio.paletteController",
          action: "showSearch"
        }),
        SC.ButtonView.design({
          layout: { top: 130, centerX: 0, width: 32, height: 32 },
          titleMinWidth : 0,
          needsEllipsis: NO,
          name: 'metadata',
          toolTip: '_Metadata'.loc(),
          renderStyle: "renderImage",
          icon: 'info_new',
          theme: 'mvo-button',
          target: "Multivio.paletteController",
          action: "showMetadata"
        }),
        SC.ButtonView.design({
          layout: { bottom: 24, centerX: 0, width: 32, height: 32 },
          titleMinWidth : 0,
          needsEllipsis: NO,
          name: 'show_toolbar',
          toolTip: '_ShowToolbar'.loc(),
          renderStyle: "renderImage",
          icon: 'show_toolbar_new',
          theme: 'mvo-button',
          target: "Multivio.paletteController",
          action: "showHorizontalToolbar"
        })
      ]
    }),
    
    innerMainContent: Multivio.ContentView.design({
      layout: { top: 0, bottom: 0, left: 48, right: 0 },
      isFirstResponder: YES,
      acceptsFirstResponder: YES,
      isKeyResponder: YES,
      
      borderStyle: SC.BORDER_NONE,
      classNames: 'inner_content_view',

      contentView: SC.View.design({
        layout: { top: 0, bottom: 0, centerX: 0, minWidth: 1 },
        useImageCache: NO,
        
        // note: draw highlight pane on top of the content image
        childViews: 'innerContent highlightpane'.w(),

        innerContent: Multivio.ImageContentView.design({
          layout: { top: 0, left: 0, minWidth: 1 },
          useImageCache: NO
        }),

        highlightpane: Multivio.HighlightContentView.design({
          layout: { top: 0, left: 0, right: 0, minWidth: 1 }
        }).classNames('highlight-pane'.w())
      }).classNames('image-and-highlight-container'.w())
    }),
    
    render: function (context, firstTime) {
      if (context.needsContent) {
        this.renderChildViews(context, firstTime);
        context.push(
          "<div class='top-edge'></div>",
          "<div class='right-edge'></div>",
          "<div class='bottom-edge'></div>",
          "<div class='left-edge'></div>");
      }
    }
  }),
  
  // Thumbnails
  thumbnailPalette: SC.PalettePane.design({
    isAnchored: YES,
    classNames: 'mvo-transparent',
    contentView: SC.View.design({
      layout: { top: 0, bottom: 0, left: 0, right: 0 },
      
      childViews: 'innerThumbnail'.w(),
      innerThumbnail: Multivio.ThumbnailView.design({
        layout: { top: 2, bottom: 2, left: 2, right: 2 },
        hasHorizontalScroller: NO,
        borderStyle: SC.BORDER_NONE,

        contentView: SC.ListView.design({
          layout: { top: 0, bottom: 0, left: 0, right: 0 },
          insertionOrientation: SC.VERTICAL_ORIENTATION,
          rowHeight: 130,
          
          exampleView: Multivio.ThumbnailContentView,
          //useImageCache: NO,
          contentBinding: 'Multivio.thumbnailController.arrangedObjects',
          selectionBinding: 'Multivio.thumbnailController.selection'
        })
      })
    })
    //}).classNames('shadow_light inner_view'.w()),
  }),
    
    
  /**
    Search view 
  */
  searchPalette: SC.PalettePane.design({
    isAnchored: YES,
    classNames: 'mvo-transparent',
    contentView: SC.View.design({
      layout: { top: 0, bottom: 0, left: 0, right: 0 },
    
      //add controller(s) needed for this view
      controllers: ['imageController'],
    
      childViews: 'innerSearch'.w(),
      innerSearch: Multivio.SearchView.design({
        layout: { top: 5, bottom: 5, left: 5, right: 5 },
        borderStyle: SC.BORDER_NONE
      })
    })
  }), //.classNames('shadow_light inner_view'.w()),

  /**
    Tree palette
  */
  treePalette: SC.PalettePane.design({
    isAnchored: YES,
    classNames: 'mvo-transparent',
    contentView: SC.View.design({
      layout: { top: 0, bottom: 0, left: 0, right: 0 },
      childViews: 'innerTree '.w(),
      innerTree:  Multivio.TreeView.design({
        layout: { top: 2, bottom: 2, left: 2, right: 2 },
        borderStyle: SC.BORDER_NONE,

        contentView: SC.ListView.design({
          layout: { top: 0, bottom: 0, left: 0, right: 0 },
          classNames: 'mvo-test',
          rowHeight: 18,
          borderStyle: SC.BORDER_NONE,
          exampleView: Multivio.TreeLabelView,
          contentValueKey: 'label',
          contentBinding: 'Multivio.treeController.arrangedObjects',
          selectionBinding: 'Multivio.treeController.selection'
        })
      })
    })
  }),

  treeView: SC.View.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },
    // add controller(s) need for this view
    controllers: ['treeController']
  }),
  
  // metadata
  metadataPalette: SC.PalettePane.design({
    isAnchored: YES,
    classNames: 'mvo-transparent',
    
    contentView: SC.View.design({
      layout: { top: 0, left: 0, bottom: 0, right: 0 },

      childViews: [
        SC.ListView.design({
          layout: { top: 2, bottom: 2, left: 2, right: 2 },
          exampleView: Multivio.Metadata,
          // update row position
          didCreateLayer: function () {
            var childs = this.get('childViews');
            var newTopPosition = 0;
            for (var i = 0; i < childs.length; i++) {
              childs[i].set('layout', {'top': newTopPosition});
              newTopPosition += childs[i].get('customHeight');
            }
          }
        })
      ]
    })
  }),
  
  navigationView: SC.PalettePane.design({
    layout: { height: 60, width: 400, centerX: 0, top: 55},
    classNames: 'mvo-front-view-transparent',
    contentView: SC.View.design({
      childViews: [
        SC.LabelView.design({
          layout: {width: 350, height: 20, centerX: 0, centerY: 0},
          classNames: 'mvo-metadata-label',
          textAlign: 'center',
          escapeHTML: NO,
          value: null
        })
      ]
    })
  }),
  
  /**
    Logo of e-lib & rero
  */
  logosREROandElib: SC.View.design({
    layout: { top: 0, height: 24, left: 6, width: 200 },

    childViews: [
      SC.View.design({
        layout: { top: 0, height: 32, right: 100, width: 100 },
        childViews: [
          SC.View.design({
            layout: { top: 0, bottom: 0, left: 0, right: 0 },
            classNames: 'rero_logo'
          })
        ],
        render: function (context, firstTime) {
          context.push("<a href='http://www.rero.ch/'>");
          this.renderChildViews(context, firstTime);
          context.push("</a>");
        }
      }),
      SC.View.design({
        layout: { top: 0, height: 32, right: 0, width: 80 },
        childViews: [
          SC.View.design({
            layout: { top: 4, bottom: 0, left: 0, right: 0 },
            classNames: 'e-lib_ch_logo'
          })
        ],
        render: function (context, firstTime) {
          context.push("<a href='http://www.e-lib.ch/'>");
          this.renderChildViews(context, firstTime);
          context.push("</a>");
        }
      })
    ]
  }),
  
  /** 
    Logo of Multivio
  */
  logoMvoView: SC.View.design({
    layout: { top: 0, bottom: 0, left: 10, width: 160 },

    isTextSelectable: YES,
    childViews: [
      SC.View.design({
        layout: { top: 0, left: 0, height: 44, width: 140 },
        classNames: 'multivio_logo',
        toolTip: 'Go to Multivio website. Client release: ' + 
            Multivio.VERSION
      })
    ],
    render: function (context, firstTime) {
      context.push("<a href='https://www.multivio.org/'>");
      // add the version of the server in the tooltip
      var childView = this.get('childViews')[0];
      var toolTip = childView.get('toolTip');
      var sererVersion = Multivio.configurator.get('serverVersion');
      toolTip += ' & Server release: ' + sererVersion;
      childView.set('toolTip', toolTip);
      this.renderChildViews(context, firstTime);
      context.push("</a>");
    }
  }),

  /**
    Header view
  */
  headerView: SC.View.design({
    childViews: 'metadataView'.w(),

    metadataView: SC.View.design({
      layout: { top: 0, bottom: 0, right: 0 },

      childViews: [
        SC.LabelView.design({
          layout: { top: 5, height: 23, left: 0, right: 120 },
          isTextSelectable: YES,
          tagName: 'span',
          classNames: 'metadata_primary',
          contentBinding: 'Multivio.metadataController.descriptiveMetadataDictionary',
          contentValueKey: 'title'
        }),
        SC.View.design({
          layout: { top: 2, height: 24, width: 72, right: 0 },

          childViews: [
            SC.ButtonView.design({
              layout: { top: 0, bottom: 0, right: 48, width: 24 },
              name: 'change_theme_white',
              toolTip: '_Change theme to white'.loc(),
              renderStyle: 'renderImage',
              icon: 'theme-button-white',
              theme: 'mvo-button',
              target: "Multivio.layoutController",
              action: "changeThemeToWhite"
            }),
            SC.ButtonView.design({
              layout: { top: 0, bottom: 0, right: 24, width: 24 },
              name: 'change_theme_dark_gray',
              toolTip: '_Change theme to dark gray'.loc(),
              renderStyle: 'renderImage',
              icon: 'theme-button-dark-gray',
              theme: 'mvo-button',
              target: "Multivio.layoutController",
              action: "changeThemeToDarkGray"
            }),
            SC.ButtonView.design({
              layout: { top: 0, bottom: 0, right: 0, width: 24 },
              name: 'change_theme_blue',
              toolTip: '_Change theme to blue'.loc(),
              renderStyle: 'renderImage',
              icon: 'theme-button-blue',
              theme: 'mvo-button',
              target: "Multivio.layoutController",
              action: "changeThemeToBlue"
            })
          ]
        })
      ]
    }).classNames(''.w())
  }),

  usageView: SC.View.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },

    childViews: [
      SC.View.design({
        layout: { centerX: 0, centerY: 0, width: 700, height: 500 },
        childViews: [
          SC.LabelView.design({
            layout: { top: 50, bottom: 50, right: 50, left: 50 },
            classNames: 'mvo_info_full',
            contentBinding: 'Multivio.errorController',
            contentValueKey: 'usageText',
            escapeHTML: NO
          })
        ]
      }).classNames('mvo_info_full_background'.w())
    ]
  }).classNames('mvo_info_full shadow'.w()),
  
  errorView: SC.View.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },

    childViews: [
      SC.View.design({
        layout: { centerX: 0, centerY: 0, width: 700, height: 400 },
        childViews: [
          SC.LabelView.design({
            layout: { top: 50, bottom: 50, right: 50, left: 50 },
            classNames: 'mvo_info_full',
            contentBinding: 'Multivio.errorController',
            contentValueKey: 'message',
            escapeHTML: NO
          })
        ]
      }).classNames('mvo_info_full_background'.w())
    ]
  }).classNames('mvo_info_full shadow'.w()),

  waitingView: SC.View.design({
    childViews: [
      SC.View.design({
        layout: { centerX: 0, centerY: 0, width: 500, height: 300 },
        //layout: { top: 200, bottom: 200, left: 200, right: 200 },
        classNames: 'mvo-pane loading'.w(),
        childViews: [
          SC.LabelView.design({
            layout: { centerX: 0, centerY: -33, width: 230, height: 33 },
            classNames: 'mvo-pane loading'.w(),
            tagName: 'div',
            value: '<h3>Fetching data...</h3>',
            escapeHTML: NO
          }),
          SC.ImageView.design({
            layout: { centerX: 0, centerY: 50, width: 36, height: 36 },
            value: static_url('images/progress_wheel_medium.gif'),
            classNames: ['mvo_info_full_progress']
          })
        ]
      })
    ]
  }),

  blankPane: SC.View.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },
    classNames: 'blank-bg'.w()
  })

});

Multivio.waitingPane = SC.PanelPane.create({
  layout: { width: 500, height: 250, centerX: 0, centerY: 0 },

  contentView: SC.View.extend({
    childViews: [
      SC.LabelView.design({
        layout: { centerX: 0, centerY: -33, width: 230, height: 33 },
        classNames: 'mvo-pane sc-large-size'.w(),
        value: 'Fetching data...'
      }),
      SC.ImageView.design({
        layout: { centerX: 0, centerY: 50, width: 36, height: 36 },
        value: static_url('images/progress_wheel_medium.gif'),
        classNames: 'mvo_info_full_progress'.w()
      })
    ]
  }).classNames('mvo-pane'.w())
});