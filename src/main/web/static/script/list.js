var totalRecord;
var httpPath;
var pageNum;
var deptHttpPath;
$(function () {
    //页面加载完成之后，直接发送ajax请求，要到分页数据
    httpPath = $("contextPathData").attr("contextPathValue")+"/employee";
    deptHttpPath = $("contextPathData").attr("contextPathValue")+"/department";
    to_page(1);


    //新增
    $("#emp_add_modal_btn").click(function () {
        getDepts("#empAddModal select");

        reset_form("#empAddModal form");

        //显示模态框
        $("#empAddModal").modal({
            backdrop: "static"
        });
    })

    //新增模态框的用户名校验
    $("#empName_add_input").blur(function () {
        setTimeout(function () {
            var empName = $("#empName_add_input");
            var regName = /^[a-zA-Z0-9_-]{6,16}|(^[\u2E80-\u9FFF]{2,5})$/
            if (!regName.test(empName.val())) {
                show_validata_msg(empName, "error", "用户名必须是2-5位中文，或者6-13位英文和数字的组合");
            } else {
                show_validata_msg(empName, "success", "用户名可用");
            }
        }, 300);
    })

    //邮箱校验
    $("#email_add_input").blur(function () {
        setTimeout(function () {
            var email = $("#email_add_input");

            var regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
            if (!regEmail.test(email.val())) {
                //alert("邮箱格式不正确")
                show_validata_msg(email, "error", "邮箱格式不正确");
            } else {
                $.ajax({
                    url: httpPath + "/checkEmail",
                    data: "email=" + email.val(),
                    type: "POST",
                    success: function (result) {
                        if (result.code == 100) {
                            show_validata_msg(email, "success", "邮箱可用");
                        } else {
                            show_validata_msg(email, "error", result.ext.va_msg);
                        }
                    }
                })
            }
        }, 300)

    })

    //模态框保存按钮
    $("#emp_save_btn").click(function () {
        //1、校验用户名
        var empName = $("#empName_add_input");
        var regName = /^[a-zA-Z0-9_-]{6,16}|(^[\u2E80-\u9FFF]{2,5})$/;

        if (!regName.test(empName.val())) {
            //alert("用户名可以是2-5位中文，或者6-13位英文和数字的组合");
            show_validata_msg(empName, "error", "用户名必须是2-5位中文，或者6-13位英文和数字的组合");
            return false;
        } else {
            show_validata_msg(empName, "success", "用户名可用");
        }

        //2、校验邮箱
        var email = $("#email_add_input");

        var regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;

        if (!regEmail.test(email.val())) {
            show_validata_msg(email, "error", "邮箱格式不正确");
            return false;
        } else {
            //3、请求保存数据
            $.ajax({
                url: httpPath + "/emp",
                type: "POST",
                data: $("#empAddModal form").serialize(),
                success: function (result) {
                    //alert(result.msg);
                    if (result.code == 100) {
                        //成功
                        //1、关闭模态框
                        $("#empAddModal").modal('hide');
                        //2、发送ajax请求，来到最后一页，显示刚才保存的数据
                        to_page(totalRecord + 1);
                    } else {
                        // console.log(result);
                        if (undefined != result.ext.errorMap.email) {
                            show_validata_msg(email, "error", result.ext.errorMap.email);
                        } else {
                            show_validata_msg(email, "success", "邮箱可用");
                        }

                        if (undefined != result.ext.errorMap.empName) {
                            show_validata_msg(empName, "error", result.ext.errorMap.empName);
                        } else {
                            show_validata_msg(empName, "success", "用户名可用");
                        }
                    }

                }
            })
        }
    })


    //更新模态框的用户名校验
    $("#empName_update_input").blur(function () {
        //设置延时解决click与blur冲突的问题
        setTimeout(function () {
            var empName = $("#empName_update_input");
            var regName = /^[a-zA-Z0-9_-]{6,16}|(^[\u2E80-\u9FFF]{2,5})$/
            if (!regName.test(empName.val())) {
                show_validata_msg(empName, "error", "用户名必须是2-5位中文，或者6-13位英文和数字的组合");
            } else {
                show_validata_msg(empName, "success", "用户名可用");
            }
        }, 300)

    })

    //更新按钮的点击事件
    $("#emp_update_btn").click(function () {
        //1、校验用户名
        var empName = $("#empName_update_input");
        var regName = /^[a-zA-Z0-9_-]{6,16}|(^[\u2E80-\u9FFF]{2,5})$/;

        if (!regName.test(empName.val())) {
            //alert("用户名可以是2-5位中文，或者6-13位英文和数字的组合");
            show_validata_msg(empName, "error", "用户名必须是2-5位中文，或者6-13位英文和数字的组合");
            return false;
        } else {
            show_validata_msg(empName, "success", "用户名可用");
            $.ajax({
                url: httpPath + "/updateEmp/" + $(this).attr("edit-id"),
                type: "PUT",
                data: $("#empUpdateModal form").serialize(),
                success: function (result) {
                    // console.log(result);
                    if (result.code == 100) {
                        //成功
                        //1、关闭模态框
                        show_validata_msg(empName, "success", "用户名可用");
                        $("#empUpdateModal").modal('hide');
                        to_page(pageNum);
                    } else {
                        show_validata_msg(empName, "error", result.ext.va_msg);
                        return false;
                    }
                }
            })
        }
    })

    //点击右上角删除，会删除选中的列表项
    $("#emp_delete_all_btn").click(function () {
        var checked = false;

        var empNames = "";
        var delIdStr = "";
        $.each($(".check_item:checked"), function () {
            checked = true;
            empNames += $(this).parents("tr").find("td:eq(2)").text() + "，";
            delIdStr += $(this).parents("tr").find("td:eq(1)").text() + "-";
        });

        if (checked == false) {
            alert("至少选中一项！")
            return false;
        }

        //去除多余符号
        empNames = empNames.substring(0, empNames.length - 1);
        delIdStr = delIdStr.substring(0, empNames.length - 1);

        if (confirm("确认删除【" + empNames + "】吗？")) {
            //发送ajax请求删除
            $.ajax({
                url: httpPath + "/deleteEmp/" + delIdStr,
                type: "DELETE",
                success: function (result) {
                    to_page(pageNum);
                }
            })
        }
    })

    //完成全选/全不选功能
    $("#check_all").click(function () {
        $(".check_item").prop("checked", $(this).prop("checked"));
    })

    //为列表项中的修改添加点击事件
    $(document).on("click", ".edit_btn", function () {
        reset_form("#empUpdateModal form");
        // alert("edit");
        //1、查出部门信息，显示部门列表
        getDepts("#empUpdateModal select");

        //2、查出员工信息，显示员工信息
        getEmp($(this).attr("edit-id"));

        //3、把员工id传给模态框的更新按钮
        $("#emp_update_btn").attr("edit-id", $(this).attr("edit-id"));

        $("#empUpdateModal").modal({
            backdrop: "static"
        });
    })

    //为列表项中的删除添加点击事件
    $(document).on("click", ".delete_btn", function () {
        //1、弹出是否确认删除对话框
        var empName = $(this).parents("tr").find("td:eq(2)").text();
        var empId = $(this).attr("delete-id");
        if (confirm("确认删除【" + empName + "】吗？")) {
            //确认
            $.ajax({
                url: httpPath + "/deleteEmp/" + empId,
                type: "DELETE",
                success: function (result) {
                    //alert(result.msg)
                    to_page(pageNum);
                }
            })
        }
    })

    //为列表项中的单选框添加点击事件
    $(document).on("click", ".check_item", function () {
        //判断当前选中的元素是否是5个
        var flag = $(".check_item:checked").length === $(".check_item").length;
        $("#check_all").prop("checked", flag)
    })

    //查询按钮的点击事件
    $("#emp_select_btn").click(function () {
        to_page_by_name(1)
    })
});

