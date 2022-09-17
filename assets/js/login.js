$(function() {
    let rootUrl = 'http://www.liulongbin.top:3007'
    // 点击“去注册账号”的链接
    $('#link_reg').on('click',function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //  点击“去登录”的链接
    $('#link_login').on('click',function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })


    let form = layui.form
    let layer = layui.layer
    form.verify({
        // 自定义一个pwd校验规则
        pwd:[/^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格' ],
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于判断
            // 如果判断失败，则return一个提示消息
          let pwd = $('.reg-box [name=password]').val()
          if(pwd !== value) {
            return '两次密码不一致！'
           }
        }
    })

    $('#form_reg').on('submit',function(e) {
        e.preventDefault()
        let regStr = $(this).serialize()
        console.log(regStr);
        $.ajax({
            method:'POST',
            url:`${rootUrl}/api/reguser`,
            data:regStr,
            success:function(res) {
                console.log(res);
                if(res.status !== 0) return layer.msg(res.message)
                layer.msg('注册成功，请登录！')
                $('#link_login').click()
            }
        })
    })

 $('#form_login').on('submit',function(e) {
    e.preventDefault()
    let regStr = $(this).serialize()
    $.ajax({
        method:'POST',
        url:`${rootUrl}/api/login`,
        data:regStr,
        success:function(res) {
            console.log(res);
            if(res.status !== 0) return layer.msg(res.message)
            layer.msg(res.message)
            // 将登录成功得到的 token 字符串保存到 localStorage
            localStorage.setItem('token',res.token)
            location.href = '/index.html'
        }
    })
 })





})