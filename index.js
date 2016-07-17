
var net = require('net');

/**
  * ����������
  */

//׷��������
var count = 0;
//������������¼�û���Ϣ
var users = {};


var server = net.createServer(function(conn){
	
	conn.setEncoding('utf-8');

	//handle connection
	console.log('\033[90m new connection! \033[39m');
	conn.write(" -- Welcome to \033[92m node-chat\033[39m!\r\n" );
	conn.write(" -- " + count + " other people are connected at this time.\r\n");
	conn.write(" -- please write your name and press enter: \r\n" );
	count++;

	//��¼�û��ǳƵı���
	var nickname;

	//����windowsϵͳ���ñ���������ʱ��¼ÿ�У��س��ָ�������Ϣ
	var item = "";


	//�㲥����broadcast

	function broadcast(msg, exceptMyself){
		for(var i in users){
			if(!exceptMyself || i!= nickname){
				users[i].write(msg);
			}
		}
	}


	conn.on('data', function(data){
	//ÿ�е����룬��û���У��س�����ƴ��һ��
		if(data != '\r\n'){
			item = item + data;
		}else{
			//ÿ�����û���¼����ǰnicknameΪ�գ���һ����Ϣ���������ǳ�
			if(!nickname){
				//����ǳ��Ƿ��ѱ�ռ��	
				if(users[item]){
					conn.write('This nickname is alreday in use. Try again! \r\n');
					return;
				}else{
					nickname = item;
					users[nickname] = conn;
					broadcast(nickname + ' joined the chatroom. \r\n', false);
				}
			}else{             //֮������Ƕ���Ϊnickname���û��ķ��Խ��й㲥		
				broadcast(nickname + ': ' + item + '\r\n', true);					
			}
			//������һ����Ϣ֮�����
			item = "";	
		}
	});

	//ÿ���û�����...������������һ,�ڹ���������ɾ����Ӧ���֪ͨ���������û�...
	conn.on('close', function(){
		count--;
		delete users[nickname];
		broadcast('\033[96m > ' + nickname + ' left the chatroom\033[39m\r\n', true);
	});
});



//����

server.listen(3000, function(){
	console.log('\033[96m server listening on *:3000......\033[39m');
});

