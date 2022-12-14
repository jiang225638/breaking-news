$(function() {
    let form = layui.form
    var layer = layui.layer
    
    form.verify({
       nickname:function(value) {
        if(value.length > 6 ) return '昵称长度必须在1 - 6 之间！'
       }
    })

    initUserInfo() 
      
    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res) {
            //    console.log(res);
            if(res.status !== 0 ) return layer.msg('获取用户信息失败！')
            // console.log(res);
            form.val('formDereference', res.data);
            }
        })
    }

    // 为重置按钮绑定点击事件
    $('#btnReset').on('click',function(e) {
        // 阻止表单的默认重置行为
        
        // console.log(e);
        e.preventDefault()
        initUserInfo()
    })



    // 监听表单的提交事件
    $('.layui-form').on('submit',function(e) {
        // 阻止表单的默认提交行为
         e.preventDefault()
        //  发起ajax请求
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0) return layer.msg('设置用户信息失败！')
                layer.msg('设置用户信息成功！')
                // 调用父页面的方法，重新渲染用户头像和信息
                window.parent.getUserInfo()
                // console.log(res);
            }
        })
    })

})


