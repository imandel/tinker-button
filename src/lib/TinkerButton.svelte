<svelte:options tag="tinker-button" />

<script lang="ts">
     import { onMount } from "svelte";
    import "toolcool-color-picker";
    import type ColorPicker from "toolcool-color-picker";
    import * as d3 from "d3-ease";
    const eases = Object.entries(d3)
        .filter((a) => a.toString().startsWith("ease"))
        .map(([k, _]) => k.substring(4));


    export let sound = "";
    export let soundLink = "";
    export let letter = "";
    export let color: ColorPicker;
    export let color_code: string;
    export let duration = 0;
    export let sound_only = false;
    export let easing = "Linear";

   
    onMount(async () => {
        color.color = color_code;
        color.addEventListener("change", (evt: Event) => {
            color_code = (<CustomEvent>evt).detail.hex;
        });
        getSound(sound);
    });

    const choice = (arr) => {
        return arr[Math.floor(Math.random() * arr.length)];
    };
    const getSound = (query, random = false) => {
        console.log(query)
        if (query.length == 0) {
            soundLink = "";
            return;
        } else if (
            /https:\/\/cdn\.freesound\.org\/previews\/(\S)+\.mp3/.test(query)
        ) {
            soundLink = query;
        } else {
            const url = `https://freesound.org/apiv2/search/text/?query=${encodeURI(query)}&fields=name,previews&token=U5slaNIqr6ofmMMG2rbwJ19mInmhvCJIryn2JX89&format=json`;
            console.log(url)
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                      console.log(data.results, data.results.length);
                    if (data.results.length >= 1)
                        var src = random
                            ? choice(data.results).previews["preview-hq-mp3"]
                            : data.results[0].previews["preview-hq-mp3"];
                            console.log(src)
                            soundLink = src;
                })
                .catch((error) => console.log(error));
        }
    };
</script>

<div class="tinkerbtn">
    <h2>{letter}</h2>
    <div class="flexlabel">
        <div style="padding-right: 0.5em;">Color</div>
        <toolcool-color-picker bind:this={color} class:hidden={sound_only} />
        <div class="none-swatch" class:hidden={!sound_only} />
        <label style="padding-left: 0.5em;"
            >None<input
                type="checkbox"
                bind:checked={sound_only}
                on:change={() => {
                    if (sound_only) color_code = undefined;
                }}
            /></label
        >
    </div>
    <label>
        Time(ms)
        <input
            class="time"
            type="number"
            min="0"
            step="1"
            bind:value={duration}
            size="10"
        />
    </label>
    <br />
    <label
        >Easing
        <select bind:value={easing} disabled={sound_only}>
            {#each eases as ease}
                <option value={ease}>{ease}</option>
            {/each}
        </select>
    </label>
    <br />
    <label>
        Sound
        <input
            type="text"
            bind:value={sound}
            on:blur={() => {
                getSound(sound);
            }}
            size="15"
        />
    </label>
    <br />
</div>

<style>
    .tinkerbtn {
        width: 220px;
        max-height: 200px;
        padding: 8px;
        display: inline-block;
        border: 2px solid #c0c0c0;
        border-radius: 25px;
        position: relative;
        margin: 4px;
    }
    h2 {
        margin: 0px;
        /* padding: 10px; */
        left: 205px;
        position: absolute;
    }
    .time {
        width: 7em;
    }
    .flexlabel {
        display: flex;
        align-items: center;
    }
    input,
    select {
        background: #dbdbdb;
        padding: 4px;
        border-radius: 4px;
        border: none;
        font-size: 1em;
    }
    select {
        background: #dbdbdb;
    }

    .none-swatch {
        background: repeating-linear-gradient(
            45deg,
            hsl(0, 0%, 73%),
            hsl(0, 0%, 73%) 10px,
            #6e6e6e 10px,
            #6e6e6e 20px
        );
        width: 3rem;
        height: 1.5rem;
        padding: 0.25rem;
        border-radius: 0.25rem;
        border-width: 1px;
        border-style: solid;
        border-color: #cecece;
        box-sizing: border-box;
    }
    .hidden {
        display: none;
    }

    :root {
  --background-body: #202b38;
  --background: #161f27;
  --background-alt: #1a242f;
  --selection: #1c76c5;
  --text-main: #dbdbdb;
  --text-bright: #fff;
  --text-muted: #a9b1ba;
  --links: #41adff;
  --focus: #0096bfab;
  --border: #526980;
  --code: #ffbe85;
  --animation-duration: 0.1s;
  --button-base: #0c151c;
  --button-hover: #040a0f;
  --scrollbar-thumb: var(--button-hover);
  --scrollbar-thumb-hover: rgb(0, 0, 0);
  --form-placeholder: #a9a9a9;
  --form-text: #fff;
  --variable: #d941e2;
  --highlight: #efdb43;
  --select-arrow: url("data:image/svg+xml;charset=utf-8,%3C?xml version='1.0' encoding='utf-8'?%3E %3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' height='62.5' width='116.9' fill='%23efefef'%3E %3Cpath d='M115.3,1.6 C113.7,0 111.1,0 109.5,1.6 L58.5,52.7 L7.4,1.6 C5.8,0 3.2,0 1.6,1.6 C0,3.2 0,5.8 1.6,7.4 L55.5,61.3 C56.3,62.1 57.3,62.5 58.4,62.5 C59.4,62.5 60.5,62.1 61.3,61.3 L115.2,7.4 C116.9,5.8 116.9,3.2 115.3,1.6Z'/%3E %3C/svg%3E");
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif;
  line-height: 2;
  max-width: 800px;
  margin: 20px auto;
  padding: 0 10px;
  word-wrap: break-word;
  color: #dbdbdb;
  color: var(--text-main);
  background: #202b38;
  background: var(--background-body);
  text-rendering: optimizeLegibility;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

.card {
  padding: 2em;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
input {
  transition:
    background-color 0.1s linear,
    border-color 0.1s linear,
    color 0.1s linear,
    box-shadow 0.1s linear,
    transform 0.1s ease;
  transition:
    background-color var(--animation-duration) linear,
    border-color var(--animation-duration) linear,
    color var(--animation-duration) linear,
    box-shadow var(--animation-duration) linear,
    transform var(--animation-duration) ease;
}

input {
  color: #fff;
  color: var(--form-text);
  background-color: #161f27;
  background-color: var(--background);
  font-family: inherit;
  font-size: inherit;
  margin-right: 6px;
  margin-bottom: 6px;
  padding: 10px;
  border: none;
  border-radius: 6px;
  outline: none;
  
}

</style>
