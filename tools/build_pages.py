"""Build the English-only studio website. No third-party build dependencies.
Notice/support locale data remains intact for other consumers; the website uses English.
"""
from pathlib import Path
from html import escape as e
from urllib.parse import quote
import json
root = Path(__file__).resolve().parent.parent
brand = '<img src="/assets/studio-mark-v2.svg" width="44" height="44" alt=""><span class="brand-wordmark">ANSHIN<span>LABS</span></span>'

def link(text, url, style='button'):
    return f'<a class="{style}" href="{url}">{text}<span aria-hidden="true">↗</span></a>'

def header():
    return f'''<a class="skip" href="#main">Skip to content</a><div class="reading-progress" aria-hidden="true"></div><div class="header-shell"><header class="header wrap"><a class="brand" href="/" aria-label="ANSHIN LABS home">{brand}</a><nav aria-label="Main navigation"><a href="/#games">Our games</a><a href="/#studio">The studio</a><a href="/popora/notices/">News</a><a class="nav-support" href="/#support">Get in touch <span aria-hidden="true">↗</span></a></nav><button class="motion-toggle" type="button" aria-pressed="false" aria-label="Pause decorative motion"><span class="motion-bars" aria-hidden="true"><i></i><i></i><i></i></span><span class="motion-label">Motion on</span></button></header></div>'''

def footer():
    return f'''<footer class="footer wrap"><div><a class="brand" href="/">{brand}</a><p>Little friends. Big adventures.</p></div><div class="footer-links"><a href="/animal-rescue.html">Animal Rescue</a><a href="/popora/">POPORA</a><a href="/#support">Player support</a><a href="/popora/notices/">News &amp; notices</a></div><div class="copyright">© 2026 ANSHIN LABS<span>Made for a little more joy.</span></div></footer>'''

