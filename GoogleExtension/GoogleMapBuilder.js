﻿/// <reference path="S:\Delivery\Aspectize.core\AspectizeIntellisense.js" />
/// <reference path="S:\Delivery\Aspectize.core\AspectizeIntellisenseLibrary.js" />

var uniquePositionMarker;

function getGoogleInfo(controlMap) {
    var controlInfo = document.getElementById(controlMap).aasControlInfo;
    if (controlInfo) {
        var googleInfo = controlInfo.aasGoogleInfo;
        if (googleInfo) {
            return googleInfo;
        }
    }
    return null;
}

Global.GoogleMapService = {

    aasService: 'GoogleMapService',
    aasPublished: true,

    GetDirectionUrl: function (addr) {
        var rootUrl = 'http://maps.apple.com/';

        if (addr) {
            rootUrl = rootUrl + '?daddr=' + addr.trim().replace(/\s/g, "+");
        }

        var urlEncode = encodeURI(rootUrl);

        return urlEncode;
    },

    CloseInfoBubble: function (controlMap) {
        var googleInfo = getGoogleInfo(controlMap);

        var currentInfoBubble = googleInfo.InfoBubble;

        if (currentInfoBubble) currentInfoBubble.close();
    },

    ClikOnMarker: function (controlMap, id) {
        var googleInfo = getGoogleInfo(controlMap);
        if (googleInfo) {
            google.maps.event.trigger(googleInfo.Markers[id], 'click');
        }
    },

    GotoPosition: function (controlMap, lat, lng, zoom) {
        var googleInfo = getGoogleInfo(controlMap);
        if (googleInfo) {
            var location = new google.maps.LatLng(lat, lng);
            googleInfo.GotoPosition(location, zoom);
        }
    },

    GotoMyPosition: function (controlMap, zoom) {
        var googleInfo = getGoogleInfo(controlMap);
        if (googleInfo) {
            if (typeof (navigator.geolocation) != 'undefined') {
                navigator.geolocation.getCurrentPosition(function (position) {
                    //googleInfo.GotoPosition(position);
                    initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    googleInfo.GotoPosition(initialLocation, zoom);
                });
            }
        }
    },

    GotoAdress: function (controlMap, adress) {
        var googleInfo = getGoogleInfo(controlMap);
        if (googleInfo) {
            googleInfo.GotoAdress(adress);
        }
    },

    Center: function (controlMap, lat, long) {
        var googleInfo = getGoogleInfo(controlMap);
        if (googleInfo) {
            var center = new google.maps.LatLng(lat, long);
            googleInfo.Map.setCenter(center);
        }
    },

    Refresh: function (controlMap) {
        var googleInfo = getGoogleInfo(controlMap);
        if (googleInfo) {
            google.maps.event.trigger(googleInfo.Map, "resize");
        }
    },

    ZoomPlus: function (controlMap) {
        var googleInfo = getGoogleInfo(controlMap);
        if (googleInfo) {
            var zoom = googleInfo.Map.getZoom();
            zoom++;
            googleInfo.Map.setZoom(zoom);
        }
    },

    ZoomMinus: function (controlMap) {
        var googleInfo = getGoogleInfo(controlMap);
        if (googleInfo) {
            var zoom = googleInfo.Map.getZoom();
            zoom--;
            googleInfo.Map.setZoom(zoom);
        }
    },

    Zoom: function (controlMap, zoom) {
        var googleInfo = getGoogleInfo(controlMap);
        if (googleInfo) {
            googleInfo.Map.setZoom(zoom);
        }
    },

    AddUniquePositionMarker: function (controlMap, myPosition) {
        var googleInfo = getGoogleInfo(controlMap);

        if (uniquePositionMarker) {
            uniquePositionMarker.setMap(null);
        }

        uniquePositionMarker = new google.maps.Marker({
            position: myPosition,
            map: googleInfo.Map,
            optimized: false
        });

        var test = uniquePositionMarker;
    },

    RemoveUniquePositionMarker: function () {
        if (uniquePositionMarker) {
            uniquePositionMarker.setMap(null);
        }
    },

    LatLonFromAddress: function (address, cb) {
        var geocoder = new google.maps.Geocoder();
        if (geocoder) {

            geocoder.geocode({
                address: address

            }, function (r, s) {

                if (s === google.maps.GeocoderStatus.OK) {

                    var lat = r[0].geometry.location.lat();
                    var lng = r[0].geometry.location.lng();

                    cb(lat, lng);
                }
            });
        }

    },

    GeoCode: function (controlMap, latitude, longitude, autoCompleteControl) {
        var googleInfo = getGoogleInfo(controlMap);
        if (googleInfo) {
            var googleMapService = Aspectize.Host.GetService('GoogleMapService');
            var geocoder = googleInfo.GeoCoder;
            if (geocoder) {
                if (latitude && longitude) {
                    var location = new google.maps.LatLng(latitude, longitude);
                    geocoder.geocode({ 'location': location }, function (results, status) {
                        var adressComponent = { Latitude: location.lat(), Longitude: location.lng(), FormatAdress: '', country: '', locality: '', postal_code: '', route: '', street_number: '' };
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                if (autoCompleteControl) {

                                    var input = document.getElementById(autoCompleteControl);

                                    if (input) {
                                        input.value = results[0].formatted_address;
                                    }

                                    googleMapService.AddUniquePositionMarker(controlMap, location);
                                }
                            }
                        }
                        else googleMapService.RemoveUniquePositionMarker();
                    });
                }
                else googleMapService.RemoveUniquePositionMarker();
            }
        }
    }

};

