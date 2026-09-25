import numpy as np, sys
from PIL import Image, ImageDraw
def runs(v, thr, minw):
    out=[];s=None
    for i,x in enumerate(v):
        if x>=thr and s is None: s=i
        if x<thr and s is not None:
            if i-s>=minw: out.append((s,i))
            s=None
    if s is not None and len(v)-s>=minw: out.append((s,len(v)))
    return out
def cut(white, x0,y0,x1,y1, depth=0, minw=12, thr=0.97, minsize=120):
    sub=white[y0:y1,x0:x1]
    if sub.size==0: return []
    # trim
    rows=sub.mean(1); cols=sub.mean(0)
    nr=np.where(rows<thr)[0]; nc=np.where(cols<thr)[0]
    if len(nr)==0 or len(nc)==0: return []
    y0,y1=y0+nr[0],y0+nr[-1]+1; x0,x1=x0+nc[0],x0+nc[-1]+1
    sub=white[y0:y1,x0:x1]
    if (x1-x0)<minsize or (y1-y0)<minsize: return []
    for axis in (0,1):
        prof=sub.mean(1) if axis==0 else sub.mean(0)
        gaps=runs(prof,thr,minw)
        if gaps:
            res=[];start=0
            for g in gaps+[(len(prof),len(prof))]:
                if axis==0: res+=cut(white,x0,y0+start,x1,y0+g[0],depth+1,minw,thr,minsize)
                else: res+=cut(white,x0+start,y0,x0+g[0],y1,depth+1,minw,thr,minsize)
                start=g[1]
            return res
    return [(x0,y0,x1,y1)]
def boxes(p, region=(0.04,0.15,0.96,0.925), lvl=205, minw=8, thr=0.95, minsize=120):
    im=Image.open(f'full/p{p:02d}.jpg').convert('RGB'); W,H=im.size
    a=np.asarray(im).astype(int)
    L=a.mean(2); S=a.max(2)-a.min(2)
    white=((L>=lvl)&(S<8)).astype(float)
    x0,y0,x1,y1=[int(v) for v in (region[0]*W,region[1]*H,region[2]*W,region[3]*H)]
    return cut(white,x0,y0,x1,y1,minw=minw,thr=thr,minsize=minsize)
if __name__=='__main__':
    for p in map(int,sys.argv[1:]):
        b=boxes(p)
        im=Image.open(f'full/p{p:02d}.jpg'); d=ImageDraw.Draw(im)
        for i,bb in enumerate(b): d.rectangle(bb,outline='red',width=8); d.text((bb[0]+10,bb[1]+10),str(i),fill='red')
        im.resize((1200,int(1200*im.height/im.width))).save(f'crops/seg{p}.jpg')
        print(p,len(b),b)
