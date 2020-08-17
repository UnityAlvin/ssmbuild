package com.indi.pojo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Pattern;

@Data
@NoArgsConstructor
public class Employee {

    private Integer empId;

    @Pattern(regexp = "^[a-zA-Z0-9_-]{6,16}|(^[\\u2E80-\\u9FFF]{2,5})$",message = "用户名必须是2-5位中文，或者6-13位英文和数字的组合")
    private String empName;

    private String gender;

    @Pattern(regexp = "^([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})$",message = "邮箱格式不正确")
    private String email;

    @JsonProperty("dId")
    private Integer dId;

    //查询员工的同时查询部门信息
    private Department department;

    public Employee(Integer empId, String empName, String gender, String email, Integer dId) {
        this.empId = empId;
        this.empName = empName;
        this.gender = gender;
        this.email = email;
        this.dId = dId;
    }
}