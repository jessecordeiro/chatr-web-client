$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal({dismissible: false});
    $('#modal2').modal({dismissible: true});
    $('#modal1').modal('open');
    $('.button-collapse').sideNav({
      menuWidth: 300, // Default is 240
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });
    $('.tooltipped').tooltip({delay: 50});
});
