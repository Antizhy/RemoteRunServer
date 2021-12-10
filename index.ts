import WebSocket from 'ws';
import UUID from 'short-uuid';
const mPort = 8088;
const WServer = WebSocket.Server;
const wss = new WServer({ port: mPort });

interface ConnectionInfo {
    [key: string]: WebSocket;
}

const BLACK = 30;
const RED = 31;
const GREEN = 32;
const YELLOW = 33;
const BLUE = 34;
const MAGENTA = 35;
const CYAN = 36;
const WHITE = 37;

const corlorLog = (text: string, color: number) :void => {
    /* 
    text = 'abcdefg{}hijklmn{}'
        前景色            背景色           颜色
        ---------------------------------------
        30                40              黑色
        31                41              红色
        32                42              绿色
        33                43              黃色
        34                44              蓝色
        35                45              紫红色
        36                46              青蓝色
        37                47              白色
    */
    let tmp = text.split('{}');
    //console.log(tmp);
    console.log(`[${getTimeStr()}]${tmp[0]}\x1b[${color}m${tmp[1]}\x1b[0m${tmp[2]}`);
   
};
const getTimeStr = (): string => {
  let date = new Date();
  let res = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return res;
};
const conPool: ConnectionInfo = {};
let rc: string[] = [];
let cl: string[] = [];

console.log(`[${getTimeStr()}][SERVER] launch server on ${mPort}...`);
let wsend = (mess: string): number => {
    if (rc.length > 0) {
        for(let i of rc) {
            console.log(`[${getTimeStr()}][SERVER] send [${i}] run client  ${mess}`);
            conPool[i].send(mess);
        }
        return 0;
    }
    else {
        corlorLog(`[SERVER] {}error! no remoterun client!{}`, RED);
        return -1;
    }
};
let wsendcl = (mess: string): number => {
    if (rc.length > 0) {
        for(let i of cl) {
            console.log(`[${getTimeStr()}][SERVER] send [${i}] control client  ${mess}`);
            conPool[i].send(mess);
        }
        return 0;
    }
    else {
        corlorLog(`[SERVER] {}error! no control client!{}`, RED);
        return -1;
    }
};
wss.on('connection', (ws) => {
    // 连接
    const uid = UUID.generate().toString();
    //let cid = idNo++;
    conPool[uid] = ws;
    console.log(`[${getTimeStr()}][SERVER] client ${uid} has connected!`);
    //console.log('connected...');
    ws.on('message', (message) => {
        let mess = message.toString().split(' ');
        console.log(`[${getTimeStr()}][SERVER] recieve [${uid}]: ${message.toString()}`);
        if (mess[0] == '/run') {
            let res = wsend('/run');
            let tmp;
            if (res == 0) {
                tmp = `服务器向 远程执行客户端 发送 /run`;
            }
            else {
                tmp = '发送失败，远程执行客户端 未连接!';
            }
            ws.send(tmp);
        }
        else if(mess[0] == "/exit")
        {
            let res = wsend('/exit');
            let tmp;
            if (res == 0) {
                tmp = `服务器向 远程执行客户端 发送 /run`;
            }
            else {
                tmp = '发送失败，远程执行客户端 未连接!';
            }
            ws.send(tmp);
        }
        else if (mess[0] == '/rc') {
            rc.push(uid);
            corlorLog(`[SERVER] {}has recognised remoterun client [${uid}].{}`, GREEN);
            ws.send('/ok');
        }
        else if(mess[0] == '/client') {
            cl.push(uid);
            corlorLog(`[SERVER] {}has recognised control client [${uid}].{}`, CYAN);
            ws.send('/ok');
        }
        else if(mess[0] == '/hide') {
            let res = wsend('/hide');
            let tmp;
            if (res == 0) {
                tmp = `服务器向 远程执行客户端 发送 /hide`;
            }
            else {
                tmp = '发送失败，远程执行客户端 未连接!';
            }
            ws.send(tmp);
        }
        else if(mess[0] == '/info')
        {
            //console.log(`[SERVER]${message.toString()}`)
            wsendcl(message.toString().replace('/info ', ''));
        }
        else {
            let tmp = '复读--' + message.toString();
            ws.send(tmp);
        }
    });

    ws.on('close', () => {
        let index = rc.findIndex((el)=>{return el == uid;});
        if (index != -1) {
            corlorLog(`[SERVER] {}remoterun client [${uid}] is offlining...{}`, YELLOW);
            rc.splice(index, 1);
        }
        index = cl.findIndex((el)=>{return el == uid;});
        if (index != -1) {
            corlorLog(`[SERVER] {}control client [${uid}] is offlining...{}`, YELLOW);
            cl.splice(index, 1);
        }
        corlorLog(`[SERVER] {}[${uid}] close{}`, MAGENTA);
        delete conPool[uid];
    });

});


