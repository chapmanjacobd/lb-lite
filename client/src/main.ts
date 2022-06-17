

import Alpine from 'alpinejs';
<<<<<<< HEAD
import Dexie, { Collection } from "dexie";
import { exportDB, importDB, peekImportFile } from "dexie-export-import";
import { ExportProgress } from 'dexie-export-import/dist/export';
import { importInto, ImportProgress } from 'dexie-export-import/dist/import';
=======
>>>>>>> origin/main
import 'material-icons/iconfont/outlined.css';
import { vimeo, youtube } from './players';
import { createStore } from './schema';
import './style.css';
import { fullstory } from './tracking';
import { Entree, Playlist } from './types';
<<<<<<< HEAD
import { downloadBlob, html, onomonopia, randimal, randomPASTEL, secondsToFriendlyTime, shuffle } from './utils';


=======
import { downloadObjectAsJson, fileToJSON, html, onomonopia, randimal, randomPASTEL, secondsToFriendlyTime, shuffle } from './utils';

>>>>>>> origin/main
const devMode = window.location.hostname == 'localhost';

function changeTheBackgroundColor() {
  window.htmlroot.style.background = randomPASTEL((Math.random() + 1).toString(36).substring(7))
}
changeTheBackgroundColor()

if (devMode) {
  import.meta.hot
}

let API_domain = "https://unli.xyz/api/yt/v1";
if (devMode) API_domain = "http://127.0.0.1:8000/v1";

window.Dexie = Dexie
window.Alpine = Alpine

Alpine.store('playlists', [])
Alpine.store('entries', [])
Alpine.store('sett', {
  hideWatched: true,
  entriesOrderBy: 'random()',
  entriesLimit: '', compact: true, selectedVideo: {},
  automark: true, autoplay: false, wadsworth: false, shuffleMode: "",
  selectedDB: 'RuntimeDB', search: ''
})

