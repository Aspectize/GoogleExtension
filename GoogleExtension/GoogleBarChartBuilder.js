Global.GoogleBarChartBuilder = {

    aasService: 'GoogleBarChartBuilder',
    aasPublished: false,

    Build: function (controlInfo) {

        function getColumnTypeFromValue(value) {

            if (value !== null) {

                if (value.constructor === Number) return "number";
                if (value.constructor === Date) return "datetime";
                if (value.constructor === String) return "string";
                if (value.constructor === Boolean) return "boolean";
            }

            return 'string';
        }

        function drawChart(control) {

            var cp = control.aasChartProperties;

            //var chart = new google.charts.Bar(document.getElementById(control.id));
            var chart = new google.visualization.ColumnChart(document.getElementById(control.id));
            chart.draw(cp.data, cp.options);
        }

        controlInfo.CreateInstance = function (ownerWindow, id) {

            var chart = Aspectize.createElement('div', ownerWindow);

            chart.aasSubControls = {};

            return chart;
        };

        controlInfo.ChangePropertyValue = function (property, newValue) {

            //    this.PropertyBag[property] = newValue;
        };

        controlInfo.InitGrid = function (control) {

            control.style.height = '100%';
            control.style.width = '100%';
            control.style.minHeight = '100%';
            control.style.minWidth = '100%';

            control.parentNode.style.overflowX = "auto";
            control.parentNode.style.overflowY = "hidden";

            var columnInfos = controlInfo.columnInfos;

            control.aasChartProperties = {
                options: {
                    chart: {},
                    hAxis: {
                        title: 'Hello',
                        titleTextStyle: {
                            color: '#FF0000'
                        },
                        format: ''
                    },
                    bars: 'vertical',
                    series: {},
                    axes: {}
                },
                data: {}
            };

        };

        controlInfo.InitCellControl = function (control, cellControl, rowId, rowIndex, columnIndex, columnName) {

            cellControl.aasRowId = rowId;
            cellControl.aasColumnName = columnName;
            cellControl.aasColumnIndex = columnIndex;
            cellControl.aasRowIndex = rowIndex;
            cellControl.aasParentGrid = control;
        };

        controlInfo.BeforeRender = function (control, rowCount) {

            //control.aasChartProperties.MustRebuildChart = true;
            //control.aasChartProperties.Data = [];

        };

        controlInfo.RowCreated = function (control, rowId, cellControls) {

            //    var chartItem = [ rowId ];

            //    for (var n = 0; n < cellControls.length; n++) {

            //        var cellControl = cellControls[n];

            //        var axn = cellControl.aasAxisName;
            //        var v = cellControl.aasControlInfo.PropertyBag.Value;

            //        chartItem.push(v);
            //    }

            //    control.aasChartProperties.AddData(chartItem);
        };

        controlInfo.GridRendered = function (control, rowControls) {

            var data = new google.visualization.DataTable();
            var columns = {};

            for (var n = 0; n < rowControls.length; n++) {
                var tryNextRow = false;

                var rowControl = rowControls[n];

                var cellControls = rowControl.CellControls;

                for (var j = 0; j < cellControls.length; j++) {
                    var cellControl = cellControls[j];

                    var columnName = cellControl.aasColumnName;

                    if (!columns[columnName]) {
                        var rowValue = cellControl.aasControlInfo.PropertyBag.Value;

                        if (rowValue) {
                            data.addColumn(getColumnTypeFromValue(rowValue), columnName);

                            columns[columnName] = true;
                        } else {
                            tryNextRow = true;
                        }
                    }
                }

                if (!tryNextRow) break;
            }

            var rows = [];

            for (var n = 0; n < rowControls.length; n++) {

                var row = [];

                var rowControl = rowControls[n];

                var cellControls = rowControl.CellControls;

                for (var j = 0; j < cellControls.length; j++) {

                    var cellControl = cellControls[j];

                    var rowValue = cellControl.aasControlInfo.PropertyBag.Value;

                    if (cellControl.aasDataBindings.Value && cellControl.aasDataBindings.Value.Format) {
                        var rowValueWithFormat = Aspectize.formatString(rowValue, cellControl.aasDataBindings.Value.Format);
                        rowValue = { v: rowValue, f: rowValueWithFormat };
                    }

                    row.push(rowValue);
                }

                //row = ['Mike', { v: 10000, f: '$10,000' }, true];
                rows.push(row);
            }

            data.addRows(rows);

            control.aasChartProperties.data = data;

            drawChart(control);
        }
    }
};






Global.GoogleBarChartColumnBuilder = {

    aasService: 'GoogleBarChartColumnBuilder',
    aasPublished: false,

    Build: function (controlInfo) {

        controlInfo.CreateInstance = function (ownerWindow, id) {

            var control = Aspectize.createElement('div', ownerWindow);

            controlInfo.ChangePropertyValue = function (property, newValue) {

                var cp = control.aasChartProperties;

                //if (property == "Label") {
                //    cp.data.addColumn('string', 'label');
                //}

                //cp.SetAxisProperty(control.aasAxisName, property, newValue);

                this.PropertyBag[property] = newValue;
            };

            return control;
        };
    }
};