/*
Global.GoogleMapControlBuilder = {

    aasService: 'GoogleMapControlBuilder',
    aasPublished: false,

    Build: function (controlInfo) {

        controlInfo.aasGoogleInfo = {
            Map: null,
            Markers: {},
            GeoCoder: null,
            InfoWindow: null,
            InfoBubble: null,
            AutoComplete: null,
            GotoPosition: function (position, zoom) {
                gotoPosition(this.Map, position, zoom);
            },
            GotoAdress: function (adress) {
                gotoAdress(this.Map, this.GeoCoder, adress);
            }
        };

        controlInfo.CreateInstance = function (ownerWindow, id) {

            var map = Aspectize.createElement('div', ownerWindow);

            map.aasSubControls = {};

            return map;
        };

        function addMarker(latitude, longitude, map, id) {

            var info = { IsNewMarker: false, Marker: null };

            var markers = controlInfo.aasGoogleInfo.Markers;

            if (id in markers) {

                info.Marker = markers[id];

                info.Marker.setMap(map);

            } else {

                info.IsNewMarker = true;

                var location = new google.maps.LatLng(latitude, longitude);

                info.Marker = new google.maps.Marker({ position: location, map: map });

                controlInfo.aasGoogleInfo.Markers[id] = info.Marker;
            }

            return info;
        }

        // Removes the overlays from the map, but keeps them in the array
        function hideOverlays() {

            var markers = controlInfo.aasGoogleInfo.Markers;

            for (id in markers) {

                markers[id].setMap(null);
            }
        }

        // delete invisible overlays
        function clearOverlays() {

            var markers = controlInfo.aasGoogleInfo.Markers;

            for (var id in markers) {
                if (markers[id].getMap() === null) {
                    delete markers[id];
                    break;
                }
            }
        }

        function gotoAdress(map, geocoder, adress) {
            geocoder.geocode({ 'address': adress }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    gotoPosition(map, results[0].geometry.location);
                }
            });
        }

        function gotoPosition(map, position, zoom) {
            var option = {
                center: position
            };

            if (zoom) {
                map.setZoom(zoom);
            }

            //map.setOptions(option);
            map.panTo(position);
        }

        controlInfo.InitGrid = function (control) {

            var controlMap = control;

            controlMap.className = 'GoogleMap';

            google.maps.visualRefresh = true;

            var location = new google.maps.LatLng(48.857713, 2.344894);

            var initLat = Aspectize.UiExtensions.GetProperty(control, 'InitLat');
            var initLng = Aspectize.UiExtensions.GetProperty(control, 'InitLng');

            if (initLat && initLng) {
                location = new google.maps.LatLng(initLat, initLng);
            }

            var mapOptions = {
                center: location,
                disableDoubleClickZoom: Aspectize.UiExtensions.GetProperty(control, 'DisableDoubleClickZoom'),
                scrollwheel: Aspectize.UiExtensions.GetProperty(control, 'Scrollwheel'),
                zoom: Aspectize.UiExtensions.GetProperty(control, 'Zoom'),
                disableDefaultUI: Aspectize.UiExtensions.GetProperty(control, 'DisableDefaultUI'),
                zoomControl: Aspectize.UiExtensions.GetProperty(control, 'EnableZoomControl')
            };

            var map = new google.maps.Map(controlMap, mapOptions);

            controlInfo.aasGoogleInfo.Map = map;

            // Styles de la map
            var styles = [
                {
                    // stylers: [
                    // { hue: "#7e4eA3" },
                    // { saturation: 100 } //-100 N&B
                    // ]
                }, {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [
                    { lightness: 100 },
                    { visibility: "simplified" }
                    ]
                }, {
                    featureType: "road",
                    elementType: "labels",
                    stylers: [
                    { visibility: "on" }
                    ]
                }
            ];

            map.setOptions({ styles: styles });

            var geocoder = new google.maps.Geocoder();

            controlInfo.aasGoogleInfo.GeoCoder = geocoder;

            //var infoBubble = new InfoBubble({
            //    map: map,
            //    shadowStyle: 1,
            //    padding: 0,
            //    arrowSize: 10,
            //    borderWidth: 1,
            //    borderColor: '#bbb',
            //    disableAutoPan: false,
            //    arrowPosition: 50,
            //    disableAnimation: true,
            //    hideCloseButton: true,
            //    arrowStyle: 2,
            //    minHeight: 122
            //});

            //controlInfo.aasGoogleInfo.InfoBubble = infoBubble;

            var addMarkerOnClick = Aspectize.UiExtensions.GetProperty(control, 'AddMarkerOnClick');

            google.maps.event.addListener(map, 'click', function (event) {

                var currentInfoBubble = controlInfo.aasGoogleInfo.InfoBubble;

                if (currentInfoBubble) currentInfoBubble.close();

                if (addMarkerOnClick) {

                    var defaultMarkerUrlIcon = Aspectize.UiExtensions.GetProperty(control, 'DefaultMarkerUrlIcon');

                    geocoder.geocode({ 'location': event.latLng }, function (results, status) {
                        var adressComponent = { Latitude: event.latLng.lat(), Longitude: event.latLng.lng(), FormatAdress: '', country: '', locality: '', postal_code: '', route: '', street_number: '' };
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                adressComponent['FormatAdress'] = results[0].formatted_address;
                                for (var i = 0; i < results[0].address_components.length; i++) {
                                    var address_component = results[0].address_components[i];
                                    var infoType = address_component.types[0];
                                    if (infoType in adressComponent) {
                                        adressComponent[infoType] = address_component.long_name;
                                    }
                                }
                            }
                        }
                        Aspectize.UiExtensions.Notify(control, 'OnMapClick', adressComponent);
                    });
                }
            });
        };

        controlInfo.BeforeRender = function (control) {
            hideOverlays();
        };

        controlInfo.RowCreated = function (control, rowId, cellControls) {

            var item = { id: rowId };

            var map = controlInfo.aasGoogleInfo.Map;
            var geocoder = controlInfo.aasGoogleInfo.GeoCoder;
            var infoWindow = controlInfo.aasGoogleInfo.InfoWindow;
            var infoBubble = controlInfo.aasGoogleInfo.InfoBubble;

            var controlMarker = cellControls[0];  // une seule colonne de type GoogleMarkerPart

            var title = Aspectize.UiExtensions.GetProperty(controlMarker, 'Title');
            var label = Aspectize.UiExtensions.GetProperty(controlMarker, 'Label');
            var latitude = Aspectize.UiExtensions.GetProperty(controlMarker, 'Latitude');
            var longitude = Aspectize.UiExtensions.GetProperty(controlMarker, 'Longitude');

            var draggable = Aspectize.UiExtensions.GetProperty(controlMarker, 'Draggable');
            var visible = Aspectize.UiExtensions.GetProperty(controlMarker, 'Visible');
            var urlIcon = Aspectize.UiExtensions.GetProperty(controlMarker, 'UrlIcon');
            var infoWindowText = Aspectize.UiExtensions.GetProperty(controlMarker, 'InfoWindowText');

            var data = addMarker(latitude, longitude, map, rowId);

            if (data.IsNewMarker) {

                var marker = data.Marker;

                marker.setVisible(visible);
                marker.setDraggable(draggable);
                marker.setTitle(title);
                marker.setLabel(label);
                marker.infoWindowText = infoWindowText;

                controlMarker.aasMarkerInfo = marker;

                if (urlIcon) {

                    //if (Aspectize.Host.MobileMode) {
                    //    var parts = Aspectize.Host.MobileUrl.split('/');
                    //    parts[parts.length - 1] = '';
                    //    urlIcon = parts.join('/') + urlIcon;
                    //}

                    var image = new google.maps.MarkerImage(urlIcon, new google.maps.Size(32, 32), new google.maps.Point(0, 0),

                        new google.maps.Point(16, 32) // The anchor for this image is the base of the flagpole
                    );

                    marker.setIcon(image);
                }

                //marker.setMap(map);

                google.maps.event.addListener(marker, 'click', function () {
                    Aspectize.UiExtensions.SetCurrent(control, item.id);
                    Aspectize.UiExtensions.Notify(controlMarker, 'OnMarkerClick', { 'marker': marker, 'item': item, 'infoWindow': infoWindow, 'infoBubble': infoBubble });
                });

                google.maps.event.addListener(marker, 'mouseover', function () {
                    Aspectize.UiExtensions.Notify(controlMarker, 'OnMarkerMouseOver', { 'marker': marker, 'item': item, 'infoWindow': infoWindow, 'infoBubble': infoBubble });
                });

                google.maps.event.addListener(marker, 'mouseout', function () {
                    Aspectize.UiExtensions.Notify(controlMarker, 'OnMarkerMouseOut', { 'marker': marker, 'item': item, 'infoWindow': infoWindow, 'infoBubble': infoBubble });
                });

                if (draggable) {
                    google.maps.event.addListener(marker, 'dragstart', function () {
                        Aspectize.UiExtensions.SetCurrent(control, item.id);
                        Aspectize.UiExtensions.Notify(controlMarker, 'OnDragBegin', { 'marker': marker, 'item': item });
                    });

                    google.maps.event.addListener(marker, 'dragend', function () {
                        var newLatitude = marker.getPosition().lat();
                        var newLongitude = marker.getPosition().lng();
                        Aspectize.UiExtensions.ChangeProperty(controlMarker, 'Longitude', newLongitude);
                        Aspectize.UiExtensions.ChangeProperty(controlMarker, 'Latitude', newLatitude);

                        geocoder.geocode({ 'location': marker.getPosition() }, function (results, status) {
                            var adressComponent = { Latitude: marker.getPosition().lat(), Longitude: marker.getPosition().lng(), FormatAdress: '', country: '', locality: '', postal_code: '', route: '', street_number: '' };
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (results[0]) {
                                    adressComponent['FormatAdress'] = results[0].formatted_address;
                                    for (var i = 0; i < results[0].address_components.length; i++) {
                                        var address_component = results[0].address_components[i];
                                        var infoType = address_component.types[0];
                                        if (infoType in adressComponent) {
                                            adressComponent[infoType] = address_component.long_name;
                                        }
                                    }
                                }
                            }
                            Aspectize.UiExtensions.Notify(controlMarker, 'OnDragEnd', { 'marker': marker, 'item': item, 'adressComponent': adressComponent });
                        });


                        //Aspectize.UiExtensions.Notify(controlMarker, 'OnDragEnd', { 'marker': marker, 'item': item });
                    });
                }
            } else {

                controlMarker.aasMarkerInfo = data.Marker;
            }
        };

        controlInfo.GridRendered = function (control, rowControls) {
            clearOverlays();

            var autoCompleteControl = Aspectize.UiExtensions.GetProperty(control, 'AutoComplete');

            if (autoCompleteControl) {
                if (!control.aasControlInfo.aasGoogleInfo.AutoComplete) {

                    var input = document.getElementById(autoCompleteControl);

                    if (input) {
                        var autoComplete = new google.maps.places.Autocomplete(input);

                        google.maps.event.addListener(autoComplete, 'place_changed', function () {

                            var map = control.aasControlInfo.aasGoogleInfo.Map;

                            var place = autoComplete.getPlace();
                            if (!place.geometry) {
                                // Inform the user that the place was not found and return.
                                return;
                            }

                            // If the place has a geometry, then present it on a map.
                            if (place.geometry.viewport) {
                                map.fitBounds(place.geometry.viewport);
                            } else {
                                map.setCenter(place.geometry.location);
                                map.setZoom(14);
                            }

                            Aspectize.UiExtensions.Notify(control, 'OnAutoComplete', { 'place': place });

                        });

                        control.aasControlInfo.aasGoogleInfo.AutoComplete = autoComplete;
                    }
                }
            }
        };
    }
};


Global.GoogleMapControlMarkerBuilder = {

    aasService: 'GoogleMapControlMarkerBuilder',
    aasPublished: false,

    Build: function (controlInfo) {

        controlInfo.IsExtendedCell = true;

        controlInfo.CreateInstance = function (ownerWindow, id) {

            var control = Aspectize.createElement('div', ownerWindow);

            return control;
        };

        controlInfo.InitCell = function (cell) {

            Aspectize.UiExtensions.AddMergedPropertyChangeObserver(cell, function (sender, arg) {

                var marker = cell.aasMarkerInfo;

                if (marker) {
                    if ('UrlIcon' in arg) {
                        var urlIcon = arg.UrlIcon;

                        if (Aspectize.Host.MobileMode) {
                            var parts = Aspectize.Host.MobileUrl.split('/');
                            parts.splice(0, parts.length);
                            urlIcon = parts.join('/') + urlIcon;
                        }
                        var defaultIconWidth = cell.aasGetProperty('IconWidth') || 32;
                        var defaultIconHeight = cell.aasGetProperty('IconHeight') || 32;
                        var defaultIconOriginX = cell.aasGetProperty('IconOriginX') || 0;
                        var defaultIconOriginY = cell.aasGetProperty('IconOriginY') || 0;
                        var defaultIconAnchorX = cell.aasGetProperty('IconAnchorX') || 16;
                        var defaultIconAnchorY = cell.aasGetProperty('IconAnchorY') || 32;

                        var iconWidth = ('IconWidth' in arg) ? arg.IconWidth : defaultIconWidth;
                        var iconHeight = ('IconHeight' in arg) ? arg.IconHeight : defaultIconHeight;
                        var iconOriginX = ('IconOriginX' in arg) ? arg.IconOriginX : defaultIconOriginX;
                        var iconOriginY = ('IconOriginY' in arg) ? arg.IconOriginY : defaultIconOriginY;
                        var iconAnchorX = ('IconAnchorX' in arg) ? arg.IconAnchorX : defaultIconAnchorX;
                        var iconAnchorY = ('IconAnchorY' in arg) ? arg.IconAnchorY : defaultIconAnchorY;

                        //var image = new google.maps.MarkerImage(urlIcon,
                        //    new google.maps.Size(iconWidth, iconHeight),
                        //    new google.maps.Point(iconOriginX, iconOriginY),
                        //    new google.maps.Point(iconAnchorX, iconAnchorY));

                        var image = {
                            url: urlIcon,
                            size: new google.maps.Size(iconWidth, iconHeight),
                            origin: new google.maps.Point(iconOriginX, iconOriginY),
                            anchor: new google.maps.Point(iconAnchorX, iconAnchorY)
                        };

                        marker.setIcon(image);
                    }

                    if ('Title' in arg) {
                        marker.setTitle(arg.Title);
                    }

                    if ('Longitude' in arg || 'Latitude' in arg) {
                        var currentPosition = marker.getPosition();
                        var longitude = ('Longitude' in arg) ? arg.Longitude : currentPosition.lng();
                        var latitude = ('Latitude' in arg) ? arg.Latitude : currentPosition.lat();

                        var newPosition = new google.maps.LatLng(latitude, longitude);
                        marker.setPosition(newPosition);
                    }
                }
            });            
        };

    }
};
*/

