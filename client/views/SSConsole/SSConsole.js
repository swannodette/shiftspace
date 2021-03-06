// ==Builder==
// @uiclass
// @framedView
// @package           ShiftSpaceUI
// @dependencies      SSFramedView
// ==/Builder==

var SSConsoleIsReadyNotification = 'SSConsoleIsReadyNotification';

var SSConsole = new Class({

  Extends: SSFramedView,
  name: 'SSConsole',
  

  initialize: function(el, options)
  {
    this.parent(el, options);

    SSAddObserver(this, 'onUserLogin', this.update.bind(this));
    SSAddObserver(this, 'onUserLogout', this.update.bind(this));
    SSAddObserver(this, 'onUserJoin', this.update.bind(this));
    SSAddObserver(this, 'onNewShiftSave', this.onNewShiftSave.bind(this));
    SSAddObserver(this, 'onLocalizationChanged', this.localizationChanged.bind(this));
    SSAddObserver(this, 'toggleConsole', this.toggle.bind(this));
  },

  
  show: function()
  {
    if(this.isVisible()) return;
    this.parent();
    this.update();
    SSPostNotification('onConsoleShow');
  }.decorate(ssfv_ensure),
  
  
  hide: function()
  {
    this.parent();
    SSPostNotification('onConsoleHide');
  },
  
  
  toggle: function()
  {
    if(this.isVisible())
    {
      this.hide();
    }
    else
    {
      this.show();
    }
  },
  

  updateTabs: function()
  {
    if(ShiftSpaceUser.isLoggedIn())
    {
      this.MainTabView.hideTabByName('LoginTabView');

      this.MainTabView.revealTabByName('MyShiftSpacePane');
      this.MainTabView.revealTabByName('PeoplePane');
      this.MainTabView.revealTabByName('GroupsPane');
      this.MainTabView.revealTabByName('InboxPane');
    }
    else
    {
      this.MainTabView.revealTabByName('LoginTabView');

      this.MainTabView.hideTabByName('MyShiftSpacePane');
      this.MainTabView.hideTabByName('PeoplePane');
      this.MainTabView.hideTabByName('GroupsPane');
      this.MainTabView.hideTabByName('InboxPane');
    }
  },


  update: function()
  {
    if(this.isLoaded())
    {
      if(ShiftSpace.User.isLoggedIn())
      {
        this.updateTabs();   
        this.MainTabView.selectTabByName('AllShiftsView');
        if(SSTableForName("AllShifts")) SSTableForName("AllShifts").refresh();
        if(SSTableForName("MyShifts")) SSTableForName("MyShifts").refresh();
      }
      else
      {
        this.updateTabs();
        this.MainTabView.selectTabByName('AllShiftsView');
        this.MainTabView.refresh();
        if(SSTableForName("AllShifts")) SSTableForName("AllShifts").refresh();
      }

      if(!this.isUpToDate())
      {
        SSLog("not up to date", SSLogForce);
        this.showUpdateTab();
      }
      else
      {
        SSLog("up to date", SSLogForce);
        this.hideUpdateTab();
      }
    }
  },
  
  
  onNewShiftSave: function()
  {
    if(this.isLoaded()) this.MainTabView.selectTabByName('AllShiftsView');
  },


  showLogin: function()
  {
    if(!this.isVisible()) this.show();
    this.MainTabView.selectTabByName('LoginTabView');
  },

  
  showInbox: function()
  {
    if(!this.isVisible()) this.show();
    this.MainTabView.selectTabByName('InboxPane');
  },


  /*
    Function: setUpToDate
      Set the flag for whether the ShitSpace userscript is up-to-date.

    Parameters:
      v - a boolean.
  */
  setUpToDate: function(v)
  {
    this.__notUpToDate = v;
  },

  /*
    Function: isUpToDate
      Check whether the ShiftSpace userscript is up-to-date or not.

    Returns:
      A boolean.
  */
  isUpToDate: function()
  {
    return this.__notUpToDate;
  },


  showUpdateTab: function(args)
  {
    this.SSUpdateLink.set("href", String.urlJoin(SSInfo().mediaPath, "builds", SSInfo().build.name));
    this.MainTabView.revealTabByName("UpdatePane");
  },

  
  hideUpdateTab: function(args)
  {
    this.MainTabView.hideTabByName("UpdatePane");
  },
  
  
  initResizer: function()
  {
    this.resizer = new SSElement('div', {
        id: 'SSConsoleResizer',
        styles: {
          position: 'fixed',
          bottom: 225,
          cursor: 'ns-resize',
          height: 5,
          left: 10,
          right: 10,
          'z-index': 1000004
        }
    });

    $(document.body).grab(this.resizer);
    
    this.resizer.addEvent('mousedown', SSAddDragDiv);

    this.resizer.makeDraggable({
      modifiers: {x:'', y:'bottom'},
      invert: true,
      onComplete: SSRemoveDragDiv
    });
    
    this.element.makeResizable({
      handle: this.resizer,
      modifiers: {x:'', y:'height'},
      invert: true
    });
  },
  
  /*
    Function: subViews
      Returns an array of all SSViews that have the console as the super
      view.

    Returns:
      An array of <SSView> instances.
  */
  subViews: function()
  {
    if(!this.isLoaded()) return [];
    return this.contentWindow().$$('*[uiclass]').map(SSControllerForNode).filter(function(controller) {
      return (controller.isAwake() && controller.superView() == this);
    }, this);
  },

  /*
    Function: visibleListView
      Returns the visible list view.

    Returns:
      <SSListView>
  */
  visibleListView: function()
  {
    return this.allVisibleViews(null, $memberof.curry(null, _, 'ShiftListView'))[0];
  },

  /*
    Function: localizationChanged
      *private*
      Called when the user changes the localization of the interface. This
      should not be called directly.

    Parameters:
      evt - the localization change event.
  */
  localizationChanged: function(evt)
  {
    if(this.delayed()) return;
    SSUpdateStrings(evt.strings, evt.lang, this.contentWindow());
  },

  /* SSFramedView Stuff ---------------------------------------- */

  awake: function(context)
  {
    this.mapOutletsToThis();
  },


  onContextActivate: function(context)
  {
    if(context == this.element.contentWindow)
    {
      this.mapOutletsToThis();
      this.MainTabView.addEvent('tabSelected', function(evt) {
        
      }.bind(this));
      this.updateTabs();
    }
  },

  
  onInterfaceLoad: function(ui)
  {
    this.parent(ui);
    this.element.addClass('SSDisplayNone');
  }.future(),


  buildInterface: function()
  {
    this.parent();
    this.initResizer();
    this.setIsLoaded(true);
    SSPostNotification(SSConsoleIsReadyNotification, this);
  }
});