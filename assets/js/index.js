$(function() {
    // 调用函数，获取用户基本信息
    getUserInfo()

    // '退出'绑定点击事件
    $('#btnLogout').on('click',function() {
        // console.log('ok');
        // layui提示框
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'},
         function(index){
            // 1、清除本地缓存的token
            localStorage.removeItem('token')

            // 2、跳转到登录页面
            location.href = '/login.html'

            // 关闭confirm询问框
            layer.close(index);
          });
    })
})


// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // headers:{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success:function(res) {
            // console.log(res);
            if(res.status !== 0) layer.msg('获取用户信息失败！')
            renderAvatar(res.data)
        },
        complete:function(res) {
            console.log(res);
            if(res.responseJSON.status === 1 || res.responseJSON.message === '身份认证失败！') {
                // 1、强制清空token
                localStorage.removeItem('token')

                // 2、强制跳转到登录页
                location.href = '/login.html'
            }
        }
       
    })
}

// 渲染用户头像
function renderAvatar({id,nickname,user_pic,username}) {
// 1、获取用户的名称
    // console.log(id,nickname,user_pic,username);
    let name = nickname || username
// 2、设置欢迎的文本
    $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`)
// 3、渲染用户头像
    if(user_pic !== null) {
        $('.layui-nav-img').attr('src',user_pic).show()
        $('.text_avatar').hide()
    }else {
        let first = username[0].toUpperCase()
        $('.text_avatar').html(first).show()
        $('.layui-nav-img').hide()
    }
}



