//
//
//
function MapTooltip(tip, onBeforeShow) {
  // Don't forget the tip
  var $tooltip = tip;
  // One timer
  var timer = 0;
  // Don't loose our scope
  var self = this;

  if(!$tooltip.hasClass('tooltip-enabled')) {
    // Mouse enter
    $tooltip.bind('mouseenter.tooltip', function(e) {
      stopTimer();
    });

    // Mouse leave
    $tooltip.bind('mouseleave.tooltip', function(e) {
      startTimer(function() { self.hide() }, 100);
    });

    $tooltip.addClass('tooltip-enabled');
  }

  function startTimer(callback, time) {
    stopTimer();
    timer = setTimeout(callback, time);
  }

  function stopTimer() {
    clearTimeout(timer);
  }

  this.show = function(marker) {
    var p = overlay.get_projection().fromLatLngToDivPixel(marker.get_position());

    $tooltip.hide();

    // Callback 
    onBeforeShow(marker, $tooltip);

    // Map world relative to map container
    // TODO This needs to be configurable and more exact
    var dragObject = overlay.get_panes().mapPane.parentNode;
    var x = p.x + $tooltip.width(); // + parseInt(dragObject.style.left);
    var y = p.y + $tooltip.height() / 2; // + parseInt(dragObject.style.top);

    $tooltip.css({ 
      position: "absolute",
      'z-index': 20000,
      top: y, left: x 
    });

    $tooltip.animate({"top": "+=20px", "opacity": "toggle"}, 300);  
  }

  this.hide = function() {
    $tooltip.fadeOut(200);
  }

  this.addMarker = function(marker) {
    google.maps.event.addListener(marker, 'mouseover', function(event) {
      startTimer(function(){ self.show(marker) }, 100);
    });

    google.maps.event.addListener(marker, 'mouseout', function(event) {
      startTimer(function() { self.hide() }, 500);
    });
  }
};
