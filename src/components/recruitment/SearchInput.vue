<script setup lang="ts">
//vue3
import { defineEmits, ref } from "vue";

const emit = defineEmits(["input_src"]);

const isComposing = ref(false);
const onCompositionStart = () => {
  isComposing.value = true;
};
const onCompositionEnd = (e: Event) => {
  isComposing.value = false;
  input_src(e);
};

const input_src = (e: Event) => {
  if (isComposing.value) {
    return;
  }
  if ((e.target as HTMLInputElement).value === "") {
    return;
  }
  if (e) {
    emit("input_src", (e.target as HTMLInputElement).value);
  }
  return;
};
// const props = defineProps({
//    labelText : {
//     type:String,
//     default:"搜索"
//    },

// })
</script>
<template>
  <div>
    <form>
      <input
        id="search"
        required="false"
        pattern=".*\S.*"
        type="search"
        class="input"
        @input="input_src($event)"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
      />
      <span class="caret"></span>
    </form>
  </div>
</template>
<style scoped lang="scss">
@use "@/assets/styles";
$boderColor: #393e46;
.input {
  color: $boderColor;
  font:
    1em/1.5 Hind,
    sans-serif;
}

form,
.input,
.caret {
  margin: auto;
}

form {
  position: relative;
  width: 100%;
  max-width: 17em;
}

.input,
.caret {
  display: block;
  transition: all calc(1s * 0.5) linear;
}

.input {
  background: transparent;
  border-radius: 50%;
  box-shadow: 0 0 0 0.25em inset;
  caret-color: #255ff4;
  width: 2em;
  height: 2em;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.input:focus,
.input:valid {
  background: var(--primary);
  border-radius: 0.25em;
  box-shadow: none;
  padding: 0.75em 1em;
  transition-duration: calc(1s * 0.25);
  transition-delay: calc(1s * 0.25);
  width: 100%;
  height: 3em;
}

.input:focus {
  animation: showCaret 1s steps(1);
  outline: transparent;
}

.input:focus + .caret,
.input:valid + .caret {
  animation: handleToCaret 1s linear;
  background: transparent;
  width: 1px;
  height: 1.5em;
  transform: translate(0, -1em) rotate(-180deg) translate(7.5em, -0.25em);
}

.input::-webkit-search-decoration {
  -webkit-appearance: none;
}

label {
  position: absolute;
  top: -50%;
  left: 0;
  transform: translate(0, 50%);
  transition: all 1s;
  width: 100%;
  height: auto;
  font-size: 0.8em;
}

.caret {
  background: $boderColor;
  border-radius: 0 0 0.125em 0.125em;
  margin-bottom: -0.6em;
  width: 0.25em;
  height: 1em;
  transform: translate(0, -1em) rotate(-45deg) translate(0, 0.875em);
  transform-origin: 50% 0;
}

/* Animations */
@keyframes showCaret {
  from {
    caret-color: transparent;
  }

  to {
    caret-color: #255ff4;
  }
}

@keyframes handleToCaret {
  from {
    background: currentColor;
    width: 0.25em;
    height: 1em;
    transform: translate(0, -1em) rotate(-45deg) translate(0, 0.875em);
  }

  25% {
    background: currentColor;
    width: 0.25em;
    height: 1em;
    transform: translate(0, -1em) rotate(-180deg) translate(0, 0.875em);
  }

  50%,
  62.5% {
    background: #255ff4;
    width: 1px;
    height: 1.5em;
    transform: translate(0, -1em) rotate(-180deg) translate(7.5em, 2.5em);
  }

  75%,
  99% {
    background: #255ff4;
    width: 1px;
    height: 1.5em;
    transform: translate(0, -1em) rotate(-180deg) translate(7.5em, -0.25em);
  }

  87.5% {
    background: #255ff4;
    width: 1px;
    height: 1.5em;
    transform: translate(0, -1em) rotate(-180deg) translate(7.5em, 0.125em);
  }

  to {
    background: transparent;
    width: 1px;
    height: 1.5em;
    transform: translate(0, -1em) rotate(-180deg) translate(7.5em, -0.25em);
  }
}
</style>
