# jquery-validation
表单验证插件

#### 基于策略的表单验证，方便扩展。



使用
-----

只需在jquery后引入jquery.validation文件

``` html
<script src='jquery.js'></script>
<script src='jquery.validation.js'></script>
```

初始化
---------------
使用自定义属性data-validate进行初始化
``` html
  <input type="text" name="username" data-validate="chinese;minLength:2;maxLength:10" />
```

使用编程方式初始化

``` javascript
//选择元素调用validation方法传入验证策略
$('input').validation('chinese;minLength:2;maxLength:10');

```

方法
-----------
* 调用方式

``` javascript
//选择元素调用validation方法传入验证策略
//eg : 调用add方法并传入title验证策略
$('input').validation('add','title');

```
* 可调用方法

**add**  添加策略  
``` javascript
$('input').validation('add','title');
```  
**validate** 根据已有策略执行验证
``` javascript
$('input').validation('validate');
```  

事件
---
**before.validation** 在验证之前触发
``` javascript
  $('input').on('before.validation',function(){
    //dosomething 如清除之前的错误提示等等
  })
```  

**failed.validation** 当表单值未通过验证时触发
``` javascript
  $('input').on('failed.validation',function(e,error){
    //error={state:false,message:'错误时的提示信息'}
  })
```  
**failed.validation** 当表单值通过所有策略的验证时触发

验证策略
---
    策略的传入有2种方式
    
**字符串形式**（使用自带策略时使用此方式）多条规则之间以分号;隔开,参数以:分隔 

  eg : 验证最小长度为4，最大长度为10的汉字 `` 'chinese;minLength:4;maxLength:10' ``
    
**函数** (当自带策略不满足需求时使用)
``` javascript
  $('input').validation('add',function(value){
      var state = /^\d*$/.test(value);
      return {
        state: state,
        message: state ? '验证成功' : '只能包含数字'
      };
  })
```  
默认策略
* chinese 只允许汉字输入
* mobilephone 手机号
* minLength  最小长度 使用需传入数字参数 minLength:3
* maxLength  最大长度 使用需传入数字参数 maxLength:4
* sameAs     与其他某个表单元素值相同 使用需传入jQuery选择器参数 sameAs:#input
* letter     字母数字下划线
* email      邮箱
* title      普通字符与汉字
* number     数字
* reg        自定义正则  使用需传入正则字符串参数  reg:^\d$

