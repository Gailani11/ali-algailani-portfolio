import numpy as np, json, os
from PIL import Image
from xycut import boxes as xyboxes
OUT='site/public/assets'
man={}
def I(p): return Image.open(f'full/p{p:02d}.jpg').convert('RGB')
def save(im,name,maxw=1600,q=80):
    path=f'{OUT}/{name}.webp'; os.makedirs(os.path.dirname(path),exist_ok=True)
    if im.width>maxw: im=im.resize((maxw,round(im.height*maxw/im.width)),Image.LANCZOS)
    im.save(path,'WEBP',quality=q,method=6)
    man[name]={'w':im.width,'h':im.height}
    return name
def inset(b,d): return (b[0]+d,b[1]+d,b[2]-d,b[3]-d)
def frac(im,box):
    W,H=im.size; return im.crop((int(box[0]*W),int(box[1]*H),int(box[2]*W),int(box[3]*H)))
def tight(im, box, thr=22, pad=0.18, bgcol=None, square=False):
    c=im.crop(box); a=np.asarray(c).astype(int)
    bg=np.array(bgcol if bgcol else a[3,3])
    m=np.abs(a-bg).max(2)>thr
    ys,xs=np.where(m)
    x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max()
    w,h=x1-x0,y1-y0
    if square:
        s=int(max(w,h)*(1+pad*2)); cx=(x0+x1)//2+box[0]; cy=(y0+y1)//2+box[1]
        W=int(max(w*(1+pad*2), s*1.0)); H=s
    else:
        W=int(w*(1+pad*2)); H=int(h*(1+pad*2)); cx=(x0+x1)//2+box[0]; cy=(y0+y1)//2+box[1]
    canvas=Image.new('RGB',(W,H),tuple(int(v) for v in bg))
    src=im.crop((cx-W//2,cy-H//2,cx-W//2+W,cy-H//2+H))
    return src, tuple(int(v) for v in bg)

# ---- 1. Logos grid p06
im=I(6)
cols=[(300,1100),(1150,2050),(2100,2900)]; rows=[(560,900),(980,1360),(1420,1780)]
names=[['afak','al-omari','scc'],['gift-zone','mr-group','learn-mys'],['villa-puteri','trackulizer','shams-store']]
for r,(y0,y1) in enumerate(rows):
    for c,(x0,x1) in enumerate(cols):
        a=np.asarray(im.crop((x0,y0,x1,y1))).astype(int)
        m=(255-a).max(2)>25; ys,xs=np.where(m)
        bx=(x0+xs.min(),y0+ys.min(),x0+xs.max(),y0+ys.max())
        w=bx[2]-bx[0]; h=bx[3]-bx[1]; S=int(max(w,h*1.6)*1.25); H=int(S/1.6)
        cx=(bx[0]+bx[2])//2; cy=(bx[1]+bx[3])//2
        save(im.crop((cx-S//2,cy-H//2,cx-S//2+S,cy-H//2+H)),f'logos/{names[r][c]}',maxw=900,q=88)

# ---- 2. Identities
ids=['gift-zone','al-omari','learn-mys','mr-group','villa-puteri','shams-store','scc','afak']
cards={}
for i,slug in enumerate(ids):
    p=8+2*i; im=I(p); W,H=im.size
    # logo card
    region=(int(0.53*W),int(0.29*H),int(0.87*W),int(0.66*H))
    bg=np.asarray(im.crop((region[0],region[1],region[0]+8,region[1]+8))).reshape(-1,3).mean(0)
    a=np.asarray(im.crop(region)).astype(int)
    m=np.abs(a-bg).max(2)>30; ys,xs=np.where(m)
    bx=(region[0]+xs.min(),region[1]+ys.min(),region[0]+xs.max(),region[1]+ys.max())
    w=bx[2]-bx[0]; h=bx[3]-bx[1]; S=int(max(w*1.45,h*1.5*1.25)); Hh=int(S/1.25)
    cx=(bx[0]+bx[2])//2; cy=(bx[1]+bx[3])//2
    card=Image.new('RGB',(S,Hh),tuple(int(v) for v in bg))
    src=im.crop((max(cx-S//2,region[0]-60),max(cy-Hh//2,region[1]-40),min(cx+S//2,region[2]+60),min(cy+Hh//2,region[3]+40)))
    # paste logo tight crop centered on bg canvas (avoid card edges)
    tight_logo=im.crop((bx[0]-10,bx[1]-10,bx[2]+10,bx[3]+10))
    card.paste(tight_logo,((S-tight_logo.width)//2,(Hh-tight_logo.height)//2))
    save(card,f'id/{slug}/mark',maxw=1400,q=90)
    cards[slug]='#%02x%02x%02x'%tuple(int(v) for v in bg)
    # tiles
    im2=I(p+1)
    if p+1==21:
        bl=[(200,352,1586,1081),(1612,352,2300,1081),(2318,352,3000,1081),(200,1107,880,1832),(906,1107,1586,1832),(1612,1107,2300,1832),(2318,1107,3000,1832)]
    else:
        bl=[tuple(int(v) for v in b) for b in xyboxes(p+1)]
    for k,b in enumerate(bl):
        save(im2.crop(inset(b,6)),f'id/{slug}/{k+1:02d}',maxw=1500,q=80)
    man[f'id/{slug}/_tiles']=[f'id/{slug}/{k+1:02d}' for k in range(len(bl))]
man['_cardbg']=cards

# ---- 3. UI
for slug,hero,pages in [('fully-charged',25,(26,27)),('trackulizer',28,(29,30))]:
    im=I(hero); save(frac(im,(0.395,0.17,0.945,0.855)),f'ui/{slug}/hero',maxw=1760,q=85)
    n=0
    for p in pages:
        im=I(p); a=np.asarray(im).astype(int)
        for x0 in (178,666,1154,1642,2130,2618):
            col=a[470:1440,x0:x0+404]; m=(255-col).max(2)>6
            rowsnz=np.where(m.any(1))[0]
            y0=470+rowsnz.min(); y1=470+rowsnz.max()
            n+=1; save(im.crop((x0,y0,x0+404,y1)),f'ui/{slug}/s{n:02d}',maxw=404,q=90)

# ---- 4. Company profiles
cps=['bits-arabia','bits-wellness','bits-hospitality','smart-channels','careinn','nahr']
for i,slug in enumerate(cps):
    im=I(32+i)
    save(frac(im,(0.39,0.14,0.975,0.72)),f'cp/{slug}/hero',maxw=1900,q=84)
    save(frac(im,(0.058,0.795,0.942,0.885)),f'cp/{slug}/strip',maxw=4400,q=84)

# ---- 5. Print
im=I(39); save(frac(im,(0.13,0.17,0.87,0.6)),'pr/abusloum/hero',maxw=1900,q=84); save(frac(im,(0.058,0.66,0.942,0.86)),'pr/abusloum/strip',maxw=4400,q=82)
im=I(40); save(frac(im,(0.2,0.155,0.78,0.63)),'pr/careinn/hero',maxw=1900,q=84); save(frac(im,(0.058,0.66,0.942,0.82)),'pr/careinn/strip',maxw=4400,q=82)
im=I(41)
for k,b in enumerate([(299,504,2881,2701),(2939,509,3699,1584),(3736,504,4504,1586),(2938,1625,3700,2701),(3741,1625,4502,2701)]):
    save(im.crop(inset(b,6)),f'pr/amals-kitchen/{k+1:02d}',maxw=1900 if k==0 else 900,q=84)
im=I(42)
for k,b in enumerate([(298,506,3728,2702),(3784,510,4501,1586),(3784,1626,4501,2700)]):
    save(im.crop(inset(b,6)),f'pr/ghams/{k+1:02d}',maxw=1900 if k==0 else 900,q=84)
im=I(43)
save(frac(im,(0.0625,0.17,0.9375,0.525)),'pr/kopii/01',maxw=2000,q=84)
save(frac(im,(0.0625,0.545,0.9375,0.9)),'pr/kopii/02',maxw=2000,q=84)

# ---- 6. Social
sm={45:('kopii',[(403,666,1422,2576),(1564,707,2470,1608),(2528,707,3432,1608),(3496,707,4399,1610),(1564,1673,2470,2576),(2528,1673,3432,2575),(3496,1673,4399,2576)]),
46:('memories',[(403,666,1422,2576),(1560,704,3434,2576),(3496,707,4400,1609),(3496,1673,4400,2576)]),
47:('safanova',[(403,666,1422,2576),(1560,705,3433,2576),(3496,704,4400,1611),(3496,1673,4400,2576)]),
48:('ghams',[(403,666,1422,2576),(1562,707,3432,2576),(3496,707,4400,1608),(3496,1673,4400,2576)]),
49:('bits-arabia',[(403,935,1422,2336)]+[(x0,y0,x1,y1) for (y0,y1) in [(949,1608),(1672,2336)] for (x0,x1) in [(1565,2225),(2288,2949),(3008,3680),(3736,4399)]]),
50:('careinn',[(403,666,1422,2576)]+[(x0,y0,x1,y1) for (y0,y1) in [(707,1610),(1672,2576)] for (x0,x1) in [(1562,2470),(2530,3434),(3496,4400)]])}
for p,(slug,bl) in sm.items():
    im=I(p)
    for k,b in enumerate(bl):
        name='phone' if k==0 else f'{k:02d}'
        save(im.crop(b if k==0 else inset(b,5)),f'sm/{slug}/{name}',maxw=1100 if k else 700,q=82)

# ---- QR
im=I(51); W,H=im.size
reg=(int(0.03*W),int(0.65*H),int(0.18*W),int(0.9*H)); a=np.asarray(im.crop(reg)).astype(int)
m=a.min(2)>200; ys,xs=np.where(m)
save(im.crop((reg[0]+xs.min(),reg[1]+ys.min(),reg[0]+xs.max()+1,reg[1]+ys.max()+1)),'misc/qr',maxw=600,q=95)
json.dump(man,open('manifest.json','w'),indent=1)
print(len([k for k in man if not k.startswith('_') and not k.endswith('_tiles')]))
