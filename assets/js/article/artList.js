$(function() {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage


    // 时间过滤器
    template.defaults.imports.dataFormat = function(data) {
           let dt = new Date(data)
           let Y = dt.getFullYear()
           let M = (dt.getMonth() + 1 + '').padStart(2,'0')
           let D = (dt.getDate() + '').padStart(2,'0')

           let hh = (dt.getHours() + '').padStart(2,'0')
           let mm = (dt.getMinutes() + '').padStart(2,'0')
           let ss = (dt.getSeconds() + '').padStart(2,'0')
           return `${Y}-${M}-${D} ${hh}:${mm}:${ss}`
    }

// 定义一个查询的参数对象，将来请求数据的时候
// 需要将请求的参数对象提交到服务器
let q = {
    pagenum: 1,   // 页码值，默认请求第一页的数据
    pagesize: 2,  // 每页显示几条数据，默认每页显示2条
    cate_id: '',  // 文章分类的Id
    state: ''     // 文章的发布状态
}

initTable()
initArticle()

// 获取文章列表数据的方法
function initTable() {
    $.ajax({
        method:'GET',
        url:'/my/article/list',
        data:q,
        success:function(res) {
            // console.log(res);
          if(res.status !== 0 ) return layer.msg(res.message) 
        //   使用模板引擎渲染数据
        let tableStr = template('tpl-table',res)
        // console.log(tableStr);
        $('tbody').html(tableStr)
        // 调用渲染分页的方法
        renderPage(res.total)
        }
    })
}

// 初始化文章分类的方法
function initArticle() {
    $.ajax({
        method:'GET',
        url:'/my/article/cates',
        success:function(res) {
            if(res.status !== 0 ) return layer.msg(res.message) 
            let htmlStr = template('tpl-cateId',res)
            $('[name=cate_id]').html(htmlStr)
            // 通知 layui 重新渲染表单区域的UI结构
            form.render()
        }
    })
}


    // 为筛选表单绑定submit事件
    $('#formSearch').on('submit',function(e) {
        e.preventDefault()
        //  获取表单选项中的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 为查询对象q中的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格数据
        initTable()
        
    })


    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()方法
        laypage.render({
             elem: 'pageBox',     //分页容器ID，注意，这里的 test1 是 ID，不用加 # 号
             count: total,        //数据总数，从服务端得到
             limit: q.pagesize,   //每页显示的条数
             curr: q.pagenum,     //起始页
             layout:['count','limit','prev','page','next','skip'],
             limits:[2,3,5,10],
            //  分页切换的时候，触发jump回调
            // 触发jump回调的方式有两种：
            // 1、点击页码的时候，会触发jump回调
            // 2、只要调用了 laypage.render()方法，就会触发jump回调
            jump:function(obj,first) {
               console.log(obj.curr);  // 监听到当前的页码值
            // 把最新的页码值赋值到查询参数q对象中
             q.pagenum = obj.curr
            //  把最新的条目数，赋值到q这个查询参数对象的pagesize属性中
            q.pagesize = obj.limit
            //  根据最新的q获取对应的数据，并渲染列表
            //  initTable()      //直接放在这儿，是死循环
            // 可以用过first的值判断是哪种方式调用的jump回调
            // 如果first的值为true，证明是方式2触发的
            // 否则就是方式1触发
             if(!first) {
                initTable() 
             }
            }
        })
    }



    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click','.btn-delete',function(){
        // 拿到所有删除按钮的个数
        let btnLen = $(this).length
        // 获取文章自定义属性id
        let id = $(this).attr('data-id')
        // console.log(id);
        // 询问用户是否要删除
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
 
            $.ajax({
                method:'GET',
                url:'/my/article/delete/' + id,
                success:function(res) {
                    if(res.status !== 0 ) return layer.msg(res.message)
                    layer.msg(res.message)
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值-1之后，再重新调用initTable方法
                    if(btnLen === 1) {
                        // 如果btnLen的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
          });
    })

})