# GoogleExtension
Google chart &amp; map Aspectize Extension

## 1 - Download

Download extension package from aspectize.com:
- in Aspectize portal, goto extension section
- browse extension, and find GoogleExtension
- download package and unzip it into your local WebHost Applications directory; you should have a GoogleExtension directory next to your app directory.

## 2 - Configuration

Add GoogleExtension as Shared Application in your application configuration file.
In your Visual Studio Project, find the file Application.js in the Configuration folder.

Add GoogleExtension in the Directories list :
```javascript
app.Directories = "GoogleExtension";
```

## 3 - Include js into your ashx file

In your application.htm.ashx file, add the following lines (choose the different library you need from Google)
```javascript
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript">
    google.load('maps','3',{'other_params':'libraries=places'});
    google.load('visualization', '1.0', {'packages':['annotatedtimeline', 'corechart', 'table', 'geochart', 'orgchart']});
</script>
```

## 4 - Usage

### 1 - Map

a/ Html

Insert the following html into your control:
```html
<div aas-name="Map" aas-type="GoogleExtension.GoogleMapControl"></div>
```

Be carefull with css, you may have to define width and height of your Map explicitly:

```
#ViewName-Map {
min-height: 500px;
min-width: 500px;
}
```

b/ Binding

Binding a Map is the same as binding a Grid: Marker is equivalent of Column.

```javascript
vGoogleMap.Map.BindGrid(aas.Data.MapData.MyPlaces);
var map = vGoogleMap.Map.AddGridColumn("Place", "GoogleExtension.GoogleMarkerPart");
map.Latitude.BindData(vGoogleMap.Map.DataSource.Latitude);
map.Longitude.BindData(vGoogleMap.Map.DataSource.Longitude);
```

GoogleMarkerPart has the following bindable properties:
- Title: marker title.
- Label: marker label.
- Draggable: marker draggable, if true use OnDragBegin and OnDragEnd events to manage behavior. Default is false.
- Visible: marker visible. Default is true.
- UrlIcon: url of marker icon. If not set, default marker from Google is used.
- IconWidth: width of marker icon. Default is 32.
- IconHeight: height of marker icon. Default is 32.
- IconOriginX: origin x of marker icon. Default is 0.
- IconOriginY: origin y of marker icon. Default is 0.
- IconAnchorX: anchor x of marker icon. Default is 16. 
- IconAnchorY: anchor y of marker icon. Default is 32.
- Latitude: marker latitude.
- Longitude: marker longitude.

GoogleMarkerPart has the following bindable events:
- OnMarkerClick: raised when click on Marker.
- OnDragBegin: if Marker is draggable, raised when drag begins.
- OnDragEnd: if Marker is draggable, raised when drag ends.
- OnMarkerMouseOver: raised on mouseOver event.
- OnMarkerMouseOut: raised on mouseOut event.

GoogleMapControl has the following bindable properties:
- DisableDoubleClickZoom: map disableDoubleClickZoom. Default is false.
- Scrollwheel: map scrollwheel. Default is true.
- AddMarkerOnClick: if true, add a marker and notify OnMapClick event. Default is false.
- Zoom: map zoom. Default is 12.
- InitLat: map center latitude. 
- InitLng: map center longitude. 
- DisableDefaultUI: map disableDefaultUI. Default is true.
- EnableZoomControl: map zoomControl. Default is false.

GoogleMapControl has the following bindable events:
- OnMapClick: raised when click on Map.


