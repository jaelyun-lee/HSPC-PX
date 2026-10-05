'use strict';
const $=id=>document.getElementById(id);
const labels={opioid:'Opioid 사용',ldh:'LDH > ULN',site:'전이 부위',ecog:'ECOG PS',albumin:'Albumin',hemoglobin:'Hemoglobin',alp:'ALP',psa:'PSA'};
function clearResult(){$('result').hidden=true;$('error').textContent='';}
$('form').addEventListener('input',clearResult);
$('form').addEventListener('change',clearResult);
$('reset').onclick=()=>{$('form').reset();clearResult();};
$('example').onclick=()=>{clearResult();const v={site:'bone',opioid:'1',ldh:'0',ecog:'1',albumin:'4.0',hemoglobin:'14.0',alp:'130',psa:'90'};for(const[k,a]of Object.entries(v))$(k).value=a;};
$('form').onsubmit=e=>{
 e.preventDefault();clearResult();
 try{
  for(const k of Object.keys(labels))if($(k).value==='')throw Error('8개 변수를 모두 입력해 주세요.');
  const v={};for(const k of ['albumin','hemoglobin','alp','psa','ecog'])v[k]=Number($(k).value);
  v.site=$('site').value;v.opioid=$('opioid').value==='1';v.ldh=$('ldh').value==='1';
  const r=Model.calculate(v);
  $('total').textContent=`${r.total.toFixed(1)} 점`;
  $('risk').textContent=`2군 분류: ${r.risk2} · 3군 분류: ${r.risk3} (근사 점수 기준)`;
  $('detail').replaceChildren();
  for(const[k,n]of Object.entries(r.detail)){const tr=document.createElement('tr');for(const s of [labels[k],n.toFixed(1)]){const td=document.createElement('td');td.textContent=s;tr.append(td);}$('detail').append(tr);}
  if(!r.inRange){$('survival').textContent=`총점이 추출 곡선 범위(${r.range[0].toFixed(1)}–${r.range[1].toFixed(1)}점) 밖입니다. 생존율을 추정하지 않습니다.`;$('plot').replaceChildren();}
  else{
   $('survival').innerHTML='<div class="metrics">'+Object.entries(r.survival).map(([t,s])=>`<div class="metric">${t}개월<strong>≈ ${Math.round(s*100)}%</strong></div>`).join('')+'</div>';
   const entries=Object.entries(r.survival),x=t=>50+(t-18)/30*340,y=s=>195-s*155;
   $('plot').innerHTML=`<svg class="chart" viewBox="0 0 420 240" role="img" aria-label="예측 생존율: ${entries.map(([t,s])=>t+'개월 '+Math.round(s*100)+'%').join(', ')}">${[0,.25,.5,.75,1].map(s=>`<line x1="50" x2="395" y1="${y(s)}" y2="${y(s)}" stroke="#e0eaef"/><text x="6" y="${y(s)+4}" fill="#5b7583" font-size="12">${s*100}%</text>`).join('')} ${entries.map(([t,s])=>`<circle cx="${x(+t)}" cy="${y(s)}" r="5" fill="#147988"/><text x="${x(+t)}" y="220" font-size="12" text-anchor="middle" fill="#5b7583">${t}개월</text>`).join('')}<text x="50" y="18" fill="#5b7583" font-size="12">지정 시점의 근사 생존율</text></svg>`;
  }
  $('result').hidden=false;$('result').scrollIntoView({behavior:'smooth',block:'start'});
 }catch(err){$('error').textContent=err.message;}
};
