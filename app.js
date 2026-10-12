const $=s=>document.querySelector(s),scenes=[...document.querySelectorAll('.scene')],audio=$('#audio');let current=0,started=false,busy=false,toastTimer,swipeY=null,quoteSong=false;
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2600)}
function syncMusic(){const playing=!audio.paused;$('#music').setAttribute('aria-pressed',String(playing));$('#music').setAttribute('aria-label',playing?'暂停背景音乐':'播放背景音乐');$('#music-label').textContent=playing?'音乐开':'音乐关'}
async function playMusic(){try{await audio.play()}catch{toast('轻触右上角，即可开启音乐')}syncMusic()}
audio.volume=.45;audio.addEventListener('play',syncMusic);audio.addEventListener('pause',syncMusic);audio.addEventListener('error',()=>{syncMusic();toast('音乐暂时无法加载，请稍后重试')});
$('#music').onclick=()=>audio.paused?playMusic():audio.pause();
$('#start').onclick=()=>{if(started)return;started=true;$('#intro').classList.add('dismissed');$('#intro').inert=true;playMusic()};
function go(index){if(!started||busy||index<0||index>2||index===current)return;busy=true;current=index;scenes.forEach((s,i)=>{s.classList.toggle('active',i===index);s.setAttribute('aria-hidden',String(i!==index));s.inert=i!==index});document.querySelectorAll('.dots button').forEach((b,i)=>{if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});$('#book').classList.toggle('ending',index===2);$('#back').disabled=index===0;$('#page-count').textContent=`0${index+1} — 03`;setTimeout(()=>busy=false,750)}
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(Number(b.dataset.go)));$('#frame-hit').onclick=()=>go(1);$('#back').onclick=()=>go(current-1);
$('#tear').onclick=()=>go(2);
$('#quote-toggle').onclick=()=>{quoteSong=!quoteSong;$('#quote-main').hidden=quoteSong;$('#quote-song').hidden=!quoteSong;$('#quote-toggle').setAttribute('aria-label',quoteSong?'切换至目送摘录':'切换至歌词摘录')};
$('#replay').onclick=()=>{quoteSong=false;$('#quote-main').hidden=false;$('#quote-song').hidden=true;$('#quote-toggle').setAttribute('aria-label','切换至歌词摘录');go(0)};
$('#book').addEventListener('touchstart',e=>{swipeY=e.touches[0].clientY},{passive:true});$('#book').addEventListener('touchend',e=>{if(swipeY===null)return;const dy=e.changedTouches[0].clientY-swipeY;swipeY=null;if(Math.abs(dy)>65)go(current+(dy<0?1:-1))},{passive:true});
document.addEventListener('keydown',e=>{if(['ArrowDown','ArrowRight'].includes(e.key))go(current+1);if(['ArrowUp','ArrowLeft'].includes(e.key))go(current-1)});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!audio.paused)audio.pause()});
