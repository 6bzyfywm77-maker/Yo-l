// YO'L TEST backend: Node.js 18+, tashqi kutubxonasiz
const http=require('http'),fs=require('fs'),os=require('os'),path=require('path'),crypto=require('crypto');
const PORT=process.env.PORT||3000,DIR=process.env.DATA_DIR||path.join(__dirname,'data'),DB=path.join(DIR,'db.json'),PUB=path.join(__dirname,'public');
fs.mkdirSync(DIR,{recursive:true});
let db=fs.existsSync(DB)?JSON.parse(fs.readFileSync(DB,'utf8')):{secret:crypto.randomBytes(32).toString('hex'),users:{}};
const save=()=>{fs.writeFileSync(DB+'.tmp',JSON.stringify(db));fs.renameSync(DB+'.tmp',DB)};
const hp=(p,s=crypto.randomBytes(16).toString('hex'))=>({s,h:crypto.scryptSync(p,s,32).toString('hex')});
const eq=(a,b)=>a.length===b.length&&crypto.timingSafeEqual(Buffer.from(a),Buffer.from(b));
const ck=(p,o)=>eq(hp(p,o.s).h,o.h);
if(!db.admin){const au=process.env.ADMIN_USER||'admin',ap=process.env.ADMIN_PASS||crypto.randomBytes(5).toString('hex');db.admin={u:au,...hp(ap)};save();console.log(`\n=== ADMIN: login "${au}" parol "${ap}" (panelda o'zgartiring) ===\n`)}
if(process.env.NEW_ADMIN_PASS){db.admin={u:db.admin.u,...hp(process.env.NEW_ADMIN_PASS)};save();console.log('Admin paroli yangilandi')}
const sign=x=>crypto.createHmac('sha256',db.secret).update(x).digest('base64url');
const mk=(u,r,x)=>{const b=Buffer.from(JSON.stringify({u,r,x})).toString('base64url');return b+'.'+sign(b)};
const auth=req=>{const [b,g]=(req.headers.authorization||'').slice(7).split('.');if(!g||!eq(sign(b),g))return null;try{const o=JSON.parse(Buffer.from(b,'base64url'));if(o.x<Date.now())return null;if(o.r==='user'){const u=db.users[o.u];if(!u||u.exp<Date.now())return null}return o}catch{return null}};
const J=(res,c,o)=>{res.writeHead(c,{'Content-Type':'application/json'});res.end(JSON.stringify(o))};
const body=req=>new Promise(r=>{let d='';req.on('data',c=>{d+=c;if(d.length>2e5)req.destroy()});req.on('end',()=>{try{r(JSON.parse(d||'{}'))}catch{r({})}})});
const MT={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'};
function stat(p,res){const f=[path.join(__dirname,'index.html'),path.join(PUB,'index.html')].find(x=>fs.existsSync(x));
if(p!=='/'&&p!=='/index.html'||!f){res.writeHead(404);return res.end('404')}
res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});fs.createReadStream(f).pipe(res)}
const lim=new Map(),DAY=864e5,NAME=/^[a-z0-9_.]{3,30}$/;
http.createServer(async(req,res)=>{
const p=new URL(req.url,'http://x').pathname,m=req.method;
if(!p.startsWith('/api/'))return stat(p,res);
try{
const b=(m==='GET'||m==='DELETE')?{}:await body(req);
if(p==='/api/login'&&m==='POST'){
const ip=req.socket.remoteAddress,l=lim.get(ip)||{n:0,t:0};
if(l.t>Date.now())return J(res,429,{error:"Ko'p urinish. Birozdan keyin urining."});
const nm=String(b.u||'').trim().toLowerCase(),pw=String(b.p||'');let role=null,rec=null;
if(nm===db.admin.u){if(ck(pw,db.admin))role='admin'}else if(db.users[nm]&&ck(pw,db.users[nm])){role='user';rec=db.users[nm]}
if(!role){l.n++;if(l.n>=5)l.t=Date.now()+30000*Math.min(l.n-4,10);lim.set(ip,l);return J(res,401,{error:"Login yoki parol noto'g'ri."})}
if(rec&&rec.exp<Date.now())return J(res,403,{error:'Muddati tugagan. Yangilash uchun adminga yozing.'});
lim.delete(ip);const exp=rec?rec.exp:Date.now()+12*36e5;
return J(res,200,{token:mk(nm,role,exp),role,exp,data:rec?rec.data:null})}
const a=auth(req);if(!a)return J(res,401,{error:'Qayta kiring'});
if(p==='/api/data'&&m==='PUT'){if(a.r==='user'&&JSON.stringify(b).length<1e5){db.users[a.u].data=b;save()}return J(res,200,{})}
if(a.r!=='admin')return J(res,403,{error:'Ruxsat yo\'q'});
const s=p.split('/'),nm=decodeURIComponent(s[4]||'');
if(p==='/api/admin/users'&&m==='GET')return J(res,200,{users:Object.entries(db.users).map(([u,x])=>({u,exp:x.exp,created:x.created,n:((x.data||{}).hist||[]).length})).sort((x,y)=>y.created-x.created)});
if(p==='/api/admin/users'&&m==='POST'){const u=String(b.u||'').trim().toLowerCase(),pw=String(b.p||''),d=Math.min(Math.max(parseInt(b.days)||30,1),3650);
if(!NAME.test(u)||pw.length<6)return J(res,400,{error:'Login (3+ lotin belgi) va parol (6+) kiriting.'});
if(u===db.admin.u||db.users[u])return J(res,409,{error:'Bu login band.'});
db.users[u]={...hp(pw),exp:Date.now()+d*DAY,created:Date.now(),data:null};save();return J(res,200,{u,days:d})}
if(p==='/api/admin/password'&&m==='POST'){if(!ck(String(b.old||''),db.admin))return J(res,403,{error:"Joriy parol noto'g'ri."});if(String(b.new||'').length<8)return J(res,400,{error:'Yangi parol 8+ belgi.'});
db.admin={u:db.admin.u,...hp(b.new)};db.secret=crypto.randomBytes(32).toString('hex');save();return J(res,200,{})}
if(s[3]==='users'&&db.users[nm]){
if(m==='DELETE'){delete db.users[nm];save();return J(res,200,{})}
if(s[5]==='extend'){const x=db.users[nm];x.exp=Math.max(x.exp,Date.now())+(parseInt(b.days)||30)*DAY;save();return J(res,200,{exp:x.exp})}
if(s[5]==='password'&&String(b.p||'').length>=6){Object.assign(db.users[nm],hp(String(b.p)));save();return J(res,200,{})}}
J(res,404,{error:'Topilmadi'})}catch(e){console.error(e);J(res,500,{error:'Server xatosi'})}
}).listen(PORT,'0.0.0.0',()=>{console.log('Lokal:  http://localhost:'+PORT);for(const l of Object.values(os.networkInterfaces()).flat())if(l.family==='IPv4'&&!l.internal)console.log('Tarmoq: http://'+l.address+':'+PORT+'  (boshqa telefon shu Wi-Fi da)')});
