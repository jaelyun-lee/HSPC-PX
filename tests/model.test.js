'use strict';
const assert=require('node:assert/strict');
const M=require('../app/src/main/assets/model.js');
const base={site:'bone',opioid:true,ecog:1,ldh:false,albumin:4,hemoglobin:14,alp:130,psa:90};
const cases=[
 [{site:'ln',opioid:false,ecog:0,ldh:false,albumin:3.9,hemoglobin:12.7,alp:140,psa:80},118],
 [base,166],
 [{site:'ln',opioid:false,ecog:1,ldh:true,albumin:4.5,hemoglobin:15,alp:90,psa:70},167],
 [{site:'visceral',opioid:true,ecog:0,ldh:true,albumin:4.2,hemoglobin:13,alp:130,psa:110},209]
];
for(const [v,expected] of cases) assert.ok(Math.abs(M.calculate(v).total-expected)<0.5,`Appendix A1: ${expected}`);
// Appendix row 1 contains Hb 17.7, outside the plotted 7–17 axis: reject rather than extrapolate.
assert.throws(()=>M.calculate({...base,hemoglobin:17.7}));
for(const field of ['albumin','hemoglobin','psa','alp'])for(const value of [NaN,Infinity,-1,'4',null])assert.throws(()=>M.calculate({...base,[field]:value}));
assert.throws(()=>M.calculate({...base,psa:0}));
assert.throws(()=>M.calculate({...base,ecog:3}));
assert.throws(()=>M.calculate({...base,opioid:'no'}));
assert.throws(()=>M.calculate({...base,site:'liver'}));
const r=M.calculate(base),ss=Object.values(r.survival);
for(let i=0;i<ss.length;i++){assert.ok(ss[i]>=0&&ss[i]<=1);if(i)assert.ok(ss[i]<ss[i-1]);}
for(const change of [{ecog:2},{ldh:true},{site:'visceral'},{albumin:3},{hemoglobin:10},{psa:1000},{alp:1000}]){
 const other=M.calculate({...base,...change});assert.ok(other.total>r.total);if(other.survival)for(const t of Object.keys(r.survival))assert.ok(other.survival[t]<r.survival[t]);
}
const low=M.calculate({site:'ln',ecog:0,ldh:false,opioid:false,albumin:6,hemoglobin:17,alp:Math.exp(3.5),psa:Math.exp(-3)});
assert.equal(low.inRange,false);assert.equal(low.survival,null);
const high=M.calculate({...base,site:'visceral',ecog:2,ldh:true,albumin:1,hemoglobin:7,alp:Math.exp(8.5),psa:Math.exp(9)});
assert.equal(high.inRange,false);assert.equal(high.survival,null);
for(const a of Object.values(M.data.curves))for(let i=1;i<a.length;i++){assert.ok(a[i][0]>a[i-1][0]);assert.ok(a[i][1]<=a[i-1][1]);}
// Independent visual anchors from Figure 2 near total 180: 18m ~60%, 24m ~43%, 48m ~10%.
for(const [t,expected]of [[18,.60],[24,.43],[48,.10]])assert.ok(Math.abs(M.interpolate(M.data.curves[t],180)-expected)<.025);
console.log('PASS: Appendix score fixtures, validation, range rejection, monotonicity, visual survival anchors');
