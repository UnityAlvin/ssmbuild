package com.indi.controller;

import com.indi.pojo.User;
import com.indi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;

@Controller
public class UserController {

    @Autowired
    UserService userService;

    @RequestMapping("/login")
    public String login() {
        return "login";
    }

    @RequestMapping("/goLogin")
    public String goLogin(HttpSession session, String username, String password, Model model) {
        User user = userService.getUserByUsernameAndPassword(username, password);
        if (user == null) {
            model.addAttribute("msg","用户名或密码错误");
            return "login";
        } else {
            session.setAttribute("user", user);
            return "list";
        }
    }
}