Aspectize.Extend("GoogleMapControl", {

    Binding: 'GridBinding',

    Properties: { DefaultMarkerUrlIcon: '', DisableDoubleClickZoom: false, Scrollwheel: true, AddMarkerOnClick: false, AutoComplete: '', Zoom: 12, InitLat: 0, InitLng: 0, DisableDefaultUI: true, EnableZoomControl: false, CurrentLat: 0, CurrentLng: 0 },
    Events: ['OnMapClick', 'OnAutoComplete', 'OnIdle', 'OnZoomChanged'],

    Init: function (control, controlInfo) {

        function addMarker(latitude, longitude, map, id) {

            var info = { IsNewMarker: false, Marker: null };

            var markers = controlInfo.aasGoogleInfo.Markers;

            if (id in markers) {

                info.Marker = markers[id];

                info.Marker.setMap(map);

            } else {

                info.IsNewMarker = true;

                var location = new google.maps.LatLng(latitude, longitude);

                info.Marker = new google.maps.Marker({ position: location, map: map, optimized: false });

                controlInfo.aasGoogleInfo.Markers[id] = info.Marker;
            }

            return info;
        }

        // Removes the overlays from the map, but keeps them in the array
        function hideOverlays() {

            var markers = controlInfo.aasGoogleInfo.Markers;

            for (id in markers) {

                markers[id].setMap(null);
            }
        }

        // delete invisible overlays
        function clearOverlays() {

            var markers = controlInfo.aasGoogleInfo.Markers;

            for (var id in markers) {
                if (markers[id].getMap() === null) {
                    delete markers[id];
                    break;
                }
            }
        }

        function gotoAdress(map, geocoder, adress) {
            geocoder.geocode({ 'address': adress }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    gotoPosition(map, results[0].geometry.location);
                }
            });
        }

        function gotoPosition(map, position, zoom) {
            var option = {
                center: position
            };

            if (zoom) {
                map.setZoom(zoom);
            }

            //map.setOptions(option);
            map.panTo(position);
        }

        controlInfo.aasGoogleInfo = {
            Map: null,
            Markers: {},
            GeoCoder: null,
            InfoWindow: null,
            InfoBubble: null,
            AutoComplete: null,
            GotoPosition: function (position, zoom) {
                gotoPosition(this.Map, position, zoom);
            },
            GotoAdress: function (adress) {
                gotoAdress(this.Map, this.GeoCoder, adress);
            }
        };

        control.className = 'GoogleMap';

        google.maps.visualRefresh = true;

        var location = new google.maps.LatLng(48.857713, 2.344894);

        var initLat = Aspectize.UiExtensions.GetProperty(control, 'InitLat');
        var initLng = Aspectize.UiExtensions.GetProperty(control, 'InitLng');

        if (initLat && initLng) {
            location = new google.maps.LatLng(initLat, initLng);
        }


        var mapOptions = {
            center: location,
            disableDoubleClickZoom: Aspectize.UiExtensions.GetProperty(control, 'DisableDoubleClickZoom'),
            scrollwheel: Aspectize.UiExtensions.GetProperty(control, 'Scrollwheel'),
            zoom: Aspectize.UiExtensions.GetProperty(control, 'Zoom'),
            disableDefaultUI: Aspectize.UiExtensions.GetProperty(control, 'DisableDefaultUI'),
            zoomControl: Aspectize.UiExtensions.GetProperty(control, 'EnableZoomControl'),
            styles: styles
        };

        var map = new google.maps.Map(control, mapOptions);

        controlInfo.aasGoogleInfo.Map = map;

        // Styles de la map
        var styles = [
            {
                featureType: "road", elementType: "geometry",
                stylers: [ { lightness: 100 }, { visibility: "simplified" } ]
            }, {
                featureType: "road", elementType: "labels",
                stylers: [ { visibility: "on" } ]
            }, {
                featureType: "administrative", elementType: "geometry",
                stylers: [{ "visibility": "off" }]
            }, {
                featureType: "poi",
                stylers: [{ "visibility": "off" }]
            }, {
                featureType: "road", elementType: "labels.icon",
                stylers: [{ "visibility": "off" }]
            }, {
                featureType: "transit",
                stylers: [{ "visibility": "off" }]
            }
        ];

        map.setOptions({ styles: styles });

        var geocoder = new google.maps.Geocoder();

        controlInfo.aasGoogleInfo.GeoCoder = geocoder;

        //var infoBubble = new InfoBubble({
        //    map: map,
        //    shadowStyle: 1,
        //    padding: 0,
        //    arrowSize: 10,
        //    borderWidth: 1,
        //    borderColor: '#bbb',
        //    disableAutoPan: false,
        //    arrowPosition: 50,
        //    disableAnimation: true,
        //    hideCloseButton: true,
        //    arrowStyle: 2,
        //    minHeight: 122
        //});

        //controlInfo.aasGoogleInfo.InfoBubble = infoBubble;

        map.addListener('zoom_changed', function () {
            var z = map.getZoom();
            Aspectize.UiExtensions.ChangeProperty(control, 'Zoom', z);
        });

        var addMarkerOnClick = Aspectize.UiExtensions.GetProperty(control, 'AddMarkerOnClick');

        google.maps.event.addListener(map, 'click', function (event) {

            var currentInfoBubble = controlInfo.aasGoogleInfo.InfoBubble;

            if (currentInfoBubble) currentInfoBubble.close();

            if (addMarkerOnClick) {

                var defaultMarkerUrlIcon = Aspectize.UiExtensions.GetProperty(control, 'DefaultMarkerUrlIcon');

                geocoder.geocode({ 'location': event.latLng }, function (results, status) {
                    var adressComponent = { Latitude: event.latLng.lat(), Longitude: event.latLng.lng(), FormatAdress: '', country: '', locality: '', postal_code: '', route: '', street_number: '' };
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            adressComponent['FormatAdress'] = results[0].formatted_address;
                            for (var i = 0; i < results[0].address_components.length; i++) {
                                var address_component = results[0].address_components[i];
                                var infoType = address_component.types[0];
                                if (infoType in adressComponent) {
                                    adressComponent[infoType] = address_component.long_name;
                                }
                            }
                        }
                    }
                    Aspectize.UiExtensions.Notify(control, 'OnMapClick', adressComponent);
                });
            }
        });

        google.maps.event.addListener(map, 'idle', function () {
            Aspectize.UiExtensions.Notify(control, 'OnIdle', { 'map': map });
            var NewMapCenter = map.getCenter();
            var latitude = NewMapCenter.lat();
            var longitude = NewMapCenter.lng();
            Aspectize.UiExtensions.ChangeProperty(control, 'CurrentLat', latitude);
            Aspectize.UiExtensions.ChangeProperty(control, 'CurrentLng', longitude);
        });

        controlInfo.BeforeRender = function (control) {
            hideOverlays();
        };

        controlInfo.RowCreated = function (control, rowId, cellControls) {

            var item = { id: rowId };

            var map = controlInfo.aasGoogleInfo.Map;
            var geocoder = controlInfo.aasGoogleInfo.GeoCoder;
            var infoWindow = controlInfo.aasGoogleInfo.InfoWindow;
            var infoBubble = controlInfo.aasGoogleInfo.InfoBubble;

            var controlMarker = cellControls[0];  // une seule colonne de type GoogleMarkerPart

            var title = Aspectize.UiExtensions.GetProperty(controlMarker, 'Title');
            var label = Aspectize.UiExtensions.GetProperty(controlMarker, 'Label');
            var latitude = Aspectize.UiExtensions.GetProperty(controlMarker, 'Latitude');
            var longitude = Aspectize.UiExtensions.GetProperty(controlMarker, 'Longitude');

            var draggable = Aspectize.UiExtensions.GetProperty(controlMarker, 'Draggable');
            var visible = Aspectize.UiExtensions.GetProperty(controlMarker, 'Visible');
            var urlIcon = Aspectize.UiExtensions.GetProperty(controlMarker, 'UrlIcon');
            var infoWindowText = Aspectize.UiExtensions.GetProperty(controlMarker, 'InfoWindowText');

            var data = addMarker(latitude, longitude, map, rowId);

            if (data.IsNewMarker) {

                var marker = data.Marker;

                marker.setVisible(visible);
                marker.setDraggable(draggable);
                marker.setTitle(title);
                marker.setLabel(label);
                marker.infoWindowText = infoWindowText;

                controlMarker.aasMarkerInfo = marker;

                if (urlIcon) {

                    var image = new google.maps.MarkerImage(urlIcon, new google.maps.Size(32, 32), new google.maps.Point(0, 0),

                        new google.maps.Point(16, 32) // The anchor for this image is the base of the flagpole
                    );

                    marker.setIcon(image);
                }

                //marker.setMap(map);
                //map.addListener('idle', function () {
                //google.maps.event.addListener(map, 'idle', function () {
                //    Aspectize.UiExtensions.Notify(control, 'OnIdle', { 'map': map });
                //});

                google.maps.event.addListener(marker, 'click', function () {
                    Aspectize.UiExtensions.SetCurrent(control, item.id);
                    Aspectize.UiExtensions.Notify(controlMarker, 'OnMarkerClick', { 'marker': marker, 'item': item, 'infoWindow': infoWindow, 'infoBubble': infoBubble });
                });

                google.maps.event.addListener(marker, 'mouseover', function () {
                    Aspectize.UiExtensions.Notify(controlMarker, 'OnMarkerMouseOver', { 'marker': marker, 'item': item, 'infoWindow': infoWindow, 'infoBubble': infoBubble });
                });

                google.maps.event.addListener(marker, 'mouseout', function () {
                    Aspectize.UiExtensions.Notify(controlMarker, 'OnMarkerMouseOut', { 'marker': marker, 'item': item, 'infoWindow': infoWindow, 'infoBubble': infoBubble });
                });

                if (draggable) {
                    google.maps.event.addListener(marker, 'dragstart', function () {
                        Aspectize.UiExtensions.SetCurrent(control, item.id);
                        Aspectize.UiExtensions.Notify(controlMarker, 'OnDragBegin', { 'marker': marker, 'item': item });
                    });

                    google.maps.event.addListener(marker, 'dragend', function () {
                        var newLatitude = marker.getPosition().lat();
                        var newLongitude = marker.getPosition().lng();
                        Aspectize.UiExtensions.ChangeProperty(controlMarker, 'Longitude', newLongitude);
                        Aspectize.UiExtensions.ChangeProperty(controlMarker, 'Latitude', newLatitude);

                        geocoder.geocode({ 'location': marker.getPosition() }, function (results, status) {
                            var adressComponent = { Latitude: marker.getPosition().lat(), Longitude: marker.getPosition().lng(), FormatAdress: '', country: '', locality: '', postal_code: '', route: '', street_number: '' };
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (results[0]) {
                                    adressComponent['FormatAdress'] = results[0].formatted_address;
                                    for (var i = 0; i < results[0].address_components.length; i++) {
                                        var address_component = results[0].address_components[i];
                                        var infoType = address_component.types[0];
                                        if (infoType in adressComponent) {
                                            adressComponent[infoType] = address_component.long_name;
                                        }
                                    }
                                }
                            }
                            Aspectize.UiExtensions.Notify(controlMarker, 'OnDragEnd', { 'marker': marker, 'item': item, 'adressComponent': adressComponent });
                        });
                    });
                }

            } else {

                controlMarker.aasMarkerInfo = data.Marker;
            }
        };

        controlInfo.GridRendered = function (control, rowControls) {
            clearOverlays();

            var autoCompleteControl = Aspectize.UiExtensions.GetProperty(control, 'AutoComplete');

            if (autoCompleteControl) {
                if (!control.aasControlInfo.aasGoogleInfo.AutoComplete) {

                    var input = document.getElementById(autoCompleteControl);

                    if (input) {
                        var autoComplete = new google.maps.places.Autocomplete(input);

                        google.maps.event.addListener(autoComplete, 'place_changed', function () {

                            var map = control.aasControlInfo.aasGoogleInfo.Map;

                            var place = autoComplete.getPlace();
                            if (!place.geometry) {
                                // Inform the user that the place was not found and return.
                                return;
                            }

                            // If the place has a geometry, then present it on a map.
                            if (place.geometry.viewport) {
                                map.fitBounds(place.geometry.viewport);
                            } else {
                                map.setCenter(place.geometry.location);
                                map.setZoom(14);
                            }

                            Aspectize.UiExtensions.Notify(control, 'OnAutoComplete', { 'place': place });

                        });

                        control.aasControlInfo.aasGoogleInfo.AutoComplete = autoComplete;
                    }
                }
            }
        };
    }
});

