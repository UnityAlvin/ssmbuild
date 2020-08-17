<%--
    web路径：
        不以/开始的相对路径，是从当前目录为基准进行查找，经常出问题
        以/开始的路径，则是从服务器的路径为基准开始查找，但是需要加上项目名
--%>
<%
    pageContext.setAttribute("HTTP_PATH", request.getContextPath());
%>

<link href="https://cdn.staticfile.org/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">


<script src="https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js"></script>


<script src="https://cdn.staticfile.org/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