//跳转页面
function to_page_by_name(pn) {
    var empName_example = $("#empName_example");

    if (empName_example.val().trim() == '' || empName_example.val().trim() == undefined || empName_example.val().trim() == null) {
        to_page(1);
        return false;
    }
    $.ajax({
        url: httpPath + "/getEmpsByEmpName",
        data: "pn=" + pn + "&empName=" + empName_example.val().trim(),
        type: "GET",
        success: function (result) {
            build_emps_table(result);
            build_page_info(result);
            build_page_nav_by_name(result);
            $("#check_all").prop("checked", false)
            $(".check_item").prop("checked", false);
        }
    })
}


//跳转页面
function to_page(pn) {
    $.ajax({
        url: httpPath + "/emps",
        data: "pn=" + pn,
        type: "GET",
        success: function (result) {
            //console.log(result)
            build_emps_table(result);
            build_page_info(result);
            build_page_nav(result);
            $("#check_all").prop("checked", false)
            $(".check_item").prop("checked", false);
        }
    });
}

/**
 * 解析并显示员工数据
 * @param result
 */
function build_emps_table(result) {
    //清空table
    $("#emps_table tbody").empty();

    var emps = result.ext.pageInfo.list;
    $.each(emps, function (index, item) {
        var checkBoxTd = $("<td><input type='checkbox' class='check_item'/></td>");
        var empIdTd = $("<td></td>").append(item.empId);
        var empNameTd = $("<td></td>").append(item.empName);
        var genderTd = $("<td></td>").append(item.gender == "M" ? "男" : "女");
        var emailTd = $("<td></td>").append(item.email);
        var deptNameTd = $("<td></td>").append(item.department.deptName);

        var editBtn = $("<button></button>").addClass("btn btn-primary btn-sm edit_btn")
            .append($("<span></span>").addClass("glyphicon glyphicon-pencil").attr("aria-hidden", true))
            .append("&nbsp;编辑");

        //为编辑按钮添加一个自定义属性，表示当前的员工id
        editBtn.attr("edit-id", item.empId);


        var deleteBtn = $("<button></button>").addClass("btn btn-danger btn-sm delete_btn")
            .append($("<span></span>").addClass("glyphicon glyphicon-trash").attr("aria-hidden", true))
            .append("&nbsp;删除");

        //为删除按钮添加一个自定义属性，表示当前的员工id
        deleteBtn.attr("delete-id", item.empId);

        var btnTd = $("<td></td>").append(editBtn).append("&nbsp;").append(deleteBtn);
        //append方法执行完成以后还是返回原来的元素
        $("<tr></tr>").append(checkBoxTd).append(empIdTd).append(empNameTd).append(genderTd)
            .append(emailTd).append(deptNameTd).append(btnTd).appendTo("#emps_table tbody");
    })
}