Aspectize.Extend("GoogleMarkerPart", {

    Binding: 'ColumnBinding',

    Properties: { Title: '', Label: '', Draggable: false, Visible: true, UrlIcon: '', Longitude: 0, Latitude: 0, InfoWindowText: '', IconWidth: 32, IconHeight: 32, IconOriginX: 0, IconOriginY: 0, IconAnchorX: 16, IconAnchorY: 32, zIndex: 0 },
    Events: ['OnPropertyChanged', 'OnLongitudeChanged', 'OnLatitudeChanged', 'OnUrlIconChanged', 'OnMarkerClick', 'OnDragBegin', 'OnDragEnd', 'OnMarkerMouseOver', 'OnMarkerMouseOut'],
    Init: function (control, controlInfo) {

        Aspectize.UiExtensions.AddMergedPropertyChangeObserver(control, function (sender, arg) {

            var cell = control;

            var marker = cell.aasMarkerInfo;

            if (marker) {
                if ('UrlIcon' in arg) {
                    var urlIcon = arg.UrlIcon;

                    if (Aspectize.Host.MobileMode) {
                        var parts = Aspectize.Host.MobileUrl.split('/');
                        parts.splice(0, parts.length);
                        urlIcon = parts.join('/') + urlIcon;
                    }
                    var defaultIconWidth = cell.aasGetProperty('IconWidth') || 32;
                    var defaultIconHeight = cell.aasGetProperty('IconHeight') || 32;
                    var defaultIconOriginX = cell.aasGetProperty('IconOriginX') || 0;
                    var defaultIconOriginY = cell.aasGetProperty('IconOriginY') || 0;
                    var defaultIconAnchorX = cell.aasGetProperty('IconAnchorX') || 16;
                    var defaultIconAnchorY = cell.aasGetProperty('IconAnchorY') || 32;

                    var iconWidth = ('IconWidth' in arg) ? arg.IconWidth : defaultIconWidth;
                    var iconHeight = ('IconHeight' in arg) ? arg.IconHeight : defaultIconHeight;
                    var iconOriginX = ('IconOriginX' in arg) ? arg.IconOriginX : defaultIconOriginX;
                    var iconOriginY = ('IconOriginY' in arg) ? arg.IconOriginY : defaultIconOriginY;
                    var iconAnchorX = ('IconAnchorX' in arg) ? arg.IconAnchorX : defaultIconAnchorX;
                    var iconAnchorY = ('IconAnchorY' in arg) ? arg.IconAnchorY : defaultIconAnchorY;

                    //var image = new google.maps.MarkerImage(urlIcon,
                    //    new google.maps.Size(iconWidth, iconHeight),
                    //    new google.maps.Point(iconOriginX, iconOriginY),
                    //    new google.maps.Point(iconAnchorX, iconAnchorY));

                    var image = {
                        url: urlIcon,
                        size: new google.maps.Size(iconWidth, iconHeight),
                        origin: new google.maps.Point(iconOriginX, iconOriginY),
                        anchor: new google.maps.Point(iconAnchorX, iconAnchorY)
                    };

                    marker.setIcon(image);
                }

                if ('Title' in arg) {
                    marker.setTitle(arg.Title);
                }

                if ('zIndex' in arg) {
                    marker.setZIndex(arg.zIndex);
                }

                if ('Longitude' in arg || 'Latitude' in arg) {
                    var currentPosition = marker.getPosition();
                    var longitude = ('Longitude' in arg) ? arg.Longitude : currentPosition.lng();
                    var latitude = ('Latitude' in arg) ? arg.Latitude : currentPosition.lat();

                    var newPosition = new google.maps.LatLng(latitude, longitude);
                    marker.setPosition(newPosition);
                }
            }
        });
    }
});