package com.indi.test;

import com.indi.dao.DepartmentMapper;
import com.indi.dao.EmployeeMapper;
import com.indi.dao.UserMapper;
import com.indi.pojo.Department;
import com.indi.pojo.Employee;
import org.apache.ibatis.session.SqlSession;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.UUID;

/**
 * 测试dao层
 * 使用Spring的单元测试，可以自动注入需要的组件
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:applicationContext.xml"})
public class MapperTest {

    @Autowired
    DepartmentMapper departmentMapper;

    @Autowired
    EmployeeMapper employeeMapper;

    @Autowired
    UserMapper userMapper;

    @Autowired
    SqlSession sqlSession;

    @Test
    /**
     * 测试DepartmentMapper
     */
    public void testDepartment() {
        //插入几个部门
        //departmentMapper.insertSelective(new Department(null,"开发部"));
        //departmentMapper.insertSelective(new Department(null,"测试部"));

        //生成员工数据
        //employeeMapper.insertSelective(new Employee(null,"Jerry","M","Jerry@qq.com",1));

        //批量插入多个员工
        EmployeeMapper mapper = sqlSession.getMapper(EmployeeMapper.class);
        for (int i = 0; i < 1000; i++) {
            String uid = UUID.randomUUID().toString().substring(0, 5) + i;
            mapper.insertSelective(new Employee(null, uid, "M", uid + "@qq.com", 1));
        }
        System.out.println("批量完成");
    }

    /**
     * 测试UserMapper
     */
    @Test
    public void testUser(){
        System.out.println(userMapper.selectByUsernameAndPassword("admin", "admin"));
    }
}
