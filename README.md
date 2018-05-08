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