/**
 * 解析并显示分页信息
 * @param result
 */
function build_page_info(result) {
    $("#page_info_area").empty();
    $("#page_info_area").append(" 当前为第" + result.ext.pageInfo.pageNum + "页，" +
        "共" + result.ext.pageInfo.pages + "页，共" + result.ext.pageInfo.total + "条记录")
    totalRecord = result.ext.pageInfo.total;
    pageNum = result.ext.pageInfo.pageNum;
}

/**
 * 解析并显示分页条
 * @param result
 */
function build_page_nav(result) {
    $("#page_nav_area").empty();

    var ul = $("<ul></ul>").addClass("pagination");

    //如果有前一页
    if (result.ext.pageInfo.hasPreviousPage) {
        //添加首页和前一页的提示
        var firstPageLi = $("<li></li>").append($("<a></a>").append("首页").attr("href", "#"));
        var prePageLi = $("<li></li>").append($("<a></a>").append("&laquo;").attr("href", "#"));
        ul.append(firstPageLi).append(prePageLi);

        firstPageLi.click(function () {
            to_page(1);
        })
        prePageLi.click(function () {
            to_page(result.ext.pageInfo.pageNum - 1);
        })
    }

    //如果有下一页
    if (result.ext.pageInfo.hasNextPage) {
        var nextPageLi = $("<li></li>").append($("<a></a>").append("&raquo;").attr("href", "#"));
        var lastPageLi = $("<li></li>").append($("<a></a>").append("末页").attr("href", "#"));
        //添加首页和前一页的提示
        ul.append(nextPageLi).append(lastPageLi);

        nextPageLi.click(function () {
            to_page(result.ext.pageInfo.pageNum + 1);
        })

        lastPageLi.click(function () {
            to_page(result.ext.pageInfo.pages);
        })
    }

    //遍历添加页码
    $.each(result.ext.pageInfo.navigatepageNums, function (index, item) {
        var numLi = $("<li></li>").append($("<a></a>").append(item).attr("href", "#"));
        //设置当前页码的选中状态
        if (result.ext.pageInfo.pageNum == item) {
            numLi.addClass("active");
        } else {
            numLi.click(function () {
                to_page(item);
            })
        }
        ul.append(numLi);
    })

    ul.append(nextPageLi).append(lastPageLi);

    var navEle = $("<nav></nav>").append(ul);
    navEle.appendTo("#page_nav_area")
}

/**
 * 查询并解析显示分页条
 * @param result
 */
