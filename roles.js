// Role grouping shared by Search and the Index. Raw role labels in the database are messy
// (hundreds of variants); roleGroups() sorts each label into the groups below.
// Groups: artist, composer, lyricist, arranger, choir, soloist, producer, conductor, musicians, hidden.
const PREPASS={
'yiddish nachas kids':['choir',1],'פרחי קעמפ שלוה':['choir',1],
'vocal edit':['hidden',0],'vocal_coach':['hidden',0],'organizer':['hidden',0],'post_production':['hidden',0],
'project and creative director':['producer',0],'songwriter':['composer,lyricist',0],
'strings ensemble':['musicians',0],
'musician - guitar overdubs by':['musicians',0],'musician - flute, sax & clarinet overdubs by':['musicians',0],
'acoustic guitars and overdubs':['musicians',0],'פסנתר, קלידים, אקורדיון, תכנותים, מיקסים ועריכות':['musicians',0],
'originally recorded by':['hidden',0],'original_performance':['hidden',0],'original_recording':['hidden',0],
'first performer (ביצוע ראשון)':['hidden',0],'original performer (prose)':['hidden',0],
'traditional (עממי)':['hidden',0],'traditional (ניגון עתיק)':['hidden',0],
'court / tradition (printed: חצר הקודש פינסק קארלין)':['hidden',0],'melody source':['hidden',0],
'melody owner (בעל מנגון)':['hidden',0],'brought by (הובא ע"י)':['hidden',0],
'adapter / presenter (הובא ושודר ע"י)':['hidden',0],'inspired by':['hidden',0],'inspired_by':['hidden',0],
'presenter':['hidden',0],'presented by':['hidden',0],'presents':['hidden',0],
'מגיש (presenter)':['hidden',0],'מציגים (presented by)':['hidden',0],'מציגים (presented by - logo)':['hidden',0],
'presenter (מציג)':['hidden',0],'מוגש ע"י (presented by)':['hidden',0],'מגישה (presented by)':['hidden',0],
'sponsor':['hidden',0],'חסות (sponsored by)':['hidden',0],'promotion':['hidden',0],'series_line':['hidden',0],
'pr':['hidden',0],'record_company':['hidden',0],'legal_counsel':['hidden',0],
'academic_committee_member':['hidden',0],'academic_committee_chair':['hidden',0],
'cinematographer':['hidden',0],'props_and_scenery':['hidden',0],'lighting':['hidden',0],'safrus':['hidden',0],
'concept':['hidden',0],'song concept':['hidden',0],'idea and concept':['hidden',0],
'recorded_at':['hidden',0],'recorded':['hidden',0],'master':['hidden',0],'engeneers':['hidden',0],
'עזרה בהקלטות':['hidden',0],'music_preparation':['hidden',0],
'coordinator':['hidden',0],'sessions_coordination_israel':['hidden',0],'executive_administrator':['hidden',0],
'song_selection_assistance':['hidden',0],'עזרה מוזיקלית לאורך כל העבודה':['hidden',0],
'musical supervisor':['hidden',1],'directed & scriptwriting by':['hidden',1],
'performances by':['soloist',1],'musical performance':['musicians',1],
'kumzitz with':['soloist',1],'adult_feature':['soloist',1],'special_harmonies':['choir',1],
'group':['choir',1],
'programmed by':['musicians',0],'fender_rhodes':['musicians',0],'pads':['musicians',1],
'effects':['musicians',1],'computer':['musicians',1],'cuatro':['musicians',0],
'mellophone':['musicians',0],'accoustic pathos':['musicians',1],
'script_and_songs_writer':['lyricist,composer',1],'lyric_assistance':['lyricist',1],
'ozreini keil chai poem penned by':['lyricist',0],'by (מאת)':['composer',1],
'מוזיקה (music)':['composer',0],'background music':['composer',1],'background_music':['composer',1],
'direction':['conductor',1],
'עריכה':['hidden',0],'travel':['hidden',0],'digital_edits':['hidden',0],
'israeli_pr':['hidden',0],'shatkins':['hidden',1],
'help_with_text':['lyricist',1],'nikkud':['hidden',0],
};
function roleGroups(role){
  const s=String(role||'').trim(), full=s.toLowerCase();
  if(PREPASS[full]){const v=PREPASS[full];return [new Set(v[0].split(',')),!!v[1]]}
  let base=full.split('(')[0].trim(); if(!base)base=full;
  if(PREPASS[base]){const v=PREPASS[base];return [new Set(v[0].split(',')),!!v[1]]}
  const ls=base; // user rule: classify by the role BEFORE the parenthesis
  const g=new Set(); let unsure=false;
  const has=(...subs)=>subs.some(x=>ls.includes(x));
  const hasFull=(...subs)=>subs.some(x=>full.includes(x));
  if(hasFull('attribut','heard from','tradition','traditional','originally recorded','original performer','original_performance','original_recording','first performer','inspired by','tune source','lyrics source','text source','source citation','part ii lyrics','melody owner','בעל מנגון','brought by','הובא ע','lyrics (essay','lyrics (source','sources','מקורות','nigun')&&!hasFull('composer')&&!hasFull('composed'))
    return [new Set(['hidden']),!(full.includes('nigun')||full.includes('source')||full.includes('attribut'))];
  if(has('composer attribution','composition attribution','melody attribution'))return[new Set(['hidden']),false];
  if(has('unspecified','unlabeled','unlabelled','roster printed without header','role not stated','role not labeled')||ls==='credits'||ls==='other'||ls==='addition')
    return[new Set(['hidden']),false];
  if(has('engineer','mix','mastering','mastered','recorded','recording','studio','recordin','remaster','digitally mastered','sound','live_sound','playback','rerecord','re-engineered','remote recording','overdubs','הוקלט','אולפן','טכנאי','מאסטרינג','technician','technical','on_site')&&ls!=='recorder')
    return[new Set(['hidden']),false];
  if(has('engineer','mixing','mixer','mix_','mixed by','mastering','mastered','technician','technical','studio'))
    return[new Set(['hidden']),false];
  if(has('design','graphic','cover','jacket','booklet','artwork','art ','art,','logo','illustrat','painting','photo','image','layout','typesetting','typing','print','pressing','duplication','replication','manufactur','poster','makeup','עיצוב','גרפי','עטיפה','צילום','דואט')&&!has('duet','דואט (duet')){
    if(!(ls.includes('duet')||ls.includes('דואט')))return[new Set(['hidden']),false];
  }
  if(has('duet','דואט'))g.add('soloist');
  if(has('distribut','הפצה','label','copyright','rights_holder','®','©','publisher','מו"ל','מבית הוצאת','marketing','pr ','pr/','pr_','יח"צ','public_relations','social_media','booking','management','manager','administration','vice chairman','executive advisor','a&r','consultant','advisor','adviser','organization','project_manager','project steering','צוות היגוי','source research','ראיון ומקורות','contact','credits page','acknowledgment','dedication','support, coffee','extended family','artist signature','stage manager','travel_arrangements','online_distribution','physical_distribution','pressing','דל','ניהול'))
    return[new Set(['hidden']),false];
  if(has('translat','language_editor','עריכה לשונית','עריכת תוכן','content_editor','writing and editing','texts editing','editor','editing','song_editing','vocal_editing','vocal_editor','digital_editing','video','filmed','clip_credit','liner','essay','song descriptions','back cover','cover back','narrat','קריינות','voice over','speaker','spoken intro','master_of_ceremonies','typing'))
    return[new Set(['hidden']),false];
  if(has('copyist','notation','score'))return[new Set(['hidden']),false];
  if(has('composer','composed','composers_album_line','composer_album','opening_composer','music_by','music by','melody adapted','additional music','additional_music','theme by','theme (נושא)','song & theme','musical by','מוזיקאליש דורך','לחנים','written by','געשריבן ביי','songwriter','music (essay','music (printed')){
    g.add('composer'); if(has('written by','songwriter'))unsure=true;
  }
  if(ls==='music')g.add('composer');
  if(has('lyricist','text author','texts by','texts written','words','lyrics','author')){
    if(!hasFull('source','essay','citation')){
      g.add('lyricist');
      if(has('translat')||ls==='author'||ls.includes('texts written & translations')||ls.includes('texts written and translated'))unsure=true;
    }
  }
  if(has('arrang','עיבוד','orchestrat','adaptation','adapted','vocal_arrangements'))g.add('arranger');
  if(has('conductor','conducted','ניצוח','מנצח','directed by','led_by','vocal_conductor','director')&&!has('music_video_director','creator_director','technical_director','art director','producer_director','produced_directed_by','project'))g.add('conductor');
  if(has('producer_director','produced_directed_by','creator_director')){g.add('producer');g.add('conductor');unsure=true}
  if(has('director')&&!g.size&&!has('music_video','art director')){g.add('conductor');unsure=true}
  if(has('musical_director','music_director')){g.add('conductor');unsure=true}
  if(has('producer','production','הפקה','מפיק','executive producer','co_producer','associate_producer','writer_producer','musical producer','compiler','לקט מוזיקאליש','musical selection')){
    g.add('producer');
    if(has('writer_producer','technical_production','production_manager','production_company','production assistance','production coordinator','production_assistance','compiler','לקט'))unsure=true;
  }
  if(has('choir','chorus','מקהל','background vocals','background_vocals','backup_vocals','bg_vocals','group_harmonies','harmony'))g.add('choir');
  if(has('vocal_group','group_vocal','adult_vocal_group','ensemble','quartet','trio','zemiros group','chaverim','participant','משתתפים','group roster','group_member','group)','(the group)','cast_member')){g.add('choir');unsure=true}
  if(has('child participant','ולילדי החמד')){g.add('choir');unsure=true}
  if(has('drums','drum','bass','guitar','גיטר','keyboard','קליד','piano','פסנתר','violin','כינור','trumpet','חצוצר','percussion','כלי הקשה','sax','סקסופון','trombone','טרומבון','string','flute','חליל','clarinet','קלרינט','קלארינעט','cello','viola','brass','חצוצרות','בראס','woodwind','כלי נשיפה','horn','קרנות','synthesizer','סינטי','synth','programming','תכנות','instrument','orchestra','תזמורת','musician','music played','accompaniment','ליווי','accompanied','performance (ביצוע','harmonica','oud','saz','baglama','darbuka','mandolin','accordion','banjo','harp','organ','tuba','xylophone','recorder','melodica','zurna','kamantcha','kamancheh','tar','santur','bagpipes','irish_drums','bouzouki','oboe','fiddle','flugelhorn','piccolo','english horn','midi','samplers','looping','harmonizer','mx150','keys','בס','תופים','גיטרות','כינורות','טרומבונים','עוד','נאי','טאר','wind','rhythm','overdub','vocal drums','sequencing','concert master','concertmaster','acoustic pathos'))g.add('musicians');
  if(has('soloist','סולן','סאלא','סולו','vocalist','singer','vocals','vocal','שירה','געזונגען','זמר','ומזמר','משוררים','שר (','lead','featuring','featured','באירוח','guest','אורח','duet','דואט','child','ילד','אינגל','boy','solo','performer','performed by','ביצוע','בביצוע','מבצע','sung by','אמנים','artist','chazan','cantor','chazonus','special appearance','special cameo','ילדי הפלא','ילד הפלא','compiler_vocals','choir_member','opening / intro','intro','speaker')){
    g.add('soloist');
    if(has('artist','speaker','opening','intro','cast','performer named','program line','parenthetical','attribution line','compiler_vocals'))unsure=true;
  }
  if(/\bsolo\b/.test(ls))g.add('soloist');
  g.delete('hidden');
  if(!g.size)return[new Set(['hidden']),true];
  return[g,unsure];
}

const _roleCache=new Map();
function groupsOf(role){const k=String(role||'');if(!_roleCache.has(k))_roleCache.set(k,roleGroups(k)[0]);return _roleCache.get(k)}
function inGroup(role,group){return groupsOf(role).has(group)}
