new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "Runaway (Radio Edit 2)",
          artist: "AURORA",
          cover: "tenor.gif",
          source: "canción para escapar de la realidad por un rato_50k.mp3",
          url: "https://www.youtube.com/watch?v=Lgbp6gvSkjY&t=487s",
          favorited: false
        },
        {
          name: "Talk to Me",
          artist: "Cavetown",
          cover: "tenor2.gif",
          source: "una canción bonita para dedicarte a ti mismo ♡_50k.mp3",
          url: "https://www.youtube.com/watch?v=PqEMWgrzZ0U",
          favorited: true
        },
        {
          name: "Nunca es suficiente",
          artist: "Natalia Lafourcade",
          cover: "tenor3.gif",
          source: "natalia lafourcade; nunca es suficiente; letra_50k.mp3",
          url: "https://www.youtube.com/watch?v=1KFeKwmnNTQ",
          favorited: false
        },
        {
          name: "All of me",
          artist: "John Legend",
          cover: "tenor4.gif",
          source: "John Legend - All of me (subtitulado al español)_50k.mp3",
          url: "https://www.youtube.com/watch?v=Lgbp6gvSkjY&t=487s",
          favorited: false
        },
        {
          name: "Khalid—lovely",
          artist: "Eillie Eilish",
          cover: "tenor5.gif",
          source: "_Bart Simpson.mp3",
          url: "https://www.youtube.com/channel/UCvGavc_2FesWicrCaJwcj4A",
          favorited: true
        },
        {
          name: "Botella Tras Botella ",
          artist: "Gera MX, Christian Nodal",
          cover: "tenor6.gif",
          source: "Gera MX, Christian Nodal - Botella Tras Botella (Video Oficial)_50k.mp3",
          url: "https://www.youtube.com/watch?v=Lgbp6gvSkjY&t=487s",
          favorited: false
        },
        {
          name: "Bajo El Agua",
          artist: "Manuel Medrano",
          cover: "tenor7.gif",
          source: "Manuel Medrano - Bajo El Agua (Video Oficial).mp3",
          url: "https://www.youtube.com/watch?v=Lgbp6gvSkjY&t=487s",
          favorited: true
        },
        {
          name: "Perdoname",
          artist: "Deorro ft.",
          cover: "tenor8.gif",
          source: "Perdóname (letra) __  Deorro ft. Dycy.mp3",
          url: "https://www.youtube.com/channel/UCvGavc_2FesWicrCaJwcj4A",
          favorited: false
        },
        {
          name: "Lucky one",
          artist: "Mich",
          cover: "tenor9.gif",
          source: "Mich ; Lucky one ( Sub español + lyrics )._50k.mp3",
          url: "https://www.youtube.com/watch?v=59QW4bq13Dk",
          favorited: false
        }
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if(this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function() {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function() {
      vm.generateTime();
    };
    this.audio.onended = function() {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }
  }
});
