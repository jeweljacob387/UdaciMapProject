var map;
var geocoder;
var clientID = "JSYO35QAEAMVF4Q5S41MJL0BX1LX34E5WC31B0PXSGXLD5M2";
var clientSecret= "VV2E2TG1WMDPUHCOAPB1SJHPYD1TOHO0J3K53YOMBRWXU1PR";
//load map in the map div and fetch lovation details
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: {lat: 10.346175, lng: 76.308544}
  });
  geocoder = new google.maps.Geocoder();
  myLocations.forEach(function(venue) {
    let latLng = venueFinder(venue);
  });
  //wait for Geocoding api to load the lattitue , Longitude and the address
  wait();

}
function wait() {
  console.log("waiting....");
  var len = myLocations.length-1;
  console.log(len);
  if(!myLocations[len].lat) {
    setTimeout(wait,200);
  } else {
    ko.applyBindings(new myViewModel());
  }
}
//locations to be marked
var myLocations = [
  {
		name: "Sahrdaya College Of advanced studies"
	},
  {
		name: "Appolo Tyres Perambra"
	},
  {
		name: "St. Joseph's Church Aloor"
	},
  {
		name: "Kodakara Police Station"
	},
  {
		name: "Dhanya Mission Hospital"
	},
  {
		name: "St. Sebastian Church, Thazhekad"
	},
  {
		name: "St.Thomas Church,Anathadam"
	},
  {
		name: "St. Antony's Church perambra"
	},
  {
		name: "Potta Ashram"
	}
];

// this function uses google Geocoder API to fetch latLng and address and push it to myLocations array
function venueFinder(venue) {
  geocoder.geocode({'address': venue.name}, function(results, status) {
        if (status === 'OK') {
            venue.lat = results[0].geometry.location.lat();
            venue.lng = results[0].geometry.location.lng();
            venue.addr = results[0].formatted_address;
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
}

// location constructer
var Venue = function(obj) {
  var self = this;
	this.name = obj.name;
	this.lat = obj.lat;
	this.lng = obj.lng;
  this.addr = obj.addr;
  this.country = "";

  this.vissible = ko.observable("true");


  var url = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20170101' + '&query=' + this.name;

  $.getJSON(url).done(function(data) {
		var venue = data.response.venues[0];
    self.country = venue.location.country;
	}).fail(function() {
		alert("oops!, try refrshing the page. foursquare api shows some error");
	});

  this.infoWindow = new google.maps.InfoWindow({content:
    `<div class="info-window-content">
      <div class="title">
        <b>${self.name}</b>
      </div>
      <div class="content">
        <p>${self.addr}</p>
      </div>
      <div class="content">
        <p>Country:<em>${self.country}</em></p>
      </div>
      <div class="content">
        <p>Longitude:<em>${self.lat}</em></p>
      </div>
      <div class="content">
        <p>Longitude:<em>${self.lng}</em></p>
      </div>
    </div>`
  });

  this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(obj.lat, obj.lng),
			map: map,
			title: self.name
	});
  //look for the vissible property to show or hide marker correspoding to filter list
  this.drop = ko.computed(function() {
		if(this.vissible() === true) {
			this.marker.setMap(map);
		} else {
			this.marker.setMap(null);
		}
		return true;
	}, this);

  this.info = function() {
		google.maps.event.trigger(self.marker, 'click');
    animateSidebar();
	};

  this.marker.addListener('click', function(){
    self.infoWindow.setContent(`<div class="info-window-content">
      <div class="title">
        <b>${self.name}</b>
      </div>
      <div class="content">
        <p>${self.addr}</p>
      </div>
      <div class="content">
        <p>Country:<em>${self.country}</em></p>
      </div>
      <div class="content">
        <p>Latitude:<em>${self.lat}</em></p>
      </div>
      <div class="content">
        <p>Longitude:<em>${self.lng}</em></p>
      </div>
    </div>`);

    self.infoWindow.open(map, this);
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      self.marker.setAnimation(null);
    },700);

});

};

// knockout viewmodel function
function myViewModel() {
  var self = this;
  this.locationList = ko.observableArray([]);
  this.filter = ko.observable("");

  myLocations.forEach(function(loc){
    self.locationList.push(new Venue(loc));
  });

  this.searchList = ko.computed(function() {
    var filter = self.filter().toLowerCase();
    if(!filter) {
      self.locationList().forEach(function(loc){
        loc.vissible(true);
      });
      return self.locationList();
    } else {
      return ko.utils.arrayFilter(self.locationList(), function(loc) {
				var name = loc.name.toLowerCase();
				var res = (name.search(filter) >= 0);
				loc.vissible(res);
				return res;
			});
    }
  },self);
}

function mapLoadError(){
  alert("Google Maps Service Failed to load");
}
