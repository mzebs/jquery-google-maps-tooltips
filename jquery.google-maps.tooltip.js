//
//
//
function MapTooltip(map, tip, onBeforeShow, onBeforeHide) {
  // Don't forget the tip
  var $tooltip = tip;
  // One timer
  var timer = 0;
  // Don't loose our scope
  var self = this;
  // xy position
  var overlay = get_overlay(map);

  if(!$tooltip.hasClass('tooltip-enabled')) {
    // Mouse enter
    $tooltip.bind('mouseenter.tooltip', function(e) {
      stopTimer();
    });

    // Mouse leave
    $tooltip.bind('mouseleave.tooltip', function(e) {
      startTimer(function() { self.hide(200) }, 100);
    });

    $tooltip.addClass('tooltip-enabled');
  }

  // 
  // We need this overlay for getting the markers position
  //
  function get_overlay(map) {
    function ProjectionHelperOverlay(map) {
      this.set_map(map);
    }

    ProjectionHelperOverlay.prototype = new google.maps.OverlayView();
    ProjectionHelperOverlay.prototype.draw = function () {
      if (!this.ready) {
        this.ready = true;
        google.maps.event.trigger(this, 'ready');
      }
    }; 
    return new ProjectionHelperOverlay(map);
  }

  function startTimer(callback, time) {
    stopTimer();
    timer = setTimeout(callback, time);
  }

  function stopTimer() {
    clearTimeout(timer);
  }

  this.show = function(marker) {
    // Hide 
    self.hide(0);

    $tooltip.data('MapTooltips.marker', marker);

    // Callback 
    onBeforeShow(marker, $tooltip);

    // Map world relative to map container
    // TODO This needs to be configurable and more exact
    var p = overlay.get_projection().fromLatLngToDivPixel(marker.get_position());
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

  this.hide = function(time) {
    var marker = $tooltip.data('MapTooltips.marker');

    if(marker && typeof onBeforeHide == 'function') {
      onBeforeHide(marker, $tooltip);
    }
    $tooltip.fadeOut(time);
  }

  this.addMarker = function(marker) {
    google.maps.event.addListener(marker, 'mouseover', function(event) {
      startTimer(function(){ self.show(marker) }, 100);
    });

    google.maps.event.addListener(marker, 'mouseout', function(event) {
      startTimer(function() { self.hide(200) }, 500);
    });
  }
};
