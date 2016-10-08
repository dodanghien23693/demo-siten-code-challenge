/*
 *  Document   : base_tables_datatables.js
 *  Author     : pixelcave
 *  Description: Custom JS code used in Tables Datatables Page
 */





var BaseTableDatatables = function (config) {
    // Init full DataTable, for more examples you can check out https://www.datatables.net/
    var table;
    var editor;
    
    var initProductList = function (tableSelector) {
        editor = new $.fn.dataTable.Editor({  
            ajax: "/jsons/sample-product-list.json",
            table: tableSelector,
            idSrc: 'maSp',
            fields: [
                {
                    label: "Mã sản phẩm",
                    name: "maSp"
                }, {
                    label: "Tên sản phẩm",
                    name: "tenSanPham"
                }, {
                    label: "Danh mục",
                    name: "danhMuc",
                    type: "select",
                    options: (function () {
                        return ["TP tươi sống", "Gia vị", "TP chế biến", "Đồ uống", "Đồ ăn vặt", "Dụng cụ nhà bếp"];
                    })()
                }, {
                    label: "Hiển thị",
                    name: "hienThi",
                    type: "select",
                    options: ["Hiển thị","Ẩn"]
                }, {
                    label: "Trạng thái",
                    name: "trangThai",
                    type: "select",
                    options:["Còn hàng","Hết hàng"]
                }, {
                    label: "Số lượng",
                    name: "soLuong"
                }, {
                    label: "Đơn vị",
                    name: "donVi"
                },
                {
                    label: "Giá bán",
                    name: "giaBan"
                }
            ]
        });

        // Activate an inline edit on click of a table cell
        //$('.js-dataTable-danh-sach-sp').on('click', 'tbody td:not(:first-child)', function (e) {
        //    editor.inline(this);
        //});

        table = $(tableSelector).DataTable({
            dom: "frtlip",
            serverSide: true,
            processing: true,
            ajax:function(data,callback,settings){


                var filter = {};
                $(config.tableContainer).find(".filter-region").find("select,input").each(function (index, item) {
                    filter[$(item).attr('name')] = $(item).val();
                });

                var query = {
                    start : settings._iDisplayStart,
                    pageSize: settings._iDisplayLength,
                    draw: settings.iDraw,
                    filter: JSON.stringify(filter)
                };
               
                var sort = settings.aaSorting[0];
                var column = settings.aoColumns[sort[0]];
                if (column.data != null) {
                    query.sortBy = column.data;
                    query.order = sort[1];
                }

                $.ajax({
                    type: "GET",
                    dataType: 'json',
                    data:query,
                    url: "http://mamifood.dev/api/products",
                    crossDomain: true
                })
                .done(function (data) {

                    callback(data);
                }.bind(this))
                .fail(function (xhr, textStatus, errorThrown) {
                    alert(xhr.responseText);
                    alert(textStatus);
                });

            },
          
            columns: [
                {
                    data: null,
                    defaultContent: '',
                    render: function (data, type, full, meta) {
                        return '<label class="css-input css-checkbox css-checkbox-primary"><input type="checkbox" id="' + meta.row + '" class="row-checkbox"><span></span></label>';
                    },
                    orderable: false,
                    //className: 'select-checkbox',
                    width: "10px"
                },
                { data: "maSp" },
                { data: "tenSanPham" },
                { data: "danhMuc" },
                {
                    data: "hienThi",
                    render: function (data, type, full, meta) {
                        
                        return '<input disabled type="checkbox"' + ((data) ? 'checked' : '') + '>';
                    }
                },
                { data: "trangThai" },
                { data: "soLuong" },
                { data: "donVi" },
                { data: "giaBan" },
                {
                    data: null, defaultContent: 'chi tiết'
                    //    render: function (data, type, full, meta) {

                    //        return getDetailTable();
                    //        //return '<div class="btn "><span class="si si-plus"></span></div>';
                    //    }
                }
            ]
            ,
            select: {
                style: 'multi',
                selector: 'td:first-child'
            }
        });

        $("table").delegate(".detail-table-container .detail-button", 'click', function () {
           
            var e = $(this).parent();
            var detailTable = $(e).find("table").first();
            //
            var cell = $(e).closest("td");
            var rowData = table.cell(cell).data();
            var data = [];
            if (rowData.details != undefined) data = rowData.details;
            $(detailTable).DataTable({
                dom: "rt",
                data: data,
                "language": {
                    "url": "/assets/js/plugins/datatables/Languages/vietnamese.json"
                },
                columns: [
                    {
                        data: null,
                        defaultContent: '',
                        className: 'select-checkbox',
                        orderable: true
                    },
                    { data: "STT",defaultContent:"" },
                    { data: "soLuong" },
                    { data: "klTt" },
                    { data: "hsd" }
                ],
                select: {
                    style: 'multi',
                    selector: 'td:first-child'
                }
            });

            $(detailTable).toggleClass("hidden", 500);
        });

        //$('.js-dataTable-danh-sach-sp tbody').on('click', 'td', function () {
        //    try{
        //        table.cells(this).edit({
        //            blur: 'submit'
        //        });
        //    }
        //    catch(e){
        //    }           
        //});
        //$(".js-dataTable-danh-sach-sp input").keyup(function (e) {
        //    e.preventDefault();
        //    if (e.keyCode == 13) {
        //        table.fnFilter(this.value);
        //    }
        //});


        //$('.js-dataTable-danh-sach-sp').on('click', 'tbody tr', function () {
        //    table.row(this).edit({title:"Cập nhật thông tin sản phẩm"});
        //});

        $(".js-select2").select2({
            minimumResultsForSearch: Infinity
        });
        
        //window.table = table;

        return table;
    };
    
    function getDetailTable() {
        var html = '<div class="detail-table-container"> <div class="btn detail-button"><span class="si si-plus"></span></div>';

        html += '<table class="table table-bordered hidden">'
            + '<thead>'
             + '<tr>'
              + '<th></th>'
               + '<th>STT</th>'
                + '<th>SL</th>'
                 + '<th>KL/TT</th>'
                  + '<th>HSD</th>'
                + '</tr>'
            + '</thead>'
        + '</table>'
        + '</div>';
        return html;
    }


    function editItem(table, editor, action) {
        action.method(table);
        
    }

    function removeItems(table,action) {

        if (table.row({ selected: true }).count() == 0) {
            swal({
                title: "Chưa có sản phẩm nào được chọn!",
                type: 'warning',
                showCloseButton: true,
            });
        }
        else {
            swal({
                title: action.confirmText,
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
            function () {
                
                
             
                action.method(table);
              
                //$.ajax({
                //    url: "http://mamifood.dev/products/delete",
                //    type: "GET",
                //    dataType: 'json',
                //    data: { ids: ids.join(',') },
                //    crossDomain: true,
                //    success: function (resp) {                        
                //        swal("Đã xóa!", "Sản phẩm đã xóa thành công", "success");
                //        table.rows(table.rows({ selected: true }).nodes()).remove().draw();
                //    }.bind(this),
                //    error:function(resp){
                //        swal("Lỗi!", "Có lỗi xảy ra", "error");
                //    }
                //});
                
            });
        }
        
    }

    function createItem(table, action) {
        action.method(table);
        
    }

    // DataTables Bootstrap integration
    var bsDataTables = function() {
        var $DataTable = jQuery.fn.dataTable;

        // Set the defaults for DataTables init
        jQuery.extend( true, $DataTable.defaults, {
            dom:
                "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-6'i><'col-sm-6'p>>",
            renderer: 'bootstrap',
            oLanguage: {
                sLengthMenu: "_MENU_",
                sInfo: "Showing <strong>_START_</strong>-<strong>_END_</strong> of <strong>_TOTAL_</strong>",
                oPaginate: {
                    sPrevious: '<i class="fa fa-angle-left"></i>',
                    sNext: '<i class="fa fa-angle-right"></i>'
                }
            }
        });

        // Default class modification
        jQuery.extend($DataTable.ext.classes, {
            sWrapper: "dataTables_wrapper form-inline dt-bootstrap",
            sFilterInput: "form-control",
            sLengthSelect: "form-control"
        });

        // Bootstrap paging button renderer
        $DataTable.ext.renderer.pageButton.bootstrap = function (settings, host, idx, buttons, page, pages) {
            var api     = new $DataTable.Api(settings);
            var classes = settings.oClasses;
            var lang    = settings.oLanguage.oPaginate;
            var btnDisplay, btnClass;

            var attach = function (container, buttons) {
                var i, ien, node, button;
                var clickHandler = function (e) {
                    e.preventDefault();
                    if (!jQuery(e.currentTarget).hasClass('disabled')) {
                        api.page(e.data.action).draw(false);
                    }
                };

                for (i = 0, ien = buttons.length; i < ien; i++) {
                    button = buttons[i];

                    if (jQuery.isArray(button)) {
                        attach(container, button);
                    }
                    else {
                        btnDisplay = '';
                        btnClass = '';

                        switch (button) {
                            case 'ellipsis':
                                btnDisplay = '&hellip;';
                                btnClass = 'disabled';
                                break;

                            case 'first':
                                btnDisplay = lang.sFirst;
                                btnClass = button + (page > 0 ? '' : ' disabled');
                                break;

                            case 'previous':
                                btnDisplay = lang.sPrevious;
                                btnClass = button + (page > 0 ? '' : ' disabled');
                                break;

                            case 'next':
                                btnDisplay = lang.sNext;
                                btnClass = button + (page < pages - 1 ? '' : ' disabled');
                                break;

                            case 'last':
                                btnDisplay = lang.sLast;
                                btnClass = button + (page < pages - 1 ? '' : ' disabled');
                                break;

                            default:
                                btnDisplay = button + 1;
                                btnClass = page === button ?
                                        'active' : '';
                                break;
                        }

                        if (btnDisplay) {
                            node = jQuery('<li>', {
                                'class': classes.sPageButton + ' ' + btnClass,
                                'aria-controls': settings.sTableId,
                                'tabindex': settings.iTabIndex,
                                'id': idx === 0 && typeof button === 'string' ?
                                        settings.sTableId + '_' + button :
                                        null
                            })
                            .append(jQuery('<a>', {
                                    'href': '#'
                                })
                                .html(btnDisplay)
                            )
                            .appendTo(container);

                            settings.oApi._fnBindAction(
                                node, {action: button}, clickHandler
                            );
                        }
                    }
                }
            };

            attach(
                jQuery(host).empty().html('<ul class="pagination"/>').children('ul'),
                buttons
            );
        };

        // TableTools Bootstrap compatibility - Required TableTools 2.1+
        if ($DataTable.TableTools) {
            // Set the classes that TableTools uses to something suitable for Bootstrap
            jQuery.extend(true, $DataTable.TableTools.classes, {
                "container": "DTTT btn-group",
                "buttons": {
                    "normal": "btn btn-default",
                    "disabled": "disabled"
                },
                "collection": {
                    "container": "DTTT_dropdown dropdown-menu",
                    "buttons": {
                        "normal": "",
                        "disabled": "disabled"
                    }
                },
                "print": {
                    "info": "DTTT_print_info"
                },
                "select": {
                    "row": "active"
                }
            });

            // Have the collection use a bootstrap compatible drop down
            jQuery.extend(true, $DataTable.TableTools.DEFAULTS.oTags, {
                "collection": {
                    "container": "ul",
                    "button": "li",
                    "liner": "a"
                }
            });
        }
    };

    function initActions(table, editor,config) {

        table.on('user-select', function (e, dt, type, cell, originalEvent) {
           
            if (getCurrentActionCode() == "1") {
                if (table.rows({ "selected": true }).count() > 1) {
                }
            }
            if (originalEvent.target.nodeName.toLowerCase() === 'img') {
                e.preventDefault();
            }
        });

        $(config.tableContainer+" .action-list").change(function () {
            var actionCode = getCurrentActionCode();
            if (actionCode == "1") {
                table.settings()[0]._select.style = "single";
                //table.draw();
            }
            else {
                table.settings()[0]._select.style = "multi";
                //table.draw();
            }
        });


        $(config.tableContainer+" .do-action").click(function () {
            var actionCode = $(config.tableContainer+" .action-region .action-list").val();
            switch (actionCode) {
                case "1":
                    editItem(table, editor,config.actions.edit);

                    break;
                case "2":
                    removeItems(table,config.actions.remove);
                    break;
                case "0":
                    taoHoaDown(table,config.actions.create);
            }
        });  
        
        $(config.tableContainer+" .add-new").click(function () {
            createItem(table,config.actions.create);
        });
    }

    var getCurrentActionCode = function(){
        var actionCode = $(config.tableContainer+" .action-region .action-list").val();
        return actionCode;
    }

    function initFilters(config,table) {
        $(config.tableContainer).find(".filter-region").find("select").change(function () {
            table.draw();
        });
    }

    return {
        //tableContainer: tableContainer,
        init: function () {
            //bsDataTables();
            var table = initProductList(config.tableContainer + " table");
            
            //'.js-dataTable-danh-sach-sp');

            initActions(table, editor,config);
            initFilters(config, table);
        },
        
            
    };
};

// Initialize when page loads
//jQuery(function () {
//    var table  = BaseTableDatatables("#danh-sach-sp");

//    table.init();
//});