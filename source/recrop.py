import numpy as np, json
from PIL import Image, ImageFilter
from scipy import ndimage
OUT='site/public/assets'
man=json.load(open('manifest.json'))
def save(im,name,maxw,q=86):
    if im.width>maxw: im=im.resize((maxw,round(im.height*maxw/im.width)),Image.LANCZOS)
    im.save(f'{OUT}/{name}.webp','WEBP',quality=q,method=6)
    man[name]={'w':im.width,'h':im.height}; return im

# ---- social phones: full device with transparent background
pages={45:'kopii',46:'memories',47:'safanova',48:'ghams',49:'bits-arabia',50:'careinn'}
for p,slug in pages.items():
    im=Image.open(f'full/p{p:02d}.jpg').convert('RGB'); a=np.asarray(im).astype(int)
    x0,y0,x1,y1=200,350,1650,2850
    sub=a[y0:y1,x0:x1]; L=sub.mean(2)
    dark=L<70
    dark=ndimage.binary_opening(dark,iterations=2)
    lab,n=ndimage.label(dark)
    sizes=ndimage.sum(dark,lab,range(1,n+1)); k=int(np.argmax(sizes))+1
    ys,xs=np.where(lab==k)
    bx=(x0+xs.min(),y0+ys.min(),x0+xs.max()+1,y0+ys.max()+1)
    pad=int((bx[2]-bx[0])*0.04)
    c=im.crop((bx[0]-pad,bx[1]-pad,bx[2]+pad,bx[3]+pad))
    ca=np.asarray(c).astype(int); Lc=ca.mean(2); S=ca.max(2)-ca.min(2)
    bgcand=(Lc>200)&(S<14)
    lab2,_=ndimage.label(bgcand)
    border=set(np.unique(np.concatenate([lab2[0],lab2[-1],lab2[:,0],lab2[:,-1]])))-{0}
    bg=np.isin(lab2,list(border))
    alpha=np.where(bg,0,255).astype(np.uint8)
    alpha=np.asarray(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(1.2)))
    rgba=np.dstack([ca.astype(np.uint8),alpha])
    out=Image.fromarray(rgba,'RGBA')
    save(out,f'sm/{slug}/phone',maxw=720,q=88)
    print(slug,bx,out.size)

# ---- UI hero compositions: the full panel + the phones that overflow it, with air
for p,slug in [(25,'fully-charged'),(28,'trackulizer')]:
    im=Image.open(f'full/p{p:02d}.jpg').convert('RGB'); W,H=im.size
    c=im.crop((int(0.382*W),int(0.158*H),int(0.948*W),int(0.918*H)))
    save(c,f'ui/{slug}/hero',maxw=1800,q=86)
    print(slug,c.size)
json.dump(man,open('manifest.json','w'),indent=1)
