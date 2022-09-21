$(function() {
    let layer = layui.layer 
    let form = layui.form

    initArtClassesList()
    // 获取文章分类列表
    function initArtClassesList() {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res) {
                // console.log(res);
              if(res.status !== 0) return layer.msg('获取文章分类列表失败！')
              //   layer.msg('获取文章分类列表成功！')
              let tableStr = template('tpl-table',res)
               $('tbody').html(tableStr)
            }
        })
    }

    // 给 “添加类别” 按钮增加点击弹出层事件
    let indexAdd = null
    $('#btnAddClasses').on('click',function() {
        indexAdd =   layer.open({
            type:1,
            area:['500px','250px'],
            title: '添加文章分类',
            content: $('#addDialog').html()
          });     
    })

    // 通过代理的形式为form绑定submit事件
    $('body').on('submit','#formAdd',function(e){
        e.preventDefault()
        // console.log('ok');
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res) {
                console.log(res);
                if(res.status !== 0) return layer.msg(res.message)
                initArtClassesList()
                layer.msg(res.message)
                // 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式为btn-edit绑定submit事件
    let indexEdit = null
    $('tbody').on('click','.btn-edit',function() {
        //    弹出一个修改文章信息的层
        indexEdit = layer.open({
            type:1,
            area:['500px','250px'],
            title: '修改文章分类',
            content: $('#editDialog').html()
          });  

          let id = $(this).attr('data-id') 
        //   console.log(index);
        //   发起请求获取对应的数据
        $.ajax({
                method:'GET',
                url:'/my/article/cates/' + id,
                success:function(res) {
                    //    console.log(res);
                    if(res.status !== 0) return layer.msg(`获取id为${id}的数据失败！`)
                    form.val('form-Edit',res.data)
                }
        })
    })

// 通过代理的形式为form绑定submit事件
 $('body').on('submit','#formEdit',function(e){
    e.preventDefault()
    // console.log('ok');
    $.ajax({
        method:'POST',
        url:'/my/article/updatecate',
        data:$(this).serialize(),
        success:function(res) {
            // console.log(res);
            if(res.status !== 0) return layer.msg('更新分类数据失败！')
            initArtClassesList()
            layer.msg('更新分类数据成功！')
            // 关闭弹出层
            layer.close(indexEdit)
        }
    })
})


// 通过代理的形式为删除按钮绑定点击事件
$('tbody').on('click','.btn-delete',function(){
    // console.log('ok');
    let id = $(this).attr('data-id')
    // console.log(id);
    // 提示用户是否要删除
    layer.confirm('确认删除？',{icon: 3, title:'提示'}, function(index){
    //do something
    $.ajax({
        method:'GET',
        url:'/my/article/deletecate/' + id,
        success:function(res) {
                if(res.status !== 0 ) return layer.msg(res.message)
        
                layer.msg(res.message)
                layer.close(index);
                initArtClassesList()
        }
    })
  });




})



})


