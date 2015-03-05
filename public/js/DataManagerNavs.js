$( document ).ready( function() {
    var mainMenuEl = $("#main-menu"),
        homeBtnEl = $("#backMainMenu-form"), //btn on the form
        homeBtnListEl = $("#backMainMenu-list"), //btn on the list
        dataListEl = $("#backDataList"),
        createFormEl = $("#backCreate"),
        formEl = $("#create-form"),
        dataView = $("#data-view"),
        mainNavObj = {
          "add-data": formEl,
          "view-data": dataView
        },  
        //Event handlers for Navigation
        handleMainMenuNav = function (evt) {
            //Handles navigation from main menu to approriate area form or list
            var target = evt.target, targetId = target.id;
            if (targetId === "") {
                //if the icon is clicked and not the div then will get parents id
                targetId = target.parentNode.id;
            }
            
            if (targetId === 'add-data' || targetId === 'view-data') {
                mainMenuEl.addClass('visible-hidden');
                mainNavObj[targetId].removeClass('visible-hidden');
            }
        },
        
        handleHomeNav = function (evt) {
          //Handles the navigations from the form or list back home  
          console.log(evt);
          var target = evt.target, targetId = target.dataset.source;
            if (!targetId) {
                targetId = target.parentNode.dataset.source;
            }
            
            //backMainMenu-form
            mainNavObj[targetId].addClass('visible-hidden');
            mainMenuEl.removeClass('visible-hidden');
        },
        handleListNav = function (evt) {
            //moves to list from the form
            mainNavObj["add-data"].addClass('visible-hidden');
            mainNavObj["view-data"].removeClass('visible-hidden');
        },
        handleFormNav = function (evt) {
            //handles moving to form from list
            mainNavObj["view-data"].addClass('visible-hidden');
            mainNavObj["add-data"].removeClass('visible-hidden');
        }
        //Sets up events handlers for the navigation
        mainMenuEl.on("click", handleMainMenuNav);
        homeBtnEl.on("click", handleHomeNav);
        homeBtnListEl.on("click", handleHomeNav);
        dataListEl.on("click", handleListNav);
        createFormEl.on("click", handleFormNav);
});