const EXP_SPLITTER = /[\s\-\,]+/;
window.app = {
  log: function (txt: string) {
    if (window.log.value.split('\n').slice(-2)[0] == txt) return;
    window.eventLog.open = true
    window.log.value += txt + "\n"
    window.log.scrollTop = window.log.scrollHeight;
  },
  randomPASTEL, changeTheBackgroundColor, secondsToFriendlyTime,
<<<<<<< HEAD
  refreshView: async function () {
    let constraints: string[] = []
=======
  refreshView: function () {
    let constraints: string[] = []
    const search = Alpine.store('sett').search.toLowerCase().replace(' ', '%')

    if (Alpine.store('sett').hideWatched) constraints.push('entries.id not in (select distinct id from watched)')
    if (search != '') {
      constraints.push(`entries.title like "%${search}%"`)
    }
>>>>>>> origin/main

    const db = window.dbs[Alpine.store('sett').selectedDB]
    await db.transaction("rw", db.table('playlists'), db.table('entries'), db.table('watched'), async () => {
      let watched = await db.table('watched').toArray()
      let pre_unioned_conditions = []
      if (Alpine.store('sett').hideWatched)
        pre_unioned_conditions.push(db.table('entries').where('[id+ie_key]').noneOf(watched))

      if (Alpine.store('sett').search.length > 1) {
        const search_prefixes = Alpine.store('sett').search.toLowerCase().split(EXP_SPLITTER)

        pre_unioned_conditions.push(
          distinct(await Promise.all(
            search_prefixes.map((prefix: string) => db.table('entries').where('tokens').startsWith(prefix))
          ))
        );
      }



    });



    const entriesOrderBy = ' order by ' + Alpine.store('sett').entriesOrderBy

    let entriesSQL = `select entries.*
        , watched.id IS NOT NULL as watched
      from entries
      outer join watched on watched.id = entries.id and watched.ie_key = entries.ie_key
      ${entriesWhere}
      ${entriesOrderBy}
    `
    // const groupLimit = Alpine.store('sett').entriesLimit
    // if (groupLimit != '') {
    //   const perPlaylistSQL = alasql(`select value from playlists`).map((pl: Playlist) => {
    //     const perPlaylistConstraints = [...constraints, `entries.original_url = "${pl.original_url}"`]
    //     const entriesWhere = perPlaylistConstraints.length > 0 ? 'where ' + perPlaylistConstraints.join(' and ') : ''
    //     const entriesOrderBy = ' order by ' + Alpine.store('sett').entriesOrderBy
<<<<<<< HEAD

    //     return `select entries.*
    //     , watched.id IS NOT NULL as watched
    //   from entries
    //   outer join watched on watched.id = entries.id and watched.ie_key = entries.ie_key
    //   join playlists on playlists.original_url = entries.original_url
    //   ${entriesWhere}
    //   ${entriesOrderBy} LIMIT ${groupLimit}`
    //   })
    //   entriesSQL = perPlaylistSQL.join(' UNION ALL ')
    //   console.log(entriesSQL);
    // }


=======

    //     return `select entries.*
    //     , watched.id IS NOT NULL as watched
    //   from entries
    //   outer join watched on watched.id = entries.id and watched.ie_key = entries.ie_key
    //   join playlists on playlists.original_url = entries.original_url
    //   ${entriesWhere}
    //   ${entriesOrderBy} LIMIT ${groupLimit}`
    //   })
    //   entriesSQL = perPlaylistSQL.join(' UNION ALL ')
    //   console.log(entriesSQL);
    // }
>>>>>>> origin/main

    const playlistWhere = constraints.length > 0 ? 'where ' + constraints.join(' and ') : ''

    let playlistsSQL = `select playlists.*, sum(entries.duration) duration from playlists
      join entries on entries.original_url = playlists.original_url
      ${playlistWhere}
      group by playlists.original_url
    `
    // console.log(playlistsSQL);

    let entries = alasql(entriesSQL)

    if (entries.length == 0 && search !== '')
      entries = [{ title: `"${search}" did not match anything in the database` }]

    Alpine.store('playlists', alasql(playlistsSQL)) // thanks @stackoverflow:Dauros
    Alpine.store('entries', entries)

    function distinct(array: any) {
      return [...new Map(array.flatmap((item: { [x: string]: any; }) => [item['id'], item])).values()];
    }
  },
  fetchPlaylist: async function (playlist: string) {
    function cleanup() {
      window.addNewInput.disabled = false
      window.addNewInputSubmit.textContent = 'Submit'
      window.addNewInputSubmit.disabled = false
      app.refreshView()
    }
    async function mapTable(collection: Collection, mapperFn: (arg: any) => any) {
      var result: any[] = [];
      await collection.each((row) => result.push(mapperFn(row)));
      return result;
    }

    function tokenizer(array: Entree[] | Playlist[]) {
      return array.map(obj => ({
        ...obj, tokens: obj.title.toLowerCase().split(EXP_SPLITTER)
      }))
    }

    if (playlist.length < 5) return;
    app.log(`Getting data from ${playlist}`)

    const data = await fetch(`${API_domain}?playlist=` + playlist)
      .then(response => response.json())
      .then((data: Playlist) => {
        data.duration = data.entries!.reduce((p, x) => p + x.duration, 0)
        return data
      }).catch((err) => {
        app.log(`Could not load ${playlist}`);
        cleanup()
        throw err
      })

    app.log(`Got ${data.entries!.length} videos from playlist "${data.title}"`)
    const db = window.dbs[Alpine.store('sett').selectedDB]
    await db.transaction("rw", db.table('entries'), db.table('watched'), async () => {

      // await db.entries.where('original_url').equals(data.original_url).delete() //data.entries![0].original_url ?
      await db.table('entries').bulkPut(tokenizer(data.entries!));

      // https://github.com/raphinesse/dexie-batch
      var r = db.table('entries').where('title').anyOf(["[Deleted video]", "[Private video]"]);
      const unwatchable = await mapTable(r, (o: Entree) => ({ id: o.id, ie_key: o.ie_key }))
      await db.table('watched').bulkPut(unwatchable);

      delete data.entries
      await db.table('playlists').put(tokenizer([data])[0]);
    });

    cleanup()
  },
  timeshift: function (videos: Entree[]): Entree[] {
    if (videos[0].start) return videos;

    const is_wadsworth = Alpine.store('sett').wadsworth
    const is_shuffle = Alpine.store('sett').shuffleMode > 0

    return videos.map(v => {
      let start = 0
      let end = v.duration

      if (is_wadsworth) start = Math.round(end * 0.3)
      if (is_shuffle) end = start + Number(Alpine.store('sett').shuffleMode)

      const newDuration = end - start
      return { ...v, duration: newDuration, start, end }
    })
  },
  playVideo: function (v: Entree) {
    app.markWatched(v)
    Alpine.store('sett').selectedVideo = app.timeshift([v])[0]
    Alpine.nextTick(() => { app.refreshView() })
  },
  automaticPlay: function () {
    const timer = (s: number) => new Promise(res => setTimeout(res, s * 1000))

    async function run() {
      const videos = app.timeshift(Alpine.store('entries'))

      for (let v of videos) {
        const oldCount = videos.length
        if (Alpine.store('sett').autoplay) {

          if (v.duration && v.duration > 1) {
            app.playVideo(v)
            await timer(v.duration)
          }

          const newCount = Alpine.store('entries').length
          if (newCount > oldCount) {
            run()
            break;
          }

        }
      }
    }

    app.log('Starting autoplay')
    run();
  },
  stopAutomaticPlay: function () {
    app.log('Stopping autoplay')
    Alpine.store('sett').autoplay = false
  },
  playRandom: function () {
    if (Alpine.store('sett').autoplay)
      app.stopAutomaticPlay();
    const v = shuffle(Alpine.store('entries'))
    app.playVideo(v)
  },
  fetchPlaylist: async function (playlist: string) {
    function cleanup() {
      window.addNewInput.disabled = false
      window.addNewInputSubmit.textContent = 'Submit'
      window.addNewInputSubmit.disabled = false
      app.refreshView()
    }

    if (playlist.length < 5) return;

    app.log(`Getting data from ${playlist}`)

    const data = await fetch(`${API_domain}?playlist=` + playlist)
      .then(response => response.json())
      .then((data: Playlist) => {
        return data
      }).catch((err) => {
        app.log(`Could not load ${playlist}`);
        cleanup()
        throw err
      })

    // data.duration = data.entries!.reduce((p, x) => p + x.duration, 0)

    app.log(`Got ${data.entries!.length} videos from playlist "${data.title}"`)

    if ((alasql('select value count(*) from entries')) > 0)
      alasql('DELETE from entries where original_url = ?', data.entries![0].original_url)

    alasql('INSERT INTO entries SELECT * FROM ?', [data.entries]);

    alasql(`SELECT ie_key, id INTO watched from entries
          where title in (select _ from ?)`, [["[Deleted video]", "[Private video]"]]
    )

    delete data.entries
    alasql('DELETE from playlists where webpage_url = ?', data.webpage_url)
    alasql('INSERT INTO playlists SELECT * FROM ?', [[data]])

    app.cleanUpDuplicates('watched')

    try {
      alasql('create index entries_id_idx on entries (id)')
      alasql('create index entries_iekey_id_idx on entries (ie_key,id)')
      alasql('create index entries_title_idx on entries (title)')

    } catch (error) {
      console.log(error);
    }

    cleanup()
  },
  timeshift: function (videos: Entree[]): Entree[] {
    if (videos[0].start) return videos;

    const is_wadsworth = Alpine.store('sett').wadsworth
    const is_shuffle = Alpine.store('sett').shuffleMode > 0

    return videos.map(v => {
      let start = 0
      let end = v.duration

      if (is_wadsworth) start = Math.round(end * 0.3)
      if (is_shuffle) end = start + Number(Alpine.store('sett').shuffleMode)

      const newDuration = end - start
      return { ...v, duration: newDuration, start, end }
    })
  },
  playVideo: function (v: Entree) {
    app.markVideoWatched(v)
    Alpine.store('sett').selectedVideo = app.timeshift([v])[0]
    Alpine.nextTick(() => { app.refreshView() })
  },
  automaticPlay: function () {
    const timer = (s: number) => new Promise(res => setTimeout(res, s * 1000))

    async function run() {
      const videos = app.timeshift(Alpine.store('entries'))

      for (let v of videos) {
        const oldCount = videos.length
        if (Alpine.store('sett').autoplay) {

          if (v.duration && v.duration > 1) {
            app.playVideo(v)
            await timer(v.duration)
          }

          const newCount = Alpine.store('entries').length
          if (newCount > oldCount) {
            run()
            break;
          }

        }
      }
    }

    app.log('Starting autoplay')
    run();
  },
  stopAutomaticPlay: function () {
    app.log('Stopping autoplay')
    Alpine.store('sett').autoplay = false
  },
  playRandom: function () {
    if (Alpine.store('sett').autoplay)
      app.stopAutomaticPlay();
    const v = shuffle(Alpine.store('entries'))
    app.playVideo(v)
  },
  fetchPlaylist: async function (playlist: string) {
    function cleanup() {
      window.addNewInput.disabled = false
      window.addNewInputSubmit.textContent = 'Submit'
      window.addNewInputSubmit.disabled = false
      app.refreshView()
    }

    if (playlist.length < 5) return;

    app.log(`Getting data from ${playlist}`)

    const data = await fetch(`${API_domain}?playlist=` + playlist)
      .then(response => response.json())
      .then((data: Playlist) => {
        return data
      }).catch((err) => {
        app.log(`Could not load ${playlist}`);
        cleanup()
        throw err
      })

    // data.duration = data.entries!.reduce((p, x) => p + x.duration, 0)

    app.log(`Got ${data.entries!.length} videos from playlist "${data.title}"`)

    if ((alasql('select value count(*) from entries')) > 0)
      alasql('DELETE from entries where original_url = ?', data.entries![0].original_url)

    alasql('INSERT INTO entries SELECT * FROM ?', [data.entries]);

    alasql(`SELECT ie_key, id INTO watched from entries
          where title in (select _ from ?)`, [["[Deleted video]", "[Private video]"]]
    )

    delete data.entries
    alasql('DELETE from playlists where webpage_url = ?', data.webpage_url)
    alasql('INSERT INTO playlists SELECT * FROM ?', [[data]])

    app.cleanUpDuplicates('watched')

    try {
      alasql('create index entries_id_idx on entries (id)')
      alasql('create index entries_iekey_id_idx on entries (ie_key,id)')
      alasql('create index entries_title_idx on entries (title)')

    } catch (error) {
      console.log(error);
    }

    cleanup()
  },
  timeshift: function (videos: Entree[]): Entree[] {
    if (videos[0].start) return videos;

    const is_wadsworth = Alpine.store('sett').wadsworth
    const is_shuffle = Alpine.store('sett').shuffleMode > 0

    return videos.map(v => {
      let start = 0
      let end = v.duration

      if (is_wadsworth) start = Math.round(end * 0.3)
      if (is_shuffle) end = start + Number(Alpine.store('sett').shuffleMode)

      const newDuration = end - start
      return { ...v, duration: newDuration, start, end }
    })
  },
  playVideo: function (v: Entree) {
    app.markVideoWatched(v)
    Alpine.store('sett').selectedVideo = app.timeshift([v])[0]
    Alpine.nextTick(() => { app.refreshView() })
  },
  automaticPlay: function () {
    const timer = (s: number) => new Promise(res => setTimeout(res, s * 1000))

    async function run() {
      const videos = app.timeshift(Alpine.store('entries'))

      for (let v of videos) {
        const oldCount = videos.length
        if (Alpine.store('sett').autoplay) {

          if (v.duration && v.duration > 1) {
            app.playVideo(v)
            await timer(v.duration)
          }

          const newCount = Alpine.store('entries').length
          if (newCount > oldCount) {
            run()
            break;
          }

        }
      }
    }

    app.log('Starting autoplay')
    run();
  },
  stopAutomaticPlay: function () {
    app.log('Stopping autoplay')
    Alpine.store('sett').autoplay = false
  },
  playRandom: function () {
    if (Alpine.store('sett').autoplay)
      app.stopAutomaticPlay();
    const v = shuffle(Alpine.store('entries'))
    app.playVideo(v)
  },
  exportCSVPlaylists: function () {
    alasql("SELECT * INTO CSV('playlists.csv',{headers:true}) FROM ?", [Alpine.store('playlists')])
    app.log('Playlist CSV Exported')
  },
  exportCSVEntries: function () {
    alasql("SELECT * INTO CSV('videos.csv',{headers:true}) FROM ?", [Alpine.store('entries')])
    app.log('Videos CSV Exported')
  },
<<<<<<< HEAD
  isWatched: function (v: Entree) {
    return alasql('select value FROM watched where ie_key=? and id=?', [v.ie_key, v.id])?.length > 0
  },
  markWatched: function (v: Entree) {
    // if (app.isWatched(v)) return;
    app.log(`Marked as watched ${v.title} [${v.id}] of ${v.original_url}`)
    alasql('INSERT INTO watched SELECT * FROM ?', [[{ ie_key: v.ie_key, id: v.id }]])
  },
  markUnwatched: function (v: Entree) {
=======
  isVideoWatched: function (v: Entree) {
    return alasql('select value FROM watched where ie_key=? and id=?', [v.ie_key, v.id])?.length > 0
  },
  markVideoWatched: function (v: Entree) {
    // if (app.isVideoWatched(v)) return;
    app.log(`Marked as watched ${v.title} [${v.id}] of ${v.original_url}`)
    alasql('INSERT INTO watched SELECT * FROM ?', [[{ ie_key: v.ie_key, id: v.id }]])
  },
  markVideoUnwatched: function (v: Entree) {
>>>>>>> origin/main
    alasql('DELETE FROM watched where ie_key=? and id=?', [v.ie_key, v.id])
    app.log(`Marked ${v.ie_key} video ${v.id} as unwatched`)
  },
  deletePlaylist: function (pl: Playlist) {
    alasql('delete from playlists where original_url = ?', [pl.original_url]);
    alasql('delete from entries where original_url = ?', [pl.original_url]);
    app.refreshView()
    app.log(`Deleted playlist ${pl.original_url}`)
  },
  deletePlaylist: function (pl: Playlist) {
    alasql('delete from playlists where original_url = ?', [pl.original_url]);
    alasql('delete from entries where original_url = ?', [pl.original_url]);
    app.refreshView()
    app.log(`Deleted playlist ${pl.original_url}`)
  },
  deletePlaylist: function (pl: Playlist) {
    alasql('delete from playlists where original_url = ?', [pl.original_url]);
    alasql('delete from entries where original_url = ?', [pl.original_url]);
    app.refreshView()
    app.log(`Deleted playlist ${pl.original_url}`)
  },
  renderVideo: function (v: Entree) {
    function wrapPlayer(player: string) {
      return `<div style="height:50vh">${player}</div>`
    }
    let rhtml = ''
    if (v.ie_key == 'Youtube') rhtml = wrapPlayer(youtube(v))
    if (v.ie_key == 'Vimeo') rhtml = wrapPlayer(vimeo(v))

<<<<<<< HEAD
    if (rhtml !== '') app.markWatched(v)
=======
    if (rhtml !== '') app.markVideoWatched(v)
>>>>>>> origin/main

    return rhtml
  },
  renderPlaylists: function () {
    const countWatched = `alasql('select value count(distinct id) from watched')`
    const countTotal = `alasql('select value count(distinct id) from entries')`

    const tableHead = `<thead>
  <tr>
    <td colspan="2">
        <div>
          <span>Playlists</span>
        </div>
    </td>
    <td colspan="2">
      <p style="float:right;"
        x-text="'All playlists: '
                  + app.secondsToFriendlyTime($store.entries.reduce((p,x) => p + (x.duration ?? 0), 0)) + ' ' + ($store.sett.hideWatched ? 'remaining' : 'total')">
      </p>
    </td>
  </tr>
  <tr>
    <td>Title</td>
    <td title="Playlist Author">Channel</td>
    <td>Delete</td>
    <td>Duration</td>
  </tr>
</thead>`

    const plVideosCount = `$store.entries.filter(x=> x.original_url == pl.original_url).length`
    const playlistRow = `<tr>
  <td><a :href="pl.webpage_url" x-text="pl.title"></a></td>
  <td><a :href="pl.channel_url" x-text="pl.uploader"></a></td>
  <td>
    <span @click="app.deletePlaylist(pl)" style="cursor: pointer;" class="material-icons-outlined">delete</span>
  </td>
  <td>
    <p x-text="
          app.secondsToFriendlyTime(pl.duration) + ' ' + ($store.sett.hideWatched ? 'remaining' : 'total')
      "></p>
  </td>
</tr>`

    const tableFoot = html`<template x-if="$store.playlists > 0">
  <tfoot>
    <tr>
      <td colspan="100">
        <div style="display: flex; justify-content: space-between; margin: 0 .5rem;"></div>
      </td>
    </tr>

  </tfoot>
</template>`
    return `<table>
  ${tableHead}
  <tbody>
    <template x-for="(pl, pindex) in $store.playlists" :key="pindex">
      ${playlistRow}
    </template>
  </tbody>
  ${tableFoot}
</table>`
  },
  renderEntrees: function () {
    const countAllWatched = `alasql('select value count(distinct id) from watched')`
    const countEntriesWatched = `alasql('select value count(distinct entries.id) from entries join watched using ie_key, id')`

    const tableHead = `<thead>
  <tr>
    <td colspan="3">
      <template x-if="$store.entries.length > 0">
        <div style="display:flex;justify-content: space-between;">
          <span
            x-text="'Videos ('+
<<<<<<< HEAD
              $store.entries.length.toLocaleString() + ($store.sett.hideWatched && (${countEntriesWatched} > 0)
=======
              $store.entries.length + ($store.sett.hideWatched && (${countEntriesWatched} > 0)
>>>>>>> origin/main
              ? '; ' + ${countEntriesWatched} + ' watched or unavailable videos'
              : '') +')'
          "></span>
        </div>
      </template>
    </td>
    <td colspan="4">
      <p style="float:right;" x-text="'Total watched: '+ ${countAllWatched} + ' videos'"></p>
    </td>
  </tr>
  <tr>
    <td>Play</td>
    <td>Title</td>
    <td>Watched</td>
    <td>Duration</td>
    <td>Uploader</td>
    <td>URL</td>
    <td>Playlist Title (channel)</td>
  </tr>
</thead>`

    const videoRow = html`<tr>
  <td>
    <span @click="app.playVideo(v)" style="cursor: pointer;" class="material-icons-outlined">play_circle</span>
  </td>
  <td><span x-text="v.title" :title="v.title"></span></td>
  <td>
    <button @click="v.watched ? app.markUnwatched(v) : app.markWatched(v); app.refreshView()"
      x-text="v.watched ? 'Mark unwatched' : 'Mark watched'"></button>
  </td>
  <td><span x-text="app.secondsToFriendlyTime(v.duration)"></span></td>
  <td><span x-text="v.uploader"></span></td>
  <td><a :href="v.url" target="_blank">🔗</a></td>
  <td><span x-text="v.playlist_title +' ('+ v.channel +')'"></span></td>
</tr>`

    const tableFoot = html`<template x-if="$store.playlists > 0">
  <tfoot>
    <tr>
      <td colspan="100">
        <div style="display: flex; justify-content: space-between; margin: 0 .5rem;"></div>
      </td>
    </tr>

  </tfoot>
</template>`

    return `<table>
  ${tableHead}
  <tbody>
    <template x-for="(v, vindex) in $store.entries.slice(0,800)" :key="vindex">
      ${videoRow}
    </template>
  </tbody>
  ${tableFoot}
</table>`
  },
  createDB: function (dbname: string) {
<<<<<<< HEAD
    let db = new Dexie(dbname);
    db = createStore(db)

    window.dbs[dbname] = db
  },
  importDB: async function (event: Event) {
    const file = event.target.files[0];
    const newdbname = file.name.split('.')[0].replace('(', '_').replace(')', '')

    // app.createDB(newdbname)

    app.log("Importing " + file.name);

    const importMeta = await peekImportFile(file);
    app.log("Database name:", importMeta.data.databaseName);
    app.log("Database version:", importMeta.data.databaseVersion);
    app.log("Tables:", importMeta.data.tables.map((t: { name: any; rowCount: any; }) =>
      `${t.name} (${t.rowCount} rows)`
    ).join('\n\t'));

    const importOptions = {
      progressCallback
    }

    if (newdbname in window.dbs)
      await importInto(window.dbs[newdbname], file, importOptions)
    else
      window.dbs[newdbname] = await importDB(file, importOptions);

    app.refreshView()

    function progressCallback({ completedRows, done }: ImportProgress) {
      app.log(`db import: ${completedRows} rows imported`)
      if (done)
        return app.log(`db import: complete`)
    }
  },
  exportDB: async function (dbname: string = Object.keys(window.dbs)[0]) {
    const blob = await exportDB(window.dbs[dbname], { progressCallback });
    downloadBlob(blob, dbname)

    function progressCallback({ completedRows, done }: ExportProgress) {
      app.log(`db export: ${completedRows} rows exported`)
      if (done)
        return app.log(`db export: complete`)
    }
  },
  deleteDB: async function (dbname: string = Object.keys(window.dbs)[0]) {
    await window.dbs[dbname].delete();
    location.reload()
  },
  randimal,
  onomonopia,
};

app.createDB('RuntimeDB')

if (devMode) {
  // app.fetchPlaylist('https://www.youtube.com/playlist?list=PLQhhRxYCuOXX4Ru03gUXURslatUNxk7Pm')
}

=======
    dbname = dbname + 'DB'

    alasql(`CREATE localStorage DATABASE IF NOT EXISTS ${dbname}`)
    alasql(`ATTACH localStorage DATABASE ${dbname}`)
    alasql(`USE DATABASE ${dbname}`)
    alasql('SET AUTOCOMMIT ON')

    alasql('CREATE TABLE IF NOT EXISTS entries');
    alasql('CREATE TABLE IF NOT EXISTS playlists');
    alasql('CREATE TABLE IF NOT EXISTS watched');
  },
  switchDB: function (dbname: string) {
    const oldDB = alasql.databases.dbo.databaseid
    alasql(`DETACH DATABASE ${oldDB}`)
    alasql(`ATTACH localStorage DATABASE ${dbname}`)
    app.refreshView()
  },
  importDB: async function (event: Event) {
    const newdbname = event.target.files[0].name.split('.')[0].replace('(', '_').replace(')', '')

    if (Object.keys(alasql.databases).includes(newdbname))
      throw new Error("New DB has the same name as existing. Delete existing DB first or rename the file");

    app.createDB(newdbname)
    let data = await fileToJSON(event)
    alasql.tables = data;
    app.refreshView()
  },
  exportDB: function (dbname: string = alasql.databases.dbo.databaseid) {
    downloadObjectAsJson(alasql.tables, dbname)
  },
  deleteDB: function (dbname: string = alasql.databases.dbo.databaseid) {
    alasql('drop table entries')
    alasql('drop table playlists')
    alasql(`DETACH database ${dbname}`)
    alasql(`drop localStorage database ${dbname}`)
    location.reload()
  },
  randimal,
  onomonopia,
};

app.createDB('Runtime')

if (devMode) {
  // app.fetchPlaylist('https://www.youtube.com/playlist?list=PLQhhRxYCuOXX4Ru03gUXURslatUNxk7Pm')
}

>>>>>>> origin/main
Alpine.start()
app.refreshView()

if (!devMode && Math.random() < 0.05) fullstory();
