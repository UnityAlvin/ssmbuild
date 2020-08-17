package com.indi.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.indi.pojo.Employee;
import com.indi.pojo.Msg;
import com.indi.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 处理员工CRUD请求
 */
@Controller
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    EmployeeService employeeService;


//    /**
//     * 查询员工数据（分页查询）测试用
//     *
//     * @param pn    页数
//     * @param model 分页信息以及数据
//     * @return
//     */
//    @RequestMapping("/emps")
//    public String getEmps(@RequestParam(value = "pn", defaultValue = "1") Integer pn, Model model) {
//        //调用分页插件的分页方法，传入页码，以及每页显示的条数
//        PageHelper.startPage(pn, 5);
//
//        List<Employee> emps = employeeService.getAll();
//
//        //使用PageInfo包装查询后的结果，包括了详细的分页信息以及查询出来的数据，
//        //只需要将pageInfo交给前端就行了,5表示连续显示5页
//        PageInfo page = new PageInfo(emps, 5);
//        model.addAttribute("pageInfo", page);
//        return "list";
//    }

    /**
     * 使用ResponseBody自动将对象转为JSON字符串，以实现多种客户端的通用
     *
     * @param pn
     * @return
     */
    @RequestMapping("/emps")
    @ResponseBody
    public Msg getEmpsWithJson(@RequestParam(value = "pn", defaultValue = "1") Integer pn) {
        //调用分页插件的分页方法，传入页码，以及每页显示的条数
        PageHelper.startPage(pn, 5);

        List<Employee> emps = employeeService.getAll();

        //使用PageInfo包装查询后的结果，包括了详细的分页信息以及查询出来的数据，
        //只需要将pageInfo交个前端就行了,5表示连续显示5页
        PageInfo page = new PageInfo(emps, 5);
        return Msg.success().add("pageInfo", page);
    }

    /**
     *  新增员工
     *
     * @return
     */
    @RequestMapping(value = "/emp", method = RequestMethod.POST)
    @ResponseBody
    public Msg saveEmp(@Valid Employee employee, BindingResult result) {
        Map<String, Object> errorMap = new HashMap<>();

        //校验数据格式是否正确
        if (result.hasErrors()) {
            //校验失败，应该返回失败，在模态框中显示校验失败的错误信息
            List<FieldError> errors = result.getFieldErrors();
            for (FieldError error : errors) {
                System.out.println("错误的字段名：" + error.getField());
                System.out.println("错误信息：" + error.getDefaultMessage());
                errorMap.put(error.getField(), error.getDefaultMessage());
            }
            //如果错误集合中不包含邮箱，则证明邮箱格式没问题，此时需要检查邮箱是否重复,
            //否则会与数据格式都正确的提示发生冲突，导致显示异常
            if (!errors.contains("email")) {
                //检查邮箱是否重复
                boolean res = employeeService.checkEmail(employee.getEmail());
                if (!res) {
                    errorMap.put("email", "该邮箱已使用");
                }
            }
            return Msg.fail().add("errorMap", errorMap);
        } else {
            //如果数据格式都正确，则需要检查邮箱是否重复
            boolean res = employeeService.checkEmail(employee.getEmail());
            if (res) {
                employeeService.saveEmp(employee);
                return Msg.success();
            } else {
                errorMap.put("email", "该邮箱已使用");
                return Msg.fail().add("errorMap", errorMap);
            }
        }

    }

    /**
     * 检查邮箱是否可用
     *
     * @param email
     * @return
     */
    @RequestMapping("/checkEmail")
    @ResponseBody
    public Msg checkEmail(@RequestParam("email") String email) {
        //先判断邮箱是否合法
        String regx = "^([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})$";
        if (!email.matches(regx)) {
            return Msg.fail().add("va_msg", "邮箱格式不正确");
        }

        //数据库邮箱重复校验
        boolean res = employeeService.checkEmail(email);
        if (res) {
            return Msg.success();
        } else {
            return Msg.fail().add("va_msg", "该邮箱已使用");
        }
    }

    /**
     * 根据id查询员工
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/emp/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Msg getEmp(@PathVariable("id") Integer id) {
        Employee emp = employeeService.getEmp(id);
        return Msg.success().add("emp", emp);
    }

    /**
     * 更新员工
     *
     * @param employee
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/updateEmp/{empId}", method = RequestMethod.PUT)
    public Msg updateEmp(Employee employee) {
        String regx = "^[a-zA-Z0-9_-]{6,16}|(^[\\u2E80-\\u9FFF]{2,5})$";
        if (!employee.getEmpName().matches(regx)) {
            return Msg.fail().add("va_msg", "用户名必须是2-5位中文，或者6-13位英文和数字的组合");
        } else {
            employeeService.updateEmp(employee);
            return Msg.success();
        }
    }

//    @ResponseBody
//    @RequestMapping(value = "/deleteEmp/{id}", method = RequestMethod.DELETE)
//    public Msg deleteEmpById(@PathVariable("id")Integer id) {
//        employeeService.deleteEmp(id);
//        return Msg.success();
//    }

    /**
     * 单个批量二合一
     * @param ids 单个删除没有“-”/批量删除用“-”分割
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/deleteEmp/{ids}", method = RequestMethod.DELETE)
    public Msg deleteEmp(@PathVariable("ids")String ids) {
        if (ids.contains("-")) {
            List<Integer> delIds = new ArrayList<>();
            String[] strIds = ids.split("-");
            for (String strId : strIds) {
                delIds.add(Integer.parseInt(strId));
            }
            employeeService.deleteBatch(delIds);
        }else{
            Integer id = Integer.parseInt(ids);
            employeeService.deleteEmp(id);
        }
        return Msg.success();
    }

    @ResponseBody
    @RequestMapping(value = "/getEmpsByEmpName",method = RequestMethod.GET)
    public Msg getEmpsByEmpName(@RequestParam(value = "pn", defaultValue = "1") Integer pn,@RequestParam("empName") String empName){
        System.out.println("用户名"+empName);
        PageHelper.startPage(pn, 5);
        List<Employee> emps = employeeService.getEmpsByEmpName(empName);
        PageInfo page = new PageInfo(emps, 5);
        return Msg.success().add("pageInfo", page);
    }
}
