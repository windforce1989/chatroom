
var net = require('net');

/**
  * 创建服务器
  */

//追踪连接数
var count = 0;
//关联数组对象记录用户信息
var users = {};


var server = net.createServer(function(conn){
	
	conn.setEncoding('utf-8');

	//handle connection
	console.log('\033[90m new connection! \033[39m');
	conn.write(" -- Welcome to \033[92m node-chat\033[39m!\r\n" );
	conn.write(" -- " + count + " other people are connected at this time.\r\n");
	conn.write(" -- please write your name and press enter: \r\n" );
	count++;

	//记录用户昵称的变量
	var nickname;

	//对于windows系统，该变量用于临时记录每行（回车分隔）的信息
	var item = "";


	//广播方法broadcast

	function broadcast(msg, exceptMyself){
		for(var i in users){
			if(!exceptMyself || i!= nickname){
				users[i].write(msg);
			}
		}
	}


	conn.on('data', function(data){
	//每行的输入，若没换行（回车）就拼在一起！
		if(data != '\r\n'){
			item = item + data;
		}else{
			//每有新用户登录，当前nickname为空，第一条信息就是设置昵称
			if(!nickname){
				//检查昵称是否已被占用	
				if(users[item]){
					conn.write('This nickname is alreday in use. Try again! \r\n');
					return;
				}else{
					nickname = item;
					users[nickname] = conn;
					broadcast(nickname + ' joined the chatroom. \r\n', false);
				}
			}else{             //之后的则是对名为nickname的用户的发言进行广播		
				broadcast(nickname + ': ' + item + '\r\n', true);					
			}
			//发送完一条信息之后清空
			item = "";	
		}
	});

	//每当用户下线...在线连接数减一,在关联数组中删除相应项，并通知其余在线用户...
	conn.on('close', function(){
		count--;
		delete users[nickname];
		broadcast('\033[96m > ' + nickname + ' left the chatroom\033[39m\r\n', true);
	});
});



//监听

server.listen(3000, function(){
	console.log('\033[96m server listening on *:3000......\033[39m');
});