function build_page_nav_by_name(result) {
    $("#page_nav_area").empty();

    var ul = $("<ul></ul>").addClass("pagination");

    //如果有前一页
    if (result.ext.pageInfo.hasPreviousPage) {
        //添加首页和前一页的提示
        var firstPageLi = $("<li></li>").append($("<a></a>").append("首页").attr("href", "#"));
        var prePageLi = $("<li></li>").append($("<a></a>").append("&laquo;").attr("href", "#"));
        ul.append(firstPageLi).append(prePageLi);

        firstPageLi.click(function () {
            to_page_by_name(1);
        })
        prePageLi.click(function () {
            to_page_by_name(result.ext.pageInfo.pageNum - 1);
        })
    }

    //如果有下一页
    if (result.ext.pageInfo.hasNextPage) {
        var nextPageLi = $("<li></li>").append($("<a></a>").append("&raquo;").attr("href", "#"));
        var lastPageLi = $("<li></li>").append($("<a></a>").append("末页").attr("href", "#"));
        //添加首页和前一页的提示
        ul.append(nextPageLi).append(lastPageLi);

        nextPageLi.click(function () {
            to_page_by_name(result.ext.pageInfo.pageNum + 1);
        })

        lastPageLi.click(function () {
            to_page_by_name(result.ext.pageInfo.pages);
        })
    }

    //遍历添加页码
    $.each(result.ext.pageInfo.navigatepageNums, function (index, item) {
        var numLi = $("<li></li>").append($("<a></a>").append(item).attr("href", "#"));
        //设置当前页码的选中状态
        if (result.ext.pageInfo.pageNum == item) {
            numLi.addClass("active");
        } else {
            numLi.click(function () {
                to_page_by_name(item);
            })
        }
        ul.append(numLi);
    })

    ul.append(nextPageLi).append(lastPageLi);

    var navEle = $("<nav></nav>").append(ul);
    navEle.appendTo("#page_nav_area")
}


/**
 * 查出所有部门信息系并显示在下拉列表中
 */
function getDepts(ele) {
    $(ele).empty();
    $.ajax({
        url: deptHttpPath + "/depts",
        type: "GET",
        success: function (result) {
            // console.log(result);
            $.each(result.ext.depts, function () {
                var optionEle = $("<option></option>").append(this.deptName).attr("value", this.deptId);
                optionEle.appendTo(ele);
            })
        }
    })
}

/**
 * 点击模态框保存按钮时的数据校验
 * @returns {boolean}
 */
function validata_add_form() {
    //1、拿到要校验的数据
    var empName = $("#empName_add_input");
    var regName = /^[a-zA-Z0-9_-]{6,16}|(^[\u2E80-\u9FFF]{2,5})$/;

    if (!regName.test(empName.val())) {
        //alert("用户名可以是2-5位中文，或者6-13位英文和数字的组合");
        show_validata_msg(empName, "error", "用户名必须是2-5位中文，或者6-13位英文和数字的组合");
        alert(1);
        return false;
    } else {
        show_validata_msg(empName, "success", "用户名可用");
    }

    var email = $("#email_add_input");

    var regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;

    if (!regEmail.test(email.val())) {
        show_validata_msg(email, "error", "邮箱格式不正确");
        return false;
    } else {
        $.ajax({
            url: httpPath + "/checkEmail",
            data: "email=" + email.val(),
            type: "POST",
            success: function (result) {
                if (result.code == 100) {
                    show_validata_msg(email, "success", "邮箱可用");
                } else {
                    show_validata_msg(email, "error", result.ext.va_msg);
                }
            }
        })
    }
    return true;
}

//设置输入框的校验提示
function show_validata_msg(ele, status, msg) {
    ele.parent().removeClass("has-success has-error");
    ele.next("span").text("");
    if ("success" == status) {
        ele.parent().addClass("has-success");
        ele.next("span").text(msg);
    } else if ("error" == status) {
        ele.parent().addClass("has-error");
        ele.next("span").text(msg);
    }
}

/**
 * 清除模态框样式及内容
 * @param ele
 */
function reset_form(ele) {
    $(ele)[0].reset();
    $(ele).find("*").removeClass("has-error has-success");
    $(ele).find(".help-block").text("");
}

/**
 * 根据id查询出用户信息并赋值
 * @param id
 */
function getEmp(id) {
    $.ajax({
        url: httpPath + "/emp/" + id,
        type: "GET",
        success: function (result) {
            //console.log(result);
            var empData = result.ext.emp;
            $("#empName_update_input").val(empData.empName);
            $("#email_update_static").text(empData.email);
            $("#empUpdateModal input[name=gender]").val([empData.gender]);
            $("#empUpdateModal select").val([empData.dId]);
        }
    })
}