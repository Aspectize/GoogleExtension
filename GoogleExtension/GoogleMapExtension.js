/// <reference path="S:\Delivery\Aspectize.core\AspectizeIntellisenseLibrary.js" />

Aspectize.Extend("GoogleMapPlaceInput", {
    Properties: { Longitude: null, Latitude: null, FullAdress: '', Name: '', StreetNumber: '', Route: '', City: '', Zip: '', Country: '', SearchType: '', RestrictToCountry: '' },
    Events: ['OnLongitudeChanged', 'OnLatitudeChanged', 'OnFullAdressChanged', 'OnNameChanged', 'OnStreetNumberChanged', 'OnRouteChanged', 'OnCityChanged', 'OnZipChanged', 'OnCountryChanged'],
    Init: function (elem) {

        var options = null;
        var autocomplete = null;
        var listener = null;

        function palceChanged() {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }

            if (place.geometry.location) {
                Aspectize.UiExtensions.ChangeProperty(elem, 'Longitude', place.geometry.location.lng());
                Aspectize.UiExtensions.ChangeProperty(elem, 'Latitude', place.geometry.location.lat());
            }

            var address = '';
            if (place.address_components) {

                for (var i = 0; i < place.address_components.length; i++) {
                    var adressElement = place.address_components[i];

                    for (var j = 0; j < adressElement.types.length; j++) {
                        var type = adressElement.types[j];
                        var property;
                        if (type === "postal_code") {
                            property = "Zip";
                        } else if (type == "country") {
                            property = "Country";
                        } else if (type == "locality") { // "locality") {
                            property = "City";
                        } else if (type == "street_number") {
                            property = "StreetNumber";
                        } else if (type == "route") {
                            property = "Route";
                        } else continue;

                        value = adressElement.long_name;
                        Aspectize.UiExtensions.ChangeProperty(elem, property, value);
                        break;
                    }
                }
            }
            Aspectize.UiExtensions.ChangeProperty(elem, 'Name', place.name);
            Aspectize.UiExtensions.ChangeProperty(elem, 'FullAdress', place.formatted_address);
        }

        function rebuildAutocomplete() {

            var searchType = Aspectize.UiExtensions.GetProperty(elem, 'SearchType');
            var rectrictedCountry = Aspectize.UiExtensions.GetProperty(elem, 'RestrictToCountry');

            if (searchType || rectrictedCountry) {

                options = {};
                if (searchType) {

                    options.types = searchType.split(',');
                }

                if (rectrictedCountry) {

                    options.componentRestrictions = { country: rectrictedCountry };
                }

                if (listener) google.maps.event.removeListener(listener);                
            }

            autocomplete = options ? new google.maps.places.Autocomplete(elem, options) : new google.maps.places.Autocomplete(elem);

            listener = google.maps.event.addListener(autocomplete, 'place_changed', palceChanged);
        }

        rebuildAutocomplete();

        //#region ToDelete
        //var autocomplete = new google.maps.places.Autocomplete(elem);

        //google.maps.event.addListener(autocomplete, 'place_changed', function () {
        //    var place = autocomplete.getPlace();
        //    if (!place.geometry) {
        //        return;
        //    }

        //    if (place.geometry.location) {
        //        Aspectize.UiExtensions.ChangeProperty(elem, 'Longitude', place.geometry.location.lng());
        //        Aspectize.UiExtensions.ChangeProperty(elem, 'Latitude', place.geometry.location.lat());
        //    }

        //    var address = '';
        //    if (place.address_components) {

        //        for (var i = 0; i < place.address_components.length; i++) {
        //            var adressElement = place.address_components[i];

        //            for (var j = 0; j < adressElement.types.length; j++) {
        //                var type = adressElement.types[j];
        //                var property;
        //                if (type === "postal_code") {
        //                    property = "Zip";
        //                } else if (type == "country") {
        //                    property = "Country";
        //                } else if (type == "locality") { // "locality") {
        //                    property = "City";
        //                } else if (type == "street_number") {
        //                    property = "StreetNumber";
        //                } else if (type == "route") {
        //                    property = "Route";
        //                } else continue;

        //                value = adressElement.long_name;
        //                Aspectize.UiExtensions.ChangeProperty(elem, property, value);
        //                break;
        //            }
        //        }
        //    }
        //    Aspectize.UiExtensions.ChangeProperty(elem, 'Name', place.name);
        //    Aspectize.UiExtensions.ChangeProperty(elem, 'FullAdress', place.formatted_address);
        //});
        //#endregion

        Aspectize.UiExtensions.AddMergedPropertyChangeObserver(elem, function (sender, arg) {
            if ('FullAdress' in arg) {
                $(elem).val(arg.FullAdress);
            }

            if (arg.SearchType || arg.RestrictToCountry) {

                rebuildAutocomplete();
            }

        });
    }
});
