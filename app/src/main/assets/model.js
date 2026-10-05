'use strict';
const Model = (() => {
 const data = typeof MODEL_DATA !== 'undefined' ? MODEL_DATA : require('./model-data.js');
 const width = 356.600037 - 137.701050;
 const point = dx => dx / width * 100;
 const bounds = {albumin:[1,6],hemoglobin:[7,17],alp:[Math.exp(3.5),Math.exp(8.5)],psa:[Math.exp(-3),Math.exp(9)]};
 function validate(v) {
  for(const k of ['ecog','site','opioid','ldh']) {
   const allowed = k==='ecog'?[0,1,2]:k==='site'?['ln','bone','visceral']:[false,true];
   if(!allowed.includes(v[k])) throw Error('모든 임상 변수를 선택해 주세요.');
  }
  for(const [k,[lo,hi]] of Object.entries(bounds)) {
   if(typeof v[k]!=='number'||!Number.isFinite(v[k])||v[k]<lo||v[k]>hi) throw Error(`${k}: 그림의 입력 범위 ${lo.toFixed(1)}–${hi.toFixed(1)}를 확인해 주세요.`);
  }
 }
 function components(v) {
  return {
   opioid:v.opioid?point(26.623):0,
   ldh:v.ldh?point(101.336):0,
   site:point(v.site==='ln'?0:v.site==='bone'?17.630:88.800),
   ecog:v.ecog*point(184.788)/2,
   albumin:(6-v.albumin)*point(184.759)/5,
   hemoglobin:(17-v.hemoglobin)*point(197.792)/10,
   alp:(Math.log(v.alp)-3.5)*point(218.886)/5,
   psa:(Math.log(v.psa)+3)*point(54.153)/12
  };
 }
 const lo = Math.max(...Object.values(data.curves).map(a=>a[0][0]));
 const hi = Math.min(...Object.values(data.curves).map(a=>a[a.length-1][0]));
 function interpolate(a,x) {
  if(x<a[0][0]||x>a[a.length-1][0]) throw Error('표시된 생존율 곡선 범위 밖입니다.');
  for(let i=1;i<a.length;i++) if(x<=a[i][0]) {
   const [x0,y0]=a[i-1], [x1,y1]=a[i];
   return y0+(y1-y0)*(x-x0)/(x1-x0);
  }
  return a[a.length-1][1];
 }
 function calculate(v) {
  validate(v); const detail=components(v),total=Object.values(detail).reduce((a,b)=>a+b,0);
  const inRange=total>=lo&&total<=hi;
  return {total,detail,inRange,range:[lo,hi],risk2:total<=166.6?'저위험':'고위험',risk3:total<140?'저위험':total<=194.96?'중간위험':'고위험',survival:inRange?Object.fromEntries(Object.entries(data.curves).map(([t,a])=>[t,interpolate(a,total)])):null};
 }
 return {calculate,validate,components,bounds,data,interpolate};
})();
if(typeof module!=='undefined') module.exports=Model;
