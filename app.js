var ws = require("nodejs-websocket");
  
var server = ws.createServer(function (conn) {  
    console.log("New connection");  
    
    //绑定 text 事件 监听接收客户端的消息
    conn.on('text',function(str){
        console.log(str);
        // 调用广播
        var data = JSON.parse(str);

        switch (data.type) {
            case 'setname':
                //将data.name 赋值给当前的连接 conn.nickname (客户端昵称，不为空时需显示到其他的客户端上)
                conn.nickname = data.name;
                boardcast(JSON.stringify({
                    name:'server',
                    text:data.name + '加入了房间'
                }));
                break;
            case 'chat':
                boardcast(JSON.stringify({
                    name:conn.nickname,
                    text:data.text
                }));
                break;
            default:
                break;
        }
    });

    conn.on('close',function(){
        boardcast(JSON.stringify({
            name:'server',
            text:conn.nickname + '离开了房间'
        }));
    });
    // 给客户端推送消息
    //conn.sendText('来自服务端的消息');

    conn.on('error',function(err){
        console.log(err);
    });    
}).listen(2333);
// 添加一个广播
function boardcast(str){
    // server.connections 获取到所有连接 ；用forEach循环遍历出每一项对象
    server.connections.forEach(function (conn){
        // 将消息推给所有客户端
        conn.sendText(str);
    });
}