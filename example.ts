// import './app.css'
// export * from './lib/TinkerButton.svelte'
// @ts-ignore
const interpolate = d3.interpolateLab;
// @ts-ignore
const eases = Object.fromEntries(Object.entries(d3).filter((a) => a.toString().startsWith('ease')).map(([a, b]) => [a.substring(4), b]))
// console.log(typeof d3)

// import App from './lib/App.svelte'
// export * from './lib/Counter.svelte'

// const app = new App({
//   target: document.getElementById('app')
// })
// export default app
const audio = new Audio();
audio.loop = true;
let current;
let animateID;
let audioID;
const keys = [...document.querySelectorAll('tinker-button')].reduce((obj, btn) => {
  // @ts-ignore
  obj[btn.letter.toLowerCase()] = btn
  return obj;
}, {})


// const getSound = (query, random = false) => {
//   if (/https:\/\/cdn\.freesound\.org\/previews\/(\S)+\.mp3/.test(query)) {
//       sound = query;
//   } else {
//       const url = `https://freesound.org/apiv2/search/text/?query=${query}+"&fields=name,previews&token=U5slaNIqr6ofmMMG2rbwJ19mInmhvCJIryn2JX89&format=json`;
//       fetch(url)
//           .then((response) => response.json())
//           .then((data) => {
//               // console.log(data.results, data.results.length);
//               if (data.results.length >= 1)
//                   var src = random
//                       ? choice(data.results).previews["preview-hq-mp3"]
//                       : data.results[0].previews["preview-hq-mp3"];
//               console.log(src);
//               sound = src;
//           })
//           .catch((error) => console.log(error));
//   }
// };

const playSound = (soundLink, duration) => {
  console.log('playing', soundLink)
  if (soundLink) {
    if(!audio.paused){
      audio.pause()
    }
    audio.src = soundLink;
    audio.play();
    setTimeout(() =>{console.log('pausing'); audio.pause()}, duration)
  }
  return
}
const runKey = (key) => {
  const { color: { hex }, duration, easing, sound_only, soundLink } = key
  const ease = eases[easing]
  if (sound_only) {
    playSound(soundLink, duration);
    return
  }
  if(soundLink){
    playSound(soundLink, duration);
  }

  if (animateID) {
    cancelAnimationFrame(animateID)
  }
  const startTime = performance.now();

  function animate(now) {
    let background = document.body.style.backgroundColor || getComputedStyle(document.body)
      .getPropertyValue('--background-body');
    const timeSinceStart = (now - startTime);

    // l goes from 0 to 1;
    //@ts-ignore
    const l = ease(Math.min(timeSinceStart / duration, 1));
    current = interpolate(background, hex)(l)
    document.body.style.backgroundColor = current
    if (l < 1) {
      animateID = requestAnimationFrame(animate);
    }
  }
  animateID = requestAnimationFrame(animate);
}



document.onkeydown = (event: KeyboardEvent) => {
  if (event.isComposing || (event.target as Element).tagName === 'TINKER-BUTTON') {
    return;
  }
  keys[event.key] ? runKey(keys[event.key]) : undefined;
}

