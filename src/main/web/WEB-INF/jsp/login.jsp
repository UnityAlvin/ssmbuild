<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    pageContext.setAttribute("HTTP_PATH", request.getContextPath());
%>
<html>
<head>
    <title>登录</title>
    <%@include file="common/head.jsp" %>
    <script type="text/javascript">
        if ("${msg}" != "") {
            alert("${msg}")
        }
    </script>
</head>
<body>
<div class="container">
    <div class="row">
        <div class="page-header">
            <h1>员工管理系统</h1>
        </div>
    </div>
    <div class="row">
        <form method="post" action="${HTTP_PATH}/goLogin" class="form-horizontal">
            <div class="form-group">
                <label for="exampleInputName3" class="col-sm-2 control-label">用户名</label>
                <div class="col-sm-5">
                    <input type="text" name="username" class="form-control" id="exampleInputName3" placeholder="用户名">
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword3" class="col-sm-2 control-label">密码</label>
                <div class="col-sm-5">
                    <input type="password" name="password" class="form-control" id="inputPassword3" placeholder="密码">
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                    <div class="checkbox">
                        <label>
                            <input type="checkbox"> 记住密码
                        </label>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-default">登录</button>
                </div>
            </div>
        </form>
    </div>
</div>


</body>
</html>
