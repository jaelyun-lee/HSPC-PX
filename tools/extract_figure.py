"""Reproduce Figure 2 curve extraction: python tools/extract_figure.py supplied.pdf"""
import json,sys
from pathlib import Path
import fitz
p=fitz.open(sys.argv[1])[4]
segments=[]
for d in p.get_drawings():
 c=d['color']
 if c and c[0]<.1 and c[1]>.4 and c[2]>.7:
  for i in d['items']:
   if i[0]=='l' and i[1].y>335 and i[1].x<360 and i[2].x-i[1].x>5 and i[2].y>i[1].y:segments.append(i)
assert len(segments)==100, 'Unexpected PDF geometry; do not use with a different edition.'
# Axis Y: published ticks at 1,.8,.6,.4,.2. Linear least-squares calibration.
s=[1,.8,.6,.4,.2]; y=[307.289,338.918,370.547,402.100,433.727]
m=sum(s)/5; n=sum(y)/5
b=sum((a-m)*(c-n)for a,c in zip(s,y))/sum((a-m)**2 for a in s); intercept=n-b*m
curves={}
for k,t in enumerate([18,24,30,36,48]):
 pts=[]
 for segment in segments[k*20:(k+1)*20]:
  for a in segment[1:]:pts.append([round(60+(a.x-91.273)*300/(337.189-91.273),6),round((a.y-intercept)/b,8)])
 curves[str(t)]=sorted(pts)
data={'version':'figure2-vector-approx-v1','source':'Halabi et al. JCO 2014;32:671-677. DOI 10.1200/JCO.2013.52.3696; Figure 2, supplied PDF page 5','method':'Vector line endpoints; linear interpolation within each published curve; no extrapolation; probabilities rounded to whole percent in UI','curves':curves}
output=Path(__file__).resolve().parents[1]/'app/src/main/assets/model-data.js'
output.write_text('const MODEL_DATA = '+json.dumps(data,indent=2)+';\nif (typeof module !== "undefined") module.exports = MODEL_DATA;\n')
print(output)
