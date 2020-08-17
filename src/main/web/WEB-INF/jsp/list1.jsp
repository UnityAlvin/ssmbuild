<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%--
  Created by IntelliJ IDEA.
  User: New
  Date: 2020/6/1
  Time: 23:41
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>员工展示</title>
    <%@include file="common/head.jsp" %>
    <%--
        web路径：
            不以/开始的相对路径，是从当前目录为基准进行查找，经常出问题
            以/开始的路径，则是从服务器的路径为基准开始查找，但是需要加上项目名
    --%>
    <%
        pageContext.setAttribute("HTTP_PATH", request.getContextPath());
    %>

    <link href="https://cdn.staticfile.org/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">

    <script type="text/javascript">
        $(function () {
            $("a.delete").click(function () {
                return confirm("你确定要删除《" + $(this).parent().parent().find("td:eq(1)").text() + "》吗？")
            })
        })
    </script>
</head>

<body>
<div class="container">

    <%--清除浮动--%>
    <div class="row clearfix">
        <div class="col-md-12 column">
            <div class="page-header">
                <h1>员工列表</h1>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4 column">
                <form action="" method="" class="form-inline">
                    <input type="text" placeholder="请输入要查询的员工名称" class="form-control" name="empName">
                    <button class="btn btn-primary">
                        <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
                        查询
                    </button>
                </form>
            </div>


            <div class="col-md-4 column">
            </div>

            <div class="col-md-4 column" align="right">
                <button class="btn btn-primary">
                    <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                    新增
                </button>
                <button class="btn btn-danger">
                    <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                    删除
                </button>
            </div>
        </div>

    </div>

    <div class="row">
        <div class="col-md-12">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>#</th>
                    <th>员工名称</th>
                    <th>性别</th>
                    <th>邮箱</th>
                    <th>部门</th>
                    <th>操作</th>
                </tr>
                </thead>

                <tbody>
                <c:forEach items="${pageInfo.list}" var="emp">
                    <tr>
                        <td>${emp.empId}</td>
                        <td>${emp.empName}</td>
                        <td>${emp.gender=="M"?"男":"女"}</td>
                        <td>${emp.email}</td>
                        <td>${emp.department.deptName}</td>
                        <td>
                            <button class="btn btn-primary btn-sm">
                                <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                编辑
                            </button>
                            <button class="btn btn-danger btn-sm">
                                <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                                删除
                            </button>
                        </td>
                    </tr>
                </c:forEach>

                </tbody>
            </table>
        </div>
    </div>

    <%--显示分页信息--%>
    <div class="row">
        <%--显示文字信息--%>
        <div class="col-md-6">
            当前为第${pageInfo.pageNum}页，共${pageInfo.pages}页，共${pageInfo.total}条记录
        </div>

        <%--分页条信息--%>
        <div class="col-md-6">
            <nav aria-label="Page navigation">
                <ul class="pagination">
                    <%--设置首页、上一页按钮状态--%>
                    <c:if test="${pageInfo.hasPreviousPage}">
                        <li><a href="${HTTP_PATH}/emps?pn=1">首页</a></li>
                        <li>
                            <a href="${HTTP_PATH}/emps?pn=${pageInfo.pageNum-1}" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                    </c:if>
                    <c:if test="${!pageInfo.hasPreviousPage}">
                        <li class="disabled"><span>首页</span></li>
                        <li class="disabled">
                            <span aria-hidden="true">&laquo;</span>
                        </li>
                    </c:if>

                    <%--设置当前页按钮的状态--%>
                    <c:forEach items="${pageInfo.navigatepageNums}" var="page_Num">
                        <c:if test="${page_Num == pageInfo.pageNum}">
                            <li class="active"><span>${page_Num}</span></li>
                        </c:if>
                        <c:if test="${page_Num != pageInfo.pageNum}">
                            <li><a href="${HTTP_PATH}/emps?pn=${page_Num}">${page_Num}</a></li>
                        </c:if>
                    </c:forEach>

                    <%--设置末页、下一页按钮状态--%>
                    <c:if test="${pageInfo.hasNextPage}">
                        <li>
                            <a href="${HTTP_PATH}/emps?pn=${pageInfo.pageNum + 1}" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                        <li><a href="${HTTP_PATH}/emps?pn=${pageInfo.pages}">末页</a></li>
                    </c:if>
                    <c:if test="${!pageInfo.hasNextPage}">
                        <li class="disabled">
                            <span aria-hidden="true">&raquo;</span>
                        </li>
                        <li class="disabled"><span>末页</span></li>
                    </c:if>
                </ul>
            </nav>
        </div>
    </div>
</div>

</body>
</html>
