# GoogleExtension
Google chart &amp; map Aspectize Extension

## 1 - Download 

Download extension package from aspectize.com:
- in the portal, goto extension section
- browse extension, and find GoogleExtension
- download package and unzip it into your local WebHost Applications directory; you should have a GoogleExtension directory next to your app directory.

## 2 - Configuration

Add GoogleExtension as Shared Application in your application configuration file.
In your Visual Studio Project, find the file Application.js in the Configuration folder.

Add JQueryRateIt in the Directories list :
```javascript
app.Directories = "GoogleExtension";
```

## 3 - Add js into tour ashx file