def save(path, title, body, description='Little friends. Big adventures. Discover Animal Rescue and POPORA: NOMO Legion from ANSHIN LABS.', scripts=''):
    canonical='' if path=='index.html' else path.replace('index.html','')
    html=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(title)} · ANSHIN LABS</title><meta name="description" content="{e(description)}"><meta name="theme-color" content="#102b26"><meta property="og:title" content="{e(title)} · ANSHIN LABS"><meta property="og:description" content="{e(description)}"><meta property="og:type" content="website"><meta property="og:image" content="https://anshin-labs.com/assets/popora-world.webp"><meta property="og:url" content="https://anshin-labs.com/{canonical}"><link rel="canonical" href="https://anshin-labs.com/{canonical}"><link rel="icon" href="/assets/favicon-v2.svg" type="image/svg+xml"><link rel="icon" href="/assets/favicon-v2-32.png" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="/assets/apple-touch-icon-v2.png" sizes="180x180"><link rel="stylesheet" href="/site.css"><link rel="stylesheet" href="/experience.css"><script defer src="/site.js"></script><script defer src="/experience.js"></script>{scripts}</head><body data-view="{'home' if path=='index.html' else 'inner'}">{header()}<main id="main">{body}</main>{footer()}</body></html>'''
    (root/path).write_text(html)

def art(name,alt,cls='',priority=False):
    dims=(672,1536) if name=='animal-world' else (1440,960) if name=='popora-world' else (1000,667)
    return f'<img class="{cls}" src="/assets/{name}.webp" width="{dims[0]}" height="{dims[1]}" alt="{e(alt)}" {"fetchpriority=high" if priority else "loading=lazy"}>'

def game_support(animal=False):
    prefix='/' if animal else '/popora/'
    contact='mailto:info@anshin-labs.com?subject=Animal%20Rescue%20Support' if animal else '/popora/support.html'
    return f'<div class="support-links"><a href="{contact}">Contact support ↗</a><a href="{prefix}privacy.html">Privacy policy</a><a href="{prefix}delete-account.html">Delete account</a></div>'

home=(root/'tools/home.html').read_text()
save('index.html','Little friends. Big adventures.',home)

features=[('legion','Your legion, your way.','Collect soldiers and heroes, merge your troops, and find a formation that feels like yours.'),('towers','Every tower counts.','Send your NOMOs, capture towers, and turn a small opening into a big advantage.'),('tribes','A world to share.','Join a tribe, build your influence, and take part in a shared seasonal adventure.')]
popora=f'''<section class="detail-intro wrap"><a class="back" href="/#games">← All games</a><p class="eyebrow">STRATEGY · COLLECTION · LITTLE HEROES</p><h1>Meet your next<br><em>little legion.</em></h1><div class="detail-sub"><p>POPORA: NOMO Legion<br>Collect. Merge. Make your move.</p><span class="pill">Coming to iOS &amp; Android</span></div><figure class="wide-art">{art('popora-world','NOMO armies in a colorful fantasy valley',priority=True)}<figcaption>Explore the world of POPORA · Game-world illustration</figcaption></figure></section><section class="wrap detail-features"><p class="eyebrow">SMALL HEROES. SO MANY POSSIBILITIES.</p><h2>A little magic.<br>A lot of strategy.</h2><div class="feature-grid">'''+''.join(f'<article>{art("popora-"+s,t)}<span class="feature-number">0{i+1}</span><h3>{t}</h3><p>{d}</p></article>' for i,(s,t,d) in enumerate(features))+f'''</div></section><section class="detail-callout wrap"><div><p class="eyebrow">STAY IN THE LOOP</p><h2>The next chapter starts here.</h2><p>Find game updates, service notices, and help for your adventure.</p></div>{link('News &amp; notices','/popora/notices/')}{game_support()}</section>'''
save('popora/index.html','POPORA: NOMO Legion',popora)

stores=link('Download on the App Store','https://apps.apple.com/app/id6759999423')+link('Get it on Google Play','https://play.google.com/store/apps/details?id=com.toruyoshida.ZooPuzzle','button outline')
animal=f'''<section class="animal-intro wrap"><div><a class="back" href="/#games">← All games</a><p class="eyebrow">HELP! ANIMAL RESCUE</p><h1>A little help.<br>A whole lot<br>of <em>heart.</em></h1><p class="lede">Solve puzzles. Rescue adorable animals.<br>Make yourself at home in a friendlier forest.</p><div class="store-links">{stores}</div></div><div class="animal-portrait">{art('animal-world','Friendly animals around a campfire in a sunset forest',priority=True)}<span class="image-note">YOUR FOREST FRIENDS ARE WAITING</span></div></section><section class="animal-points wrap"><article><span class="feature-number">01</span><h2>Pick up &amp; play.</h2><p>A gentle match puzzle game anyone can enjoy.</p></article><article><span class="feature-number">02</span><h2>Meet new friends.</h2><p>Save cute animals and enjoy their heartwarming story.</p></article><article><span class="feature-number">03</span><h2>Find your rhythm.</h2><p>Relaxing stages and exciting challenges are waiting for you.</p></article></section><section class="trailer-section wrap"><div class="section-heading"><div><p class="eyebrow">A PEEK INTO THE FOREST</p><h2>See the adventure.</h2></div><p>A little preview of the friends<br>you’ll meet along the way.</p></div><a class="video-preview" href="https://www.youtube.com/watch?v=itqfzraBHlI" target="_blank" rel="noopener noreferrer">{art('animal-world','Animal Rescue forest trailer')}<span class="play-icon" aria-hidden="true">▶</span><strong>Watch the Animal Rescue trailer <span aria-hidden="true">↗</span></strong></a></section><section class="detail-callout wrap"><p class="eyebrow">HERE TO HELP</p><h2>Every friend needs a helping hand.</h2>{game_support(True)}</section>'''
save('animal-rescue.html','Help! Animal Rescue',animal)

copy=json.loads((root/'popora/support-copy.json').read_text())['en']
def p(text):return '<p>'+e(text)+'</p>'
def h(text):return '<h2>'+e(text)+'</h2>'
email=link('info@anshin-labs.com','mailto:info@anshin-labs.com','text-link')
def legal(path,title,content,animal=False):
    prefix='/' if animal else '/popora/'
    game='Help! Animal Rescue' if animal else 'POPORA: NOMO Legion'
    gamepath='/animal-rescue.html' if animal else '/popora/'
    tabs=f'<a href="{gamepath}">Game overview</a>'
    if not animal:tabs+='<a href="/popora/support.html">Support</a>'
    for name,target in [('Privacy policy','privacy.html'),('Delete account','delete-account.html')]:
        tabs+=f'<a href="{prefix}{target}" {"aria-current=page" if path.endswith(target) else ""}>{name}</a>'
    save(path,title+' · '+game,f'<section class="legal-shell wrap"><p class="eyebrow">{game}</p><h1>{title}</h1><nav class="legal-tabs" aria-label="Game support">{tabs}</nav><div class="legal-content">{content}</div></section>')

for page,index in [('support',1),('privacy',3),('delete-account',2)]:
    mail='mailto:info@anshin-labs.com?subject='+quote('POPORA — '+copy[8 if page=='delete-account' else 1])
    if page=='support':content=h(copy[5])+p(copy[6])+link(copy[7],mail)+p('info@anshin-labs.com')+link(copy[22],'/popora/delete-account.html','text-link')
    elif page=='delete-account':content=h(copy[8])+p(copy[9])+p(copy[10])+link(copy[13],mail)+p('info@anshin-labs.com')+'<aside class="legal-notice">'+p(copy[11])+p(copy[12])+'</aside>'
    else:
        providers=[('Supabase','https://supabase.com/privacy'),('Apple','https://www.apple.com/legal/privacy/'),('Google','https://policies.google.com/privacy'),('Google AdMob','https://policies.google.com/technologies/partner-sites')]
        content=p(copy[23])+''.join(h(copy[i])+p(copy[i+1]) for i in [14,16,18,20])+link(copy[22],'/popora/delete-account.html','text-link')+email+'<ul>'+''.join(f'<li><a href="{u}">{n}</a></li>' for n,u in providers)+'</ul>'
    legal('popora/'+page+'.html',copy[index],content)

content=p('Help! Animal Rescue may process necessary information for service improvement and analytics.')+h('Information we collect')+p('This app may collect the following information.')+'<ul><li>Advertising ID, Android ID and other device identifiers</li><li>Usage and crash data</li><li>Ad impressions and ad interaction data</li></ul>'+p('This may fall under Google Play Data Safety declarations.')+h('Purpose of use')+'<ul><li>Service improvement</li><li>Bug fixing</li><li>Advertising</li><li>Analytics</li></ul>'+h('Third party services')+p('This app may use Google AdMob, Firebase Analytics and Firebase Crashlytics.')+h('Contact')+p('Please contact us at the email below.')+email
legal('privacy.html','Privacy policy',content,True)
content=p('You can request deletion of your account and related data for Help! Animal Rescue.')+h('App & developer information')+p('Developer: anshin-labs')+p('App: Help! Animal Rescue')+h('How to request deletion')+p('To request deletion of your account and related data, please follow the steps below.')+'<ol><li>Send an account deletion request email to the address below.</li><li>Include the email address or user ID used for registration in the email body.</li><li>After identity verification, your account and related data will be deleted.</li></ol>'+link('Request account deletion','mailto:info@anshin-labs.com?subject=Animal%20Rescue%20Account%20Deletion%20Request')+p('info@anshin-labs.com')+h('Data that will be deleted')+'<ul><li>Account information</li><li>Email address</li><li>User ID</li><li>Game progress / saved data</li><li>Data related to app usage</li></ul>'+h('Data that may be retained')+p('Some data may be retained for a necessary period for legal compliance, fraud prevention, payment records, or security purposes. The retention period is up to 90 days.')+h('Partial data deletion')+p('If you want to delete only part of your data without deleting your entire account, please contact us at the same email address.')+'<aside class="legal-notice">'+p('After account deletion, game data or some features may not be restored.')+'</aside>'
legal('delete-account.html','Delete account',content,True)

save('popora/notices/index.html','News & notices · POPORA','''<section class="notices-shell wrap"><a class="back" href="/popora/">← Explore POPORA</a><p class="eyebrow">FROM THE WORLD OF POPORA</p><h1>News &amp; <em>notices.</em></h1><p class="lede">The latest updates and a little look ahead.</p><a id="all-notices" class="text-link" href="/popora/notices/" hidden>← All notices</a><div id="notices" aria-live="polite"><p class="notice-state">Loading the latest notices…</p></div></section>''',scripts='<script defer src="/popora/notices/notice.js"></script>')
print('Built 9 English-only pages; preserved multilingual source data and public notice feeds.